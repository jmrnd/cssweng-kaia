document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".category-link");
    const categoryTitle = document.querySelector(".category-title");
    const pathCategory = document.querySelector(".path-category");

    const initialCategory = "Tops"; // Initial
    categoryTitle.textContent = `${initialCategory} COLLECTION`;
    pathCategory.textContent = initialCategory;

    categoryLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            categoryLinks.forEach((link) => link.classList.remove("selected"));
            this.classList.add("selected");
            const selectedCategory = this.textContent.trim();
            categoryTitle.textContent = `${selectedCategory} COLLECTION`;
            pathCategory.textContent = selectedCategory;
        });
    });

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdownToggle.addEventListener("click", function () {
        if (dropdownMenu.style.display === "block") {
            dropdownMenu.style.display = "none";
        } else {
            dropdownMenu.style.display = "block";
        }
    });

    document.addEventListener("click", function (event) {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });

    const selectedFilterText = document.getElementById("selectedFilter");
    const filterLinks = document.querySelectorAll(".dropdown-menu li a");

    filterLinks.forEach(function (filterLink) {
        filterLink.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedFilter = this.textContent;
            selectedFilterText.textContent = selectedFilter;
            dropdownMenu.style.display = "none";
        });
    });
});
