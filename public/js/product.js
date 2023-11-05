const smallImages = document.querySelectorAll(".product-gallery-small-image");

document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 1;

    function showSlides(n) {
        let i;
        const slides = document.querySelectorAll(".hide");

        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        slides[slideIndex - 1].style.display = "block";
    }

    showSlides(slideIndex);

    // Event listeners for previous and next buttons
    document
        .querySelector(".previous-image-button")
        .addEventListener("click", () => {
            plusSlides(-1);
        });

    document
        .querySelector(".next-image-button")
        .addEventListener("click", () => {
            plusSlides(1);
        });

    // Select the first color and small image (initial)
    const initialColorButton = document.querySelector(".color-button");
    const initialImage = document.querySelector(".product-gallery-small-image");

    if (initialColorButton) {
        selectColor(initialColorButton);
    }

    if (initialImage) {
        selectImage(initialImage);
    }

    let quantity = 1;
    const minQuantity = 1;
    const maxQuantity = 10;
    const quantitySpan = document.querySelector(
        ".product-quantity-container span"
    );
    quantitySpan.textContent = quantity;

    document
        .querySelector(".quantity-button:nth-child(1)")
        .addEventListener("click", function () {
            if (quantity > minQuantity) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

    document
        .querySelector(".quantity-button:nth-child(3)")
        .addEventListener("click", function () {
            if (quantity < maxQuantity) {
                quantity++;
                quantitySpan.textContent = quantity;
            }
        });

    function plusSlides(n) {
        showSlides((slideIndex += n));
        const selectedSmallImage = smallImages[slideIndex - 1];
        selectImage(selectedSmallImage);
    }

    smallImages.forEach((image, index) => {
        image.addEventListener("click", () => {
            slideIndex = index + 1;
            showSlides(slideIndex);
            selectImage(image);
        });
    });
});

function selectColor(button) {
    const colorButtons = document.querySelectorAll(".color-button");
    colorButtons.forEach((btn) => btn.classList.remove("selected-color"));
    button.classList.add("selected-color");
    const selectedColor = document.querySelector(".selected-color");
    selectedColor.textContent = button.getAttribute("value");
}

function selectImage(image) {
    smallImages.forEach((img) => img.classList.remove("selected-image"));
    image.classList.add("selected-image");
}

function toggleBookmark(bookmarkElement) {}
