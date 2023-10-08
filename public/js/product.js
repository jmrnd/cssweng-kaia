document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 1;

    function showSlides(n) {
        let i;
        const slides = document.querySelectorAll('.hide');

        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }

        slides[slideIndex - 1].style.display = 'block';
    }

    function plusSlides(n) {
        showSlides((slideIndex += n));
    }

    showSlides(slideIndex);

    // Event listeners for previous and next buttons
    document.querySelector('.previous-image-button').addEventListener('click', () => plusSlides(-1));
    document.querySelector('.next-image-button').addEventListener('click', () => plusSlides(1));
});