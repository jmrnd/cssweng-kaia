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

    // Select the first color and size buttons initially
    const initialColorButton = document.querySelector('.color-button');
    const initialSizeButton = document.querySelector('.size-button');
    
    if (initialColorButton) {
        selectColor(initialColorButton);
    }
    
    if (initialSizeButton) {
        selectSize(initialSizeButton);
    }

    let quantity = 1;
    const minQuantity = 1;
    const maxQuantity = 10;
    const quantitySpan = document.querySelector('.product-quantity-container span');
    quantitySpan.textContent = quantity;

    document.querySelector('.quantity-button:nth-child(1)').addEventListener('click', function () {
        if (quantity > minQuantity) {
            quantity--;
            quantitySpan.textContent = quantity;
        }
    });

    document.querySelector('.quantity-button:nth-child(3)').addEventListener('click', function () {
        if (quantity < maxQuantity) {
            quantity++;
            quantitySpan.textContent = quantity;
        }
    });
});

function selectColor(button) {
    const colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const selectedColor = document.querySelector('.selected-color');
    selectedColor.textContent = button.getAttribute('value');
}

function selectSize(button) {
    const sizeButtons = document.querySelectorAll('.size-button');
    sizeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const selectedSize = document.querySelector('.selected-size');
    selectedSize.textContent = button.textContent;
}