var token = $('meta[name="csrf-token"]').attr("content");
let dmsError = document.querySelectorAll(".dmsError");
$(document).ready(function () {
    var errorMessage = $(".toast-alert");
    setTimeout(function () {
        errorMessage.removeClass("show");
    }, 5000);
    $("[data-close-btn ]").click(function () {
        errorMessage.removeClass("show");
    });
    toggleMenuIconClass();
    $("#slidetoggle").click(function () {
        $("#slide").slideToggle();
        $("#icon-caret").toggleClass("fa-caret-down fa-caret-up");
    });
    $("#menushow,[data-menu-close]").click(function () {
        $("#sidebar").toggleClass("menu");
        $("#main-content").toggleClass("content-main");
        if ($(window).width() >= 992) {
            $("#Ismenuchange").toggleClass(
                "fa-angle-double-left fa-angle-double-right"
            );
        } else {
            // For medium (md), small (sm), and extra-small (xs) screens
            $("#Ismenuchange").toggleClass(
                "fa-angle-double-right fa-angle-double-left"
            );
        }
    });
    $("[data-password-show]").hide();
    // Show toggle icon when input field has a value
    $("input[type='password']").on("input", function () {
        var inputId = $(this).attr("id");
        var toggleIcon = $("[data-password-show='" + inputId + "']");
        if ($(this).val() !== "") {
            toggleIcon.show();
        } else {
            toggleIcon.hide();
        }
    });
    // Toggle password visibility
    $("[data-password-show]").on("click", function () {
        var inputId = $(this).data("password-show");
        var input = $("#" + inputId);
        var icon = $(this).find("i");

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            icon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            input.attr("type", "password");
            icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });
    $("#password,[data-password]").on("keyup keydown", function () {
        let password = $(this).val();
        let message = $(this).siblings(".error_message");
        if (password.length < 8) {
            message.html("Password must be at least 8 characters long");
        } else {
            message.html("");
        }
    });
    $("[data-confirmpassword],[data-password]").on("keyup", function () {
        let conpassword = $("[data-confirmpassword]").val();
        let password = $("[data-password]").val();
        let message = $("[data-confirmpassword]").siblings(".error_message");
        if (password !== conpassword) {
            message.html("Password  not match");
        } else {
            message.html("");
        }
    });
    $("#phone,[data-phone]").keyup(function () {
        var phoneNumber = $(this).val();
        var messageElement = $(this).siblings(".error_message");
        if (/^\d{10}$/.test(phoneNumber)) {
            messageElement.html("");
        } else {
            messageElement.html("Phone number must contain 10 digits only");
        }
    });
    $("[data-scn]").keyup(function () {
        var inputText = $(this).val();
        var messageElement = $(this).siblings(".error_message");
        var alphanumericPattern = /^[a-zA-Z0-9\s]*$/;
        if (alphanumericPattern.test(inputText)) {
            messageElement.html("");
            $(this).removeClass("is-invalid");
        } else {
            messageElement.html("Special characters are not allowed");
            $(this).addClass("is-invalid");
        }
    });
    $("[data-int]").keyup(function () {
        var inputText = $(this).val();
        var messageElement = $(this).siblings(".error_message");
        var integerPattern = /^[0-9]*$/;
        if (integerPattern.test(inputText)) {
            messageElement.html("");
            $(this).removeClass("is-invalid"); // Remove is-invalid class on valid input
        } else {
            messageElement.html("Only integers are allowed");
            $(this).addClass("is-invalid"); // Add is-invalid class on invalid input
        }
    });
    $('input[data-type="int"]').on("keypress", function (e) {
        let charCode = e.which ? e.which : e.keyCode;
        let charStr = String.fromCharCode(charCode);

        // Allow digits (0-9)
        if ((charCode >= 48 && charCode <= 57) || charStr === ".") {
            // Allow only one dot
            if (charStr === "." && $(this).val().includes(".")) {
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    });
    $('input[data-type="char"]').on("keypress", function (e) {
        let charCode = e.which ? e.which : e.keyCode;

        // Allow alphabetic characters (a-z and A-Z)
        if (
            (charCode < 65 || charCode > 90) &&
            (charCode < 97 || charCode > 122)
        ) {
            e.preventDefault();
        }
    });
    $("input").on("input", function () {
        var inputLength = $(this).val().length;
        var messageElement = $(this).siblings(".dmsError");
        if (inputLength > 0) {
            messageElement.addClass("d-none");
        }
    });
    $(".modal").on("hidden.bs.modal", function () {
        $(".error_message").html("");
        $(".dmsError").addClass("d-none");
        $("input").removeClass("is-invalid");
    });
    $("[data-copy]").on("click", function (event) {
        event.preventDefault();
        var url = $(this).data("copy");
        var $tempTextArea = $("<textarea>");
        $("body").append($tempTextArea);
        $tempTextArea.val(url).select();
        try {
            document.execCommand("copy");
            alertshow(false, "Copy Successfully");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
        $tempTextArea.remove();
    });
    $("[data-slug-make]").on("input", function () {
        let nameInput = $(this).val();
        let slug = nameInput
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[\/?]+/g, "");

        $("[data-slug]").val(slug);
    });
});

//select options
function fetchState(
    country,
    routes,
    selectedModelId = "",
    modelselect = "",
    useTextAsValue = false
) {
    fetchDistricts("", "");

    // Determine the model select element based on the modelselect parameter
    let $modelSelect = modelselect
        ? $(`[data-model="${modelselect}"]`)
        : $("[data-state]");

    if (!country) {
        $modelSelect.empty();
        $modelSelect.append('<option value="">Select State</option>');
        $modelSelect.trigger("chosen:updated");
        return;
    }

    $.ajax({
        url: routes,
        method: "POST",
        data: {
            country: country,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            $modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                $modelSelect.append('<option value="">Select State</option>');
                $.each(response, function (index, product) {
                    $modelSelect.append(
                        `<option value="${product.id}">${product.name}</option>`
                    );
                });
                $modelSelect.trigger("chosen:updated");

                // Set the selected value or text based on useTextAsValue
                if (selectedModelId) {
                    if (useTextAsValue) {
                        // Find the option with the text that matches the selectedModelId
                        $modelSelect
                            .find(`option:contains('${selectedModelId}')`)
                            .prop("selected", true);
                    } else {
                        // Set by value as usual
                        $modelSelect.val(selectedModelId);
                    }
                    $modelSelect.trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}

function fetchDistricts(
    state,
    routes,
    selectedModelId = "",
    modelselect = "",
    useTextAsValue = false
) {
    fetchSubDistricts("", "");

    // Determine the model select element based on the modelselect parameter
    let $modelSelect = modelselect
        ? $(`[data-model="${modelselect}"]`)
        : $("[data-districts]");

    if (!state) {
        $modelSelect.empty();
        $modelSelect.append('<option value="">Select Districts</option>');
        $modelSelect.trigger("chosen:updated");
        return;
    }

    $.ajax({
        url: routes,
        method: "POST",
        data: {
            state: state,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            $modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                $modelSelect.append(
                    '<option value="">Select Districts</option>'
                );
                $.each(response, function (index, product) {
                    $modelSelect.append(
                        `<option value="${product.id}">${product.name}</option>`
                    );
                });
                $modelSelect.trigger("chosen:updated");

                // Set the selected value or text based on useTextAsValue
                if (selectedModelId) {
                    if (useTextAsValue) {
                        // Find the option with the text that matches the selectedModelId
                        $modelSelect
                            .find(`option:contains('${selectedModelId}')`)
                            .prop("selected", true);
                    } else {
                        // Set by value as usual
                        $modelSelect.val(selectedModelId);
                    }
                    $modelSelect.trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}

function fetchSubDistricts(district, routes, selectedModelId = "") {
    let $modelSelect = $("[data-subdistricts]");
    if (!district) {
        $modelSelect.empty();
        $modelSelect.append('<option value="">Select Sub Districts</option>');
        $modelSelect.trigger("chosen:updated");
        return;
    }
    $.ajax({
        url: routes,
        method: "POST",
        data: {
            district: district,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            $modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                $modelSelect.append(
                    '<option value="">Select Sub Districts</option>'
                );
                $.each(response, function (index, product) {
                    $modelSelect.append(
                        `<option value="${product.id}">${product.name}</option>`
                    );
                });
                $modelSelect.trigger("chosen:updated");
                if (selectedModelId) {
                    $modelSelect.val(selectedModelId).trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}

function fetchOperator(
    manufacturerId,
    routes,
    franchise,
    selectedModelId = ""
) {
    let $modelSelect = $("[data-oprator]");
    if (!manufacturerId) {
        $modelSelect.empty();
        $modelSelect.append('<option value="">Select Operator</option>');
        $modelSelect.trigger("chosen:updated");
        return;
    }
    $.ajax({
        url: routes,
        method: "POST",
        data: {
            type: manufacturerId,
            franchise: franchise,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            $modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                $modelSelect.append(
                    '<option value="">Select Operator</option>'
                );
                $.each(response, function (index, res) {
                    $modelSelect.append(
                        `<option value="${res.id}">${res.name}</option>`
                    );
                });
                $modelSelect.trigger("chosen:updated");
                if (selectedModelId) {
                    $modelSelect
                        .text(selectedModelId)
                        .trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}
function fetchTechnician(
    manufacturerId,
    routes,
    franchise,
    selectedModelId = ""
) {
    let $modelSelect = $("[data-tech]");
    if (!manufacturerId) {
        $modelSelect.empty();
        $modelSelect.append('<option value="">Select Technician</option>');
        $modelSelect.trigger("chosen:updated");
        return;
    }
    $.ajax({
        url: routes,
        method: "POST",
        data: {
            type: manufacturerId,
            franchise: franchise,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            $modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                $modelSelect.append(
                    '<option value="">Select Technician</option>'
                );
                $.each(response, function (index, res) {
                    $modelSelect.append(
                        `<option value="${res.id}">${res.name}</option>`
                    );
                });
                $modelSelect.trigger("chosen:updated");
                if (selectedModelId) {
                    $modelSelect.val(selectedModelId).trigger("chosen:updated");
                }
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}
function fetchSerialNo(type, routes) {
    let modelSelect = $("[data-serial]");
    if (type === "") {
        modelSelect.empty();
        modelSelect.append('<option value="">Select Serial No</option>');
        modelSelect.trigger("chosen:updated");
        return;
    }
    $.ajax({
        url: routes,
        method: "POST",
        data: {
            type: type,
            _token: token,
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            modelSelect.empty();
            if (response.error) {
                alertshow(response.error, response.message);
            } else {
                modelSelect.append(
                    '<option value="">Select Serial No</option>'
                );
                $.each(response, function (index, res) {
                    if (res.jobcard_no) {
                        modelSelect.append(
                            `<option value="${res.id}">${res.jobcard_no}</option>`
                        );
                    } else if (res.booking_no) {
                        modelSelect.append(
                            `<option value="${res.id}">${res.booking_no}</option>`
                        );
                    }
                });
            }
            modelSelect.trigger("chosen:updated");
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}
function toggleMenuIconClass() {
    if ($(window).width() >= 992) {
        $("#Ismenuchange")
            .removeClass("fa-angle-double-right")
            .addClass("fa-angle-double-left");
    } else {
        $("#Ismenuchange")
            .removeClass("fa-angle-double-left")
            .addClass("fa-angle-double-right");
    }
}
$(window).resize(function () {
    toggleMenuIconClass();
});
function fd(date) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    return day + " " + month + ", " + year;
}
let alertcontainer = document.getElementById("alertmessage");

function alertshow(type, message) {
    alertcontainer.style.display = "flex";
    let htmlerror = ` <div class="toast-alert show" role="alert" aria-live="assertive"
aria-atomic="true">
<div class="toast-content">
    <i class="fas fa-solid fa-circle-exclamation check bg-danger"></i>
    <div class="message">
        <span class="text text-1 text-danger">Error</span>
        <span class="text text-2">${message}</span>
    </div>
</div>
<i class="fa-solid fa-xmark close " data-close-btn aria-label="Close"></i>
<div class="progress active"></div>
</div>`;
    let htmlsuccess = `<div class="toast-alert show" role="alert" aria-live="assertive" aria-atomic="true">
<div class="toast-content">
    <i class="fas fa-solid fa-check check bg-success"></i>
    <div class="message">
        <span class="text text-1 text-success">Success</span>
        <span class="text text-2">${message}</span>
    </div>
</div>
<i class="fa-solid fa-xmark close " data-close-btn aria-label="Close"></i>
<div class="pr progress active"></div>
</div>`;
    if (type == false) {
        alertcontainer.innerHTML = htmlsuccess;
    } else if (type == true) {
        alertcontainer.innerHTML = htmlerror;
    } else {
        alertcontainer.innerHTML = "";
    }
    setTimeout(function () {
        alertcontainer.style.display = "none";
        alertcontainer.innerHTML = "";
    }, 5000);
}
document
    .querySelectorAll(".nav-link.dropdown-toggle")
    .forEach(function (dropdownToggle) {
        dropdownToggle.addEventListener("click", function (event) {
            // Close all other open dropdowns
            document
                .querySelectorAll(".nav-item .collapse.show")
                .forEach(function (openDropdown) {
                    if (
                        openDropdown !==
                        dropdownToggle
                            .closest(".nav-item")
                            .querySelector(".collapse")
                    ) {
                        new bootstrap.Collapse(openDropdown, {
                            toggle: false,
                        }).hide();
                    }
                });

            // Toggle the clicked dropdown
            var targetId = dropdownToggle.getAttribute("data-bs-target");
            var targetElement = document.querySelector(targetId);

            if (targetElement.classList.contains("show")) {
                new bootstrap.Collapse(targetElement, {
                    toggle: false,
                }).hide();
            } else {
                new bootstrap.Collapse(targetElement, {
                    toggle: false,
                }).show();
            }
        });
    });

function requiredInput(ids) {
    ids.split(",").forEach(function (id) {
        $(id.trim()).prop("required", true);
        $(id.trim()).closest("div").find("label").addClass("required-label");
    });
}

function unRequiredInput(ids) {
    ids.split(",").forEach(function (id) {
        $(id.trim()).prop("required", false);
        $(id.trim()).closest("div").find("label").removeClass("required-label");
    });
}

var gArrayFonts = [
    "Amethysta",
    "Poppins",
    "Poppins-Bold",
    "Poppins-Black",
    "Poppins-Extrabold",
    "Poppins-Extralight",
    "Poppins-Light",
    "Poppins-Medium",
    "Poppins-Semibold",
    "Poppins-Thin",
];


function initializeSummernote(selector) {
    $(selector).each(function () {
        const $editor = $(this);
        $editor.summernote({
            tabsize: 2,
            height: 80,
            fontNames: ["Poppins"],
            fontNamesIgnoreCheck: ["Poppins"],
            toolbar: [
                ["style", ["style", "bold", "italic", "underline", "clear", "strikethrough", "superscript", "subscript"]],
                ["font", ["fontname", "fontsize", "color", "backgroundcolor"]],
                ["para", ["ul", "ol", "paragraph", "height", "alignment"]],
                ["insert", ["link", "picture", "hr", "table", "emoji", "mention", "insertHorizontalRule"]],
                ["view", ["fullscreen", "codeview", "help", "undo", "redo", "print"]],
                ["custom", ["insertTable", "customButton", "customList", "customQuote"]],
                ["mybutton", ["myVideoYt","myVideo"]],

            ],
            buttons: {
                myVideo: function (context) {
                    var ui = $.summernote.ui;
                    var button = ui.button({
                        contents: '<i class="fas fa-file-video"></i>', // updated icon
                        tooltip: "video",
                        click: function () {
                            var url = prompt("Enter video URL:");
                            if (url) {
                                url = normalizeVideoUrl(url);

                                var container = document.createElement("div");
                                container.className = "video-thumbnail-container";
                                container.setAttribute("data-video", url);
                                container.setAttribute("contenteditable", "false");
                                container.style.cssText = "position:relative;width:100%;margin:0 0;border:1px solid #ddd;border-radius:4px;overflow:hidden;cursor:pointer";

                                var thumbnail = document.createElement("img");
                                thumbnail.src = getThumbnailFromUrl(url);
                                thumbnail.style.cssText = "width:100%;display:block;max-height:300px;object-fit:cover;object-position:center center;";

                                var overlay = document.createElement("div");
                                overlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center";
                                overlay.innerHTML = '<i class="fa fa-play-circle" style="font-size:50px;color:white"></i>';

                                container.setAttribute('data-bs-toggle', 'modal');
                                container.setAttribute('data-bs-target', '#videoModal');

                                container.appendChild(thumbnail);
                                container.appendChild(overlay);

                                context.invoke("editor.insertNode", container);
                            }
                        },
                    });
                    return button.render();
                },
                  myVideoYt: function (context) {
                    var ui = $.summernote.ui;
                    var button = ui.button({
                        contents: '<i class="fas fa-video"></i>',
                        tooltip: "YT Direct Video",
                        click: function () {
                            var url = prompt("Enter youtube video URL:");
                            if (url) {
                                var div = document.createElement("div");
                                div.classList.add("embed-container");
                                var iframe = document.createElement("iframe");
                                if (
                                    url.includes("youtube.com/shorts") ||
                                    url.includes("youtu.be")
                                ) {
                                    iframe.src =
                                        "https://www.youtube.com/embed/" +
                                        extractShortId(url);
                                } else {
                                    iframe.src = url;
                                }
                                iframe.setAttribute("frameborder", 0);
                                iframe.setAttribute("width", "100%");
                                iframe.setAttribute("height", "450");
                                iframe.setAttribute("allowfullscreen", true);
                                div.appendChild(iframe);
                                context.invoke("editor.insertNode", div);
                            }
                        },
                    });

                    return button.render();
                },
            },
            callbacks: {
                onChange: function (contents) {
                    contents = contents.replace(/font-family:\s*[^;]+/g, 'font-family: Poppins');
                    $editor.val(contents);
                },
                onInit: function () {
                   

                    $('.note-btn-bold').addClass('active');
                }
            },
            codeviewFilter: false,
            codeviewIframeFilter: false,
        });

        $('.note-btn[data-toggle="dropdown"]').each(function () {
            $(this)
                .attr("data-bs-toggle", "dropdown")
                .removeAttr("data-toggle");
        });

        $editor.summernote("fontName", "Poppins");

        $editor.on('summernote.change', function () {
            $(".note-editable").find('*').each(function () {
                if (this.style.fontFamily !== "Poppins") {
                    this.style.fontFamily = "Poppins";
                }
            });
        });
    });

    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');

    if (videoModal) {
        videoModal.addEventListener('show.bs.modal', function(event) {
            const thumbnail = event.relatedTarget || document.querySelector('.video-thumbnail-container[data-video]');
            const videoUrl = thumbnail.getAttribute('data-video');

            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = extractVideoId(videoUrl);
                if (videoId) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }
            } else {
                videoFrame.src = videoUrl;
            }
        });

        videoModal.addEventListener('hide.bs.modal', function() {
            videoFrame.src = '';
        });
    }
}

// Helper function to normalize video URLs
function normalizeVideoUrl(url) {
    // Convert YouTube embed URLs to watch URLs
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) {
        return 'https://www.youtube.com/watch?v=' + embedMatch[1];
    }
    
    // Convert youtu.be URLs to youtube.com
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
        return 'https://www.youtube.com/watch?v=' + shortMatch[1];
    }
    
    return url;
}

function extractShortId(url) {
    var match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
}


// Helper function to get thumbnail from video URL
function getThumbnailFromUrl(url) {
    // YouTube handling
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractVideoId(url);
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
    }
    
    // Default thumbnail
    return 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
}

// Helper function to extract YouTube video ID
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


const videos = document.querySelectorAll("video");

videos.forEach((video) => {
    video.addEventListener("play", () => {
        videos.forEach((otherVideo) => {
            if (otherVideo !== video) {
                otherVideo.pause();
            }
        });
    });
});