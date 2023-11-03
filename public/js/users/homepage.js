
// Add an event listener to all category containers
document.addEventListener('DOMContentLoaded', () => {
    const categoryContainers = document.querySelectorAll('.category-container');
    categoryContainers.forEach( container => {
        container.addEventListener('click', () => {
            const category = container.getAttribute('data-category');
            window.location.href = `/productCatalog?category=${category}`;
        });
    });
});

// Slider
const carousel = document.querySelector(".review-carousel");
const arrowBtns = document.querySelectorAll(".reviews-showcase i");
const firstCardWidth = carousel.querySelector(".review-cards").offsetWidth + 10; // Offset + gap
const review_username = document.querySelectorAll(".reviewer-username");
const review_content= document.querySelectorAll(".review-content");


// Arrow
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "left-slide") {
            carousel.scrollLeft -= firstCardWidth*2;
          } else {
            carousel.scrollLeft += firstCardWidth*2;
          }
    })
})

// Dragging Might delete
let isDragging = false, startX, startScrollLeft;

const dragStart = (e) => {
    isDragging = true;

    carousel.classList.add('on-drag');

    review_username.forEach(username => {
        username.classList.add('on-drag');
    })

    review_content.forEach(content => {
        content.classList.add('on-drag');
    })

    // Record initial cursor position
    startX = e.pageX
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) =>{
    if(!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX-startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove('on-drag');
}

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop)


