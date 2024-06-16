import { attachEventHandler, setPage } from "./config.js";
import { getAndShowAllProducts } from "./productAPI/products.js";

export const renderFiltration = () => {
    const filterContainer = document.querySelector('.filter-container');
    filterContainer.innerHTML = `
        <button class="toggle-filter-btn" onclick="toggleFilters()">Filters</button>
        <form class="filter-form">
            <div class="filter_div">
                <div class="filter-sort">
                    <select class="form-select" id="filter-sort">
                        <option selected value="nosort">-- sort products --</option>
                        <option value="incPr">by increasing price</option>
                        <option value="decPr">by decreasing price</option>
                        <option value="nf">newest first</option>
                        <option value="of">oldest first</option>
                    </select>
                    <div class="filter-category">
                        <select class="form-select" id="filter-category"></select>
                    </div>
                </div>
            </div>
            <div class="search_div">
                <div class="filter-search">
                    <input class="form-control" id="filter-search" type="text" placeholder="Search product">
                </div>
            </div>
        </form>`;
    
    // Навішуємо обробники
    attachEventHandler('filter-category', 'change', filtration);
    attachEventHandler('filter-sort', 'change', filtration);
    attachEventHandler('filter-search', 'input', filtration);
    document.querySelector('.toggle-filter-btn').addEventListener('click', toggleFilters);

};

export const toggleFilters = () => {
    const filterDiv = document.querySelector('.filter_div');
    const computedStyle = window.getComputedStyle(filterDiv);

    if (computedStyle.display === "none" || computedStyle.display === "") {
        filterDiv.style.display = "block";
    } else {
        filterDiv.style.display = "none";
    }
};


export const renderFilterCategoriesOptions = (categories) => {
    const filterCategory = document.getElementById('filter-category');
    filterCategory.innerHTML = ``;

    const defaultProductCategoryOption = document.createElement('option');
    defaultProductCategoryOption.setAttribute("selected", "");
    defaultProductCategoryOption.setAttribute("value", "all");
    defaultProductCategoryOption.innerText = ` -- select a category -- `;
    filterCategory.appendChild(defaultProductCategoryOption);

    categories.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category._id;
        categoryOption.innerText = `${category.name}`;
        filterCategory.appendChild(categoryOption);
    });
};


const filtration = async () => {
    setPage(1);
    await getAndShowAllProducts();
};


renderFiltration();
