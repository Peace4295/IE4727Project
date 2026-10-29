
document.addEventListener("DOMContentLoaded", function() {

    // Find carousel elements
    const slides = document.querySelectorAll(".carousel-image");
    const dots = document.querySelectorAll(".carousel-dot");
    const previousButton = document.getElementById("prev-slide");
    const nextButton = document.getElementById("next-slide");

    // Stop if carousel elements are missing
    if (slides.length === 0 || !previousButton || !nextButton) {
        return;
    }

    let currentSlide = 0;

    // Display selected advertisement and update dots
    function showSlide(index) {
        slides.forEach(function(slide, i) {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach(function(dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }

    // Next advertisement
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Previous advertisement
    function previousSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Arrow buttons
    nextButton.addEventListener("click", nextSlide);
    previousButton.addEventListener("click", previousSlide);

    // Orange indicator dots
    dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Automatically change advertisements every 5 seconds
    setInterval(nextSlide, 3000);

    // Show first advertisement
    showSlide(currentSlide);

});

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("show");
        });
    }
});