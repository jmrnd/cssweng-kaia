const smallImages = document.querySelectorAll('.product-gallery-small-image');

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

    showSlides(slideIndex);

    // Event listeners for previous and next buttons
    document.querySelector('.previous-image-button').addEventListener('click', () => {
        plusSlides(-1);
    });

    document.querySelector('.next-image-button').addEventListener('click', () => {
        plusSlides(1);
    });

    // Select the first color and small image (initial)
    const initialColorButton = document.querySelector('.color-button');
    const initialImage = document.querySelector('.product-gallery-small-image');

    if (initialColorButton) {
        selectColor(initialColorButton);
    }

    if (initialImage) {
        selectImage(initialImage);
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

    function plusSlides(n) {
        showSlides((slideIndex += n));
        const selectedSmallImage = smallImages[slideIndex - 1];
        selectImage(selectedSmallImage);
    }

    smallImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            slideIndex = index + 1;
            showSlides(slideIndex);
            selectImage(image);
        });
    });

    const averageRatingElement = document.querySelector('.customer-reviews-header-rating');
    const averageRatingText = averageRatingElement.innerText;
    const averageRating = parseFloat(averageRatingText.match(/\d\.\d/)[0]);
    const maxRating = 5.0;
    const fullStars = Math.floor(averageRating);
    const halfStar = (averageRating - fullStars) > 0 ? true : false;
    const starsLeft = Math.floor(maxRating - averageRating);

    console.log(starsLeft);
        
    const ratingIconsElement = document.querySelector('.customer-reviews-header-rating-icons');
    
    const starIconFill = `<svg  class="star-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg>`;

    const starIconGray = `<svg  class="star-icon gray" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg>`;

    const starIconHalf = `<svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
                            <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
                          </svg>`;

    const fullStarsHTML = starIconFill.repeat(fullStars);

    if (halfStar) {
        ratingIconsElement.innerHTML += fullStarsHTML + starIconHalf;
    } else {
        ratingIconsElement.innerHTML += fullStarsHTML;
    }

    const remainingStarsHTML = starIconGray.repeat(starsLeft);
    ratingIconsElement.innerHTML += remainingStarsHTML;
});

function selectColor(button) {
    const colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(btn => btn.classList.remove('selected-color'));
    button.classList.add('selected-color');
    const selectedColor = document.querySelector('.selected-color');
    selectedColor.textContent = button.getAttribute('value');
}

function selectImage(image) {
    smallImages.forEach(img => img.classList.remove('selected-image'));
    image.classList.add('selected-image');
}