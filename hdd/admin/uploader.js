var maxFiles = 100;
var fileList = []; // Array to keep track of file objects
let progressContent = $("#progressbar");
let KVupload = $("#dropZone");
let addMoreBtn = $("#add-more-files");
let progressBar = document.getElementById("progress-bar");
let uploadingData = document.getElementById("uploadedData");
var remainingTimeElement = document.getElementById("remainingTime");
var startTime = Date.now();
var previousLoaded = 0;
let highestPercentage = 0;
let uploadModal = $("[data-uploadModal]");
let fetchType = "";
let shareid = "";
let checkType = "";
let type = "";
let id = "";
let selectedIdArray = [];
let currentPage = 1; // Start at the first page
const itemsPerPage = 10; // Number of items per page (you can adjust this)
let totalPages = 1;
function uploadFiles() {
    const activeTab = document.querySelector(".tabUpload.active");
    //console.log(activeTab);
    const uploadCheckValue = activeTab
        ? activeTab.getAttribute("data-uploadCheck")
        : null;
    switch (uploadCheckValue) {
        case "select":
            handleSelectFile();
            break;
        case "upload":
            handleUploadFiles();
            break;
        default:
            console.log("No valid tab selected");
    }
}
function fetchFiles(type = "", query = "", shareids = "", checkTypes = "") {
    $("[data-uploadModal]").modal("show");
    fetchType = type;
    checkType = checkTypes;
    (shareid = shareids), $("#filesListShow").empty();
    //$("#filesListShow").append(`<p clas="font-bold" >No Data Found</p>`);
    var formData = new FormData();
    formData.append("_token", token);
    formData.append("action", "fetch");
    formData.append("query", query);
    formData.append("type", fetchType);
    $.post({
        url: "/upload/action",
        data: formData,
        type: "POST",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.files != "") {
                displayFiles(
                    response.files,
                    shareid,
                    checkType,
                    $("#" + shareid).val()
                );
                selectFileCount();
            }
            currentPage=1;
            setupPagination();
        },
        error: function (xhr, status, error) {
            console.error("Error fetching files:", status, error, xhr);
        },
    });
}
// Handle file input change event
$("#fileInput,#addMoreFiles").on("change", function () {
    handleFiles($(this)[0].files);
});

// Handle drag-and-drop events
$("#dropZone").on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass("dragover");
});

$("#dropZone").on("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass("dragover");
});

$("#dropZone").on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass("dragover");
    var files = e.originalEvent.dataTransfer.files;
    handleFiles(files);
});

// Handle files and update file list
function handleFiles(files) {
    if (fileList.length + files.length > maxFiles) {
        alert("You can only upload up to " + maxFiles + " files.");
        return;
    }
    $.each(files, function (i, file) {
        if (!fileList.some((f) => f.name === file.name)) {
            fileList.push(file);
            displayFile(file);
        }
    });
    updateTotalSize();
    updateFileCount();
}
// Function to display a file preview
function File(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        const fileType = file.type;
        let previewContent;
        if (fileType.startsWith("image/")) {
            previewContent = `<img src="${e.target.result}" alt="Preview">`;
        } else if (fileType.startsWith("video/")) {
            previewContent = `<video controls>
                <source src="${e.target.result}" style="max-width: 200px; height: 200px; border-radius: 5px;" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        } else if (fileType === "application/pdf") {
            previewContent = `<iframe src="${e.target.result}">
                This browser does not support PDFs. Please download the PDF to view it: <a href="${e.target.result}">Download PDF</a>.
            </iframe>`;
        } else if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            previewContent = `<p class ="docx" >DOCX preview not supported. <a href="${e.target.result}" download="${file.name}">Download DOCX</a></p>`;
        } else {
            previewContent = `<p>Preview not available for this file type. <a href="${e.target.result}" download="${file.name}">Download file</a></p>`;
        }

        $("#file-list").append(
            `<div class="px-2 col-md-3 col-lg-2 col-4 show-list">
            <div class="file-item" data-file-name="${file.name}">
                ${previewContent}
                 <div class="text-start w-100 ms-1 px-1 position-absolute bottom-5">
                            <div class="text-turncate">
                                <span class="text-dark font-bold">${file.name}</span>
                            </div>
                           
                        </div>
                <button type="button" class="remove-btn" onclick="removeImage(this, '${file.name}')">×</button>
            </div>
            </div>`
        );
    };

    reader.readAsDataURL(file);
}

// Function to remove a file
function removeImage(button, fileName) {
    fileList = fileList.filter((file) => file.name !== fileName);
    $(button).closest(".show-list").remove();
    $("#fileInput").val("");
    updateTotalSize();
    updateFileCount();
}

// Function to update total size display
function updateTotalSize() {
    var totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
    $("#totalSize").text(
        "Total Size: " + (totalSize / (1024 * 1024)).toFixed(2) + " MB"
    );
    $("#totalSizeDataForUpload").text(
        (totalSize / (1024 * 1024)).toFixed(2) + " MB"
    );
}

// Function to update file count display
function updateFileCount() {
    var fileCount = fileList.length;
    if (fileCount > 0) {
        KVupload.removeClass("d-flex");
        KVupload.addClass("d-none");
        addMoreBtn.removeClass("d-none");
    } else {
        KVupload.removeClass("d-none");
        KVupload.addClass("d-flex");
        addMoreBtn.addClass("d-none");
    }
    $("#file-count").text(fileCount + " File(s) selected");
}

function selectFileCount() {
    const checkedCount = $("input[name='file-selection']:checked").length;
    $("#file-count").text(checkedCount + " File(s) selected");
}

// Function to clear all files
function clearAllFiles() {
    if (confirm("Are you sure you want to clear all files?")) {
        fileList = [];
        $("#file-list").empty();
        $("#fileInput").val("");
        updateTotalSize();
        updateFileCount();
    }
}
// Event listeners
$("#images-clear").on("click", clearAllFiles);
// Handle file upload via AJAX
function handleUploadFiles() {
    var formData = new FormData();
    // Append each file to the FormData object
    $.each(fileList, function (i, file) {
        formData.append("files[]", file);
    });
    formData.append("_token", token);
    formData.append("action", "upload");

    $.ajax({
        url: "/upload/action",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        xhr: function () {
            var xhr = new XMLHttpRequest();
            var startTime = Date.now();
            var previousLoaded = 0;
            xhr.upload.addEventListener(
                "progress",
                function (e) {
                    if (e.lengthComputable) {
                        progressContent.removeClass("d-none");
                        var percentComplete = (e.loaded / e.total) * 100;
                        if (percentComplete > highestPercentage) {
                            highestPercentage = percentComplete;
                            document.getElementById(
                                "progress-bar"
                            ).style.width = highestPercentage + "%";
                        }
                        // Determine data units (KB/MB)
                        var loaded = e.loaded;
                        var total = e.total;

                        var loadedDisplay, totalDisplay;

                        if (total < 1024 * 1024) {
                            // Less than 1 MB
                            loadedDisplay = (loaded / 1024).toFixed(2) + " KB";
                            totalDisplay = (total / 1024).toFixed(2) + " KB";
                        } else {
                            // 1 MB or more
                            loadedDisplay =
                                (loaded / (1024 * 1024)).toFixed(2) + " MB";
                            totalDisplay =
                                (total / (1024 * 1024)).toFixed(2) + " MB";
                        }

                        uploadingData.textContent = loadedDisplay;
                        //totalSizeDataForUpload.textContent = totalDisplay;
                        // Calculate elapsed time and remaining time
                        var elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
                        var uploadSpeed =
                            (e.loaded - previousLoaded) / elapsedTime; // Bytes per second
                        var remainingBytes = e.total - e.loaded;
                        var remainingTime =
                            uploadSpeed > 0
                                ? remainingBytes / uploadSpeed
                                : Infinity;
                        var remainingTimeDisplay = "Estimating...";
                        if (uploadSpeed > 0) {
                            var minutes = Math.floor(remainingTime / 60);
                            var seconds = Math.floor(remainingTime % 60);
                            remainingTimeDisplay =
                                minutes + " min " + seconds + " sec";
                        }
                        var speedFactor = Math.max(uploadSpeed / 1000, 1); // Ensure speedFactor is at least 1
                        var animationDuration = Math.max(2 / speedFactor, 1);
                        document.getElementById(
                            "loading-circle"
                        ).style.animationDuration = animationDuration + "s";
                        previousLoaded = e.loaded;
                        remainingTimeElement.textContent = remainingTimeDisplay;
                        previousLoaded = e.loaded;
                        if (uploadSpeed < 5000) {
                            document
                                .getElementById("loading-circle")
                                .classList.add("stop-upload");
                        } else {
                            document
                                .getElementById("loading-circle")
                                .classList.remove("stop-upload");
                        }
                    }
                },
                false
            );

            return xhr;
        },
        success: function (response) {
            if (response.error == false) {
                // displayFiles(
                //     response.data,
                //     shareid,
                //     checktype,
                //     $("#" + shareid).val()
                // );

                fetchFiles(fetchType, "", shareid, checkType);
            }
            alertshow(response.error, response.message);
            fileList = [];
            $("#file-list").empty();
            $("#uploadedData").text("0 KB");
            updateTotalSize();
            updateFileCount();
            document.getElementById("progress-bar").style.width = 0 + "%";
            remainingTimeElement.textContent = "Upload complete";
            progressContent.addClass("d-none");
        },
        error: function (xhr, status, error) {
            console.error("Upload failed:", status, error);
        },
    });
}

// Function to display a file preview
function displayFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        const fileType = file.type;
        let previewContent;
        if (fileType.startsWith("image/")) {
            previewContent = `<img src="${e.target.result}" alt="Preview">`;
        } else if (fileType.startsWith("video/")) {
            previewContent = `<video controls>
                <source src="${e.target.result}" style="max-width: 200px; height: 200px; border-radius: 5px;" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        } else if (fileType === "application/pdf") {
            previewContent = `<iframe src="${e.target.result}">
                This browser does not support PDFs. Please download the PDF to view it: <a href="${e.target.result}">Download PDF</a>.
            </iframe>`;
        } else if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            previewContent = `<p class ="docx" >DOCX preview not supported. <a href="${e.target.result}" download="${file.name}">Download DOCX</a></p>`;
        } else {
            previewContent = `<p>Preview not available for this file type. <a href="${e.target.result}" download="${file.name}">Download file</a></p>`;
        }

        $("#file-list").append(
            `<div class="px-2 col-md-3 col-lg-2 col-4 show-list">
            <div class="file-item" data-file-name="${file.name}">
                ${previewContent}
                 <div class="text-start w-100 ms-1 px-1 position-absolute bottom-5">
                            <div class="text-turncate">
                                <span class="text-dark font-bold">${file.name}</span>
                            </div>

                        </div>
                <button type="button" class="remove-btn" onclick="removeImage(this, '${file.name}')">×</button>
            </div>
            </div>`
        );
    };

    reader.readAsDataURL(file);
}

function displayFiles(fileData, fileId = "", types = "", selectedIds = "") {
    files = fileData;
    type = types;
    id = fileId;
    selectedIdArray = Array.isArray(selectedIds)
        ? selectedIds.map((id) => id.toString())
        : selectedIds
        ? selectedIds
              .toString()
              .split(",")
              .map((id) => id.trim())
        : [];

    // Sort files: prioritize selected files first
    files.sort((a, b) => {
        const aIndex = selectedIdArray.indexOf(a.id.toString());
        const bIndex = selectedIdArray.indexOf(b.id.toString());
    
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex; // Maintain the order of selected items
        } else if (aIndex !== -1) {
            return -1; // Place selected items first
        } else if (bIndex !== -1) {
            return 1; // Place selected items first
        } else {
            return 0; // Keep other files in their original order
        }
    });
    // Calculate total number of pages
    totalPages = Math.ceil(files.length / itemsPerPage); 
   // Show files for the current page, passing selectedIdArray as an argument
    showPage(files, currentPage, selectedIdArray, type, id);

    // Set up the pagination buttons
    setupPagination();
}

// Function to show files for the current page
function showPage(files, page, selectedIdArray, type, id) {
    // Added selectedIdArray as an argument

    // // Calculate start and end index for current page
    // const startIndex = (page - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage;

    // // Get the files for this page
    // const filesToShow = files.slice(startIndex, endIndex);

    // console.log("selectedArray:", selectedIdArray); // Debug files for the page

    // // Clear the current file list
    // $("#filesListShow").empty();

    // Loop through the files and add them to the DOM
    files.forEach((file) => {
        const fileType = file.type;
        let previewContent;

        if (fileType == "image") {
            previewContent = `<img src="${file.external_link}" lazyload alt="Preview">`;
        } else if (fileType == "video") {
            previewContent = `<video controls style="max-width: 200px; height: 200px; border-radius: 5px;">
                <source src="${file.external_link}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        } else if (fileType === "pdf") {
            previewContent = `<iframe src="${file.external_link}" width="100%" height="500px">
                This browser does not support PDFs. Please download the PDF to view it: <a href="${file.external_link}">Download PDF</a>.
            </iframe>`;
        } else if (fileType === "document") {
            previewContent = `<p class="docx">DOCX preview not supported. <a href="${file.external_link}" download="${file.file_name}">Download DOCX</a></p>`;
        } else {
            previewContent = `<p>Preview not available for this file type. <a href="${file.external_link}" download="${file.file_name}">Download file</a></p>`;
        }

        const isChecked = selectedIdArray.includes(file.id.toString())
            ? "checked"
            : "";
        const fileActive = selectedIdArray.includes(file.id.toString())
            ? "active"
            : "";

        $("#filesListShow").append(
            `<div class="col-lg-2 col-md-3 col-4 px-1">
              <label class="w-100 pointer" for="radio-${file.id}" >
                <input type="${type != "" ? type : "radio"}" class="d-none" 
                  data-value="'${file.external_link}','${fileType}','${
                file.id
            }',${id},${file.original_name}" 
                  name="file-selection" value="${
                      file.id
                  }" ${isChecked} id="radio-${file.id}">
                <div class="file-item ${fileActive}" data-file-name="${
                file.file_name
            }">
                  ${previewContent}
                  <div class="text-start w-100 px-1 position-absolute bottom-0">
                    <div class="text-turncate">
                        <span class="text-dark font-bold">${
                            file.original_name
                        }</span>
                    </div>
                    <p class="m-0 p-0">${file.file_size}</p>
                    <button data-file-type="${fileType}" data-file-link="${
                file.external_link
            }" 
                      data-file-name="${
                          file.file_name
                      }" class="btn btn-light d-flex align-items-center justify-content-center" 
                      style="width:30px;height:30px;position: absolute; right: 10px; top: 1px; background-color: white; border-radius: 50%;" 
                      data-bs-toggle="modal" data-bs-target="#previewImageUploader">
                        <i class="fas fa-eye text-primary"></i>
                    </button>
                  </div>
                </div>
              </label>
            </div>`
        );
    });
}

// Function to set up the pagination buttons
function setupPagination() {
    // Enable or disable the "Previous" and "Next" buttons based on the current page
    $("#prevPage").prop("disabled", currentPage === 1);
    $("#nextPage").prop("disabled", currentPage === totalPages);
}

// "Previous" button click handler
$("#prevPage").click(function () {
    if (currentPage > 1) {
        currentPage--;
        showPage(files, currentPage, selectedIds, type, id);
        setupPagination();
    }
});

// "Next" button click handler
$("#nextPage").click(function () {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(files, currentPage, selectedIds, type, id);
        setupPagination();
    }
});

function updateProgressBar(e) {
    // Calculate the current percentage
    let percentComplete = (e.loaded / e.total) * 100;

    // Update only if the new percentage is greater than the highest recorded percentage
    if (percentComplete > highestPercentage) {
        highestPercentage = percentComplete;
        document.getElementById("progress-bar").style.width =
            highestPercentage + "%";
    }
}
function handleSelectFile() {
    let fileNameList = [];
    let selectedIds=[];
    $('input[name="file-selection"]:checked').each(function () {
        const dataValue = $(this).data("value");
        const fileData = dataValue.replace(/'/g, "").split(",");
        if (fileData.length >= 3) {
            const fileUrl = fileData[0];
            const fileType = fileData[1];
            const fileId = fileData[2];
            const uploadID = fileData[3];
            const fileName = fileData[4];
            selectedIds.push(fileId);
            //let chooseContainer = "#choosedFile-" + uploadID;
            let chooseContainer = "#choosedFile-" + uploadID;
            let choosedFile = $(chooseContainer);
            //choosedFile.text(fileName);
            fileNameList.push(fileName);
            displayFileInPreview(uploadID, fileUrl, fileType);
            uploadModal.modal("hide");
            const joinedIds = selectedIds.join(",");
            $("#" + uploadID).val(joinedIds);
            if (selectedIds.length > 1) {
                $(chooseContainer).text(
                    `'Total Selected'+${selectedIds.length}`
                );
            } else {
                $(chooseContainer).text(fileNameList.join(", "));
            }
        } else {
            console.error("Unexpected data format:", dataValue);
        }
    });
}
function displayFileInPreview(id, link, type) {
    const fileUrl = link;
    const fileType = type;
    let content;
    const previewConId = "#previewSelectionData-" + id;
    let previewCon = $(previewConId);

    if (fileType === "image") {
        const img = $("<img>")
            .attr("src", fileUrl)
            .attr("alt", "File preview")
            .css({
                "max-width": "200px",
                "max-height": "200px",
                margin: "5px",
                "border-radius": "5px",
            });
        content = `
            <div class="file-item h-auto border-none overflow-hidden" style="max-height:200px; max-width:200px;">
                ${img[0].outerHTML}
                <button type="button" class="remove-btn" onclick="removeFileFromPreview(this, '${id}')">×</button>
            </div>
        `;
    } else if (fileType == "video") {
        content = `
            <div class="file-item h-auto border-none overflow-hidden" style="max-height:200px; max-width:200px;">
                <video autoplay muted loop style="max-width: 200px; max-height: 200px; border-radius: 5px;">
                    <source src="${fileUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <button type="button" class="remove-btn" onclick="removeFileFromPreview(this, '${id}')">×</button>
            </div>
        `;
    } else if (fileType === "pdf") {
        content = `
            <div class="file-item h-auto border-none overflow-hidden" style="max-height:200px; max-width:200px;">
                <iframe src="${fileUrl}" style="width: 200px; height: 200px; border-radius: 5px;"></iframe>
                <button type="button" class="remove-btn" onclick="removeFileFromPreview(this, '${id}')">×</button>
            </div>
        `;
    } else if (fileType === "doc") {
        content = `
            <div class="file-item h-auto border-none overflow-hidden" style="max-height:200px; max-width:200px;">
                <p>DOCX preview not supported. <a href="${fileUrl}" download>Download DOCX</a></p>
                <button type="button" class="remove-btn" onclick="removeFileFromPreview(this, '${id}')">×</button>
            </div>
        `;
    } else {
        content = "<p>No preview available</p>";
    }

    if (previewCon.length) {
        previewCon.empty();
        previewCon.removeClass("d-none").append(content);
    } else {
        console.error("Preview container not found:", previewConId);
    }
}
function removeFileFromPreview(remove, id) {
    const previewConId = "#previewSelectionData-" + id;
    let previewCon = $(previewConId);
    previewCon.addClass("d-none");
    $("#" + id).val("");
    let chooseContainer = "#choosedFile-" + id;
    let choosedFile = $(chooseContainer);
    choosedFile.text("Choose File");
}

$("body").on("change", "input[name='file-selection']", function () {
    $(".file-item").removeClass("active");
    $("input[name='file-selection']:checked").each(function () {
        $(this).closest(".col-lg-2").find(".file-item").addClass("active");
    });

    selectFileCount();
});
$(document).on(
    "click",
    '[data-bs-target="#previewImageUploader"]',
    function (event) {
        const kvUploaderModal = new bootstrap.Modal(
            document.getElementById("KVUploaderModal"),
            {
                backdrop: "static", // Prevent closing the modal on backdrop click
                keyboard: false,
            }
        );
        // Show the preview modal
        kvUploaderModal.show();
        event.preventDefault();
        const fileLink = $(this).data("file-link");
        const fileType = $(this).data("file-type");
        const fileName = $(this).data("file-name");
        let previewContent = "";

        if (fileType === "image") {
            previewContent = `<img src="${fileLink}" alt="${fileName}" style="max-width: 100%; height: auto;">`;
        } else if (fileType === "video") {
            previewContent = `
            <video controls style="max-width: 100%; height: auto;">
                <source src="${fileLink}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
        } else if (fileType === "pdf") {
            previewContent = `
            <iframe src="${fileLink}" width="100%" height="500px">
                This browser does not support PDFs. Please download the PDF to view it: 
                <a href="${fileLink}">Download PDF</a>.
            </iframe>
        `;
        } else if (fileType === "document") {
            previewContent = `
            <p>Document preview not supported. 
            <a href="${fileLink}" download="${fileName}">Download ${fileName}</a></p>
        `;
        } else {
            previewContent = `<p>Preview not available for this file type. 
            <a href="${fileLink}" download="${fileName}">Download file</a></p>`;
        }

        // Set the content in the modal
        $(".preview-content").html(previewContent);
        $(".modal-backdrop").addClass("preview-backdrop");
    }
);

$(document).on("click", "[data-close-id]", function (event) {
    event.preventDefault();

    const id = $(this).data("close-id");

    $(`#previewSelectionData-${id}`).empty().removeClass("file-item");

    $(`#${id}`).val("");
});

$("#previewImageUploader").on("hidden.bs.modal", function () {
    $(".modal-backdrop").removeClass("preview-backdrop");
});
        