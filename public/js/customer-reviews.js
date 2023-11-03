const maxRating = 5.0;

const starIconFill = `<svg  class="star-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>`;

const starIconGray = `<svg  class="star-icon gray" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>`;

const starIconHalf = `<svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
                            <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
                        </svg>`;

document.addEventListener("DOMContentLoaded", function () {
    renderAverageRating();

    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const select = dropdown.querySelector(".select");
        const caret = dropdown.querySelector(".caret");
        const menu = dropdown.querySelector(".menu");
        const options = dropdown.querySelectorAll(".menu li");
        const selected = dropdown.querySelector(".selected");

        select.addEventListener("click", () => {
            select.classList.toggle("select-clicked");
            caret.classList.toggle("caret-rotate");
            menu.classList.toggle("menu-open");
        });

        options.forEach((option) => {
            option.addEventListener("click", () => {
                selected.innerText = option.innerText;
                select.classList.remove("select-clicked");
                caret.classList.remove("caret-rotate");
                menu.classList.remove("menu-open");
                options.forEach((option) => {
                    option.classList.remove("active");
                });
                option.classList.add("active");
            });
        });
    });

    const customerReviews = document.querySelectorAll(".customer-review");

    customerReviews.forEach((review) => {
        const reviewId = review.getAttribute("data-review-id");
        renderUserRatings(review);
        showReviewImages(review, reviewId);
    });
});

function showReviewImages(review, reviewId) {
    const reviewImages = review.querySelectorAll(".user-review-image");
    const numImages = reviewImages.length;
    let startIndex = 0;

    function updateImages() {
        for (let i = 0; i < numImages; i++) {
            if (i >= startIndex && i < startIndex + 3) {
                reviewImages[i].style.display = "block";
            } else {
                reviewImages[i].style.display = "none";
            }
        }
    }

    const prevButton = review.querySelector(
        `.review-previous-image-button[data-review-id="${reviewId}"]`
    );
    const nextButton = review.querySelector(
        `.review-next-image-button[data-review-id="${reviewId}"]`
    );

    prevButton.addEventListener("click", () => {
        if (startIndex > 0) {
            startIndex -= 1;
            updateImages();
        }
    });

    nextButton.addEventListener("click", () => {
        if (startIndex + 3 < numImages) {
            startIndex += 1;
            updateImages();
        }
    });

    updateImages();
}

function renderUserRatings(review) {
    const userRatingElement = review.querySelector(".review-user-rating");
    const userRating = parseFloat(
        userRatingElement.getAttribute("data-userrating")
    );
    console.log(userRating);
    const fullStars = Math.floor(userRating);
    const halfStar = userRating - fullStars > 0 ? true : false;
    const starsLeft = Math.floor(maxRating - userRating);

    const fullStarsHTML = starIconFill.repeat(fullStars);

    if (halfStar) {
        userRatingElement.innerHTML += fullStarsHTML + starIconHalf;
    } else {
        userRatingElement.innerHTML += fullStarsHTML;
    }

    const remainingStarsHTML = starIconGray.repeat(starsLeft);
    userRatingElement.innerHTML += remainingStarsHTML;
}

function renderAverageRating() {
    const averageRatingElement = document.querySelector(
        ".customer-reviews-header-rating"
    );
    const averageRatingText = averageRatingElement.innerText;
    const averageRating = parseFloat(averageRatingText.match(/\d\.\d/)[0]);
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars > 0 ? true : false;
    const starsLeft = Math.floor(maxRating - averageRating);

    const ratingIconsElement = document.querySelector(
        ".customer-reviews-header-rating-icons"
    );

    const fullStarsHTML = starIconFill.repeat(fullStars);

    if (halfStar) {
        ratingIconsElement.innerHTML += fullStarsHTML + starIconHalf;
    } else {
        ratingIconsElement.innerHTML += fullStarsHTML;
    }

    const remainingStarsHTML = starIconGray.repeat(starsLeft);
    ratingIconsElement.innerHTML += remainingStarsHTML;
}
