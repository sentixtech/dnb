AOS.init({
    duration: 800,
    easing: "ease-in-out",
});
document.addEventListener("DOMContentLoaded", function () {
    // const swiper = new Swiper(".swiper", {
    //     loop: true,
    //     effect: "fade", // Slide effect
    //     fadeEffect: {
    //         crossFade: true,
    //     },
    //     autoplay: {
    //         delay: 3000,
    //         disableOnInteraction: false, // Continue autoplay after interaction
    //     },
    //     navigation: {
    //         nextEl: ".swiper-button-next",
    //         prevEl: ".swiper-button-prev",
    //     },
    // });

    const aboutSwiper = new Swiper(".about-swiper", {
        loop: true,
        effect: "fade",
        grabCursor: true,
        direction: "vertical",
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination", // Element to contain pagination dots
            clickable: true, // Enable clicking on dots
        },
    });
    const testimonials = new Swiper(".testimonials", {
        // Optional parameters
        direction: "horizontal",
        loop: true,
        autoHeight: false,
        centeredSlides: true,
        slidesPerView: 1,
        // Responsive breakpoints
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        },

        // If we need pagination
        pagination: {
            el: ".testimonials .swiper-pagination",
        },

        // Navigation arrows
        navigation: {
            nextEl: ".testimonials .swiper-button-next",
            prevEl: ".testimonials .swiper-button-prev",
        },
    });
});

function checkNavigation(event) {
    const itemCount = event.item.count;
    const currentIndex = event.item.index;

    // Disable 'prev' button if at the start
    if (currentIndex === 0) {
        $(".carousel-prev").addClass("opacity-0");
    } else {
        $(".carousel-prev").removeClass("opacity-0");
    }

    // Disable 'next' button if at the end
    if (currentIndex + event.page.size >= itemCount) {
        $(".carousel-next").addClass("opacity-0");
    } else {
        $(".carousel-next").removeClass("opacity-0");
    }
}
$(document).ready(function () {
    $(".invantors").owlCarousel({
        loop: false,
        nav: false,
        items: 6,
        slideBy: 2,
        dots: false,
        margin: 13,
        responsive: true,
        responsive: {
            0: {
                items: 2,
            },
            600: {
                items: 4,
            },
            1000: {
                items: 5,
            },
        },
        onInitialized: checkNavigation,
        onChanged: checkNavigation,
    });

    $(".btn-builder-next").click(function () {
        $(".invantors").trigger("next.owl.carousel", [1000]); // Adjust speed as needed
    });

    $(".btn-builder-prev").click(function () {
        $(".invantors").trigger("prev.owl.carousel", [1000]); // Adjust speed as needed
    });

    
});

let $popup = $(".popup");
function share() {
    $popup.addClass("show");
    var modal = new bootstrap.Modal($popup, {
        keyboard: true,
    });
    modal.show();
}
function closePopup() {
    var modal = new bootstrap.Modal($popup, {
        keyboard: true,
        backdrop: false,
    });
    modal.hide();
    modal.dispose();
    $popup.removeClass("show");
    var backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
        backdrop.remove(); // Remove the backdrop from DOM
    }
    document.body.style.overflow = ""; // Reset any overflow styles added during modal show
    document.body.style.paddingRight = ""; // Reset any padding-right style added during modal show
    document.body.classList.remove("modal-open");
    // Remove any data-bs attributes related to modal on the body
    document.body.removeAttribute("data-bs-overflow"); // Remove data-bs-overflow attribute
    document.body.removeAttribute("data-bs-padding"); // Remove data-bs-padding attribute

    // You can remove any oth   r modal-related attributes as needed
    document.body.removeAttribute("data-bs-toggle");
}
function copy() {
    // Get the input field
    var copyText = document.getElementById("copy");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Try to copy the text to clipboard
    navigator.clipboard
        .writeText(copyText.value)
        .then(function () {
            // If successful, change the input value to "Copied"
            copyText.value = "Copied";

            // Optionally, reset the input value after 3 seconds
            setTimeout(function () {
                copyText.value = "example.com/share-linkghhhhhhhhh"; // Reset to original value
            }, 3000);
        })
        .catch(function (err) {
            // Handle errors if any (e.g., in unsupported browsers)
            console.error("Error copying text: ", err);
        });
}

$(document).ready(function () {
    // Function to manage Read More/Read Less button for all cards
    function manageContentHeight() {
        $(".content-card").each(function () {
            var $cardBody = $(this).find(".content-body");
            var $contentText = $cardBody.find(".content-text");
            var $btn = $cardBody.find(".read-more-btn");

            // Check if content height exceeds 300px
            if ($contentText[0].scrollHeight > 50) {
                $btn.show(); // Show "Read More" button if content is too long
            } else {
                $btn.hide(); // Hide "Read More" button if content is short
            }

            // Toggle functionality for the button
            $btn.click(function () {
                if ($contentText.hasClass("expanded")) {
                    $contentText.removeClass("expanded");
                    $btn.text("Read More");
                } else {
                    $contentText.addClass("expanded");
                    $btn.text("Read Less");
                }
            });
        });
    }

    // Run the function initially to set up the content
    manageContentHeight();

    // Recheck on window resize (to handle responsive changes)
    $(window).resize(function () {
        manageContentHeight();
    });
});
function leadModalOpen(id, name, img) {
    document.querySelectorAll(".propertyId").forEach(function(el) {
        el.value = id;
    });
    document.querySelector(".pro-title").textContent = name;
    document.querySelector(".pop_imge").src = img;
    var myModal = new bootstrap.Modal(document.getElementById('leadModal'));
    myModal.show();
}
