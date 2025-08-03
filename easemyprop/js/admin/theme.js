document.addEventListener("DOMContentLoaded", function () {
    // Check if there is a theme preference stored in cookies
    var cookieTheme = getCookie("theme");

    // Apply the stored theme or default theme
    var themeToApply = cookieTheme || "";
    document.getElementById("body").setAttribute("data-bs-theme", themeToApply);
    updateThemeClasses(themeToApply);

    // Toggle theme function
    document.getElementById("theme").addEventListener("click", function () {
        var currentTheme = document
            .getElementById("body")
            .getAttribute("data-bs-theme");
        var newTheme = currentTheme === "light" ? "dark" : "light";
        document.getElementById("body").setAttribute("data-bs-theme", newTheme);
        updateThemeClasses(newTheme);
        // Store the theme preference in cookies
        setCookie("theme", newTheme, 365); // Expires in 365 days
    });

    // Function to update theme-related classes
    function updateThemeClasses(theme) {
        var themeElement = document.getElementById("theme");
        if (theme === "light") {
            themeElement.classList.add("fa-moon");
            themeElement.classList.remove("fa-sun");
        } else {
            themeElement.classList.remove("fa-moon");
            themeElement.classList.add("fa-sun");
        }
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === " ") {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }
});
