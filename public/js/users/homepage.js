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
