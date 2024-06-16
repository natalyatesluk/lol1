import { addToCart } from "../cartAPI/cart.js";
import { attachEventHandler, getUser } from "../config.js";
import { popUp } from "../popup.js";
import { editProduct, removeProduct, getAndShowAllProducts } from "./products.js";

export const productCardRender = (product) => {
    
    const { category } = product;
    const prdStr = JSON.stringify(product);
    const prdId = JSON.stringify(product._id).trim();

    
    const productCard = document.createElement("div");
    productCard.classList.add("product");

    
    const commonProductCardPart = `<div class="product-data">
                                        <div><img src="${product.image}" class="product-img" id="productImage${product._id}"></div>
                                        <div class="product-name">${product.name}</div>
                                        <div class="product-category-text">${category.name}</div>
                                        <div class="product-text">Producer: <span class="product-producer">${product.producer}</span></div>    
                                    </div>`;
    const adminProductCardFooter = `  <div class="product-footer">
                                        <div> <span class="product-price">${product.price} &#x20b4 </span> </div>                                    
                                        <div class="product-manage-btns">
                                            <div class="product-btn" id='editProduct${product._id}'>Edit</div>
                                            <div class= "product-btn" id="removeProduct${product._id}">Delete</div>
                                        </div> 
                                    </div>`;
    const userProductCardFooter = `
                                    <div class="product-footer">
                                        <div> <span class="product-price">${product.price} &#x20b4 </span> </div>                                    
                                        <div class="product-manage-btns">
                                            <div class="product-btn-buy" id='addToCart${product._id}'>BUY </div>
                                        </div> 
                                    </div>`;
    const unAuthProductCardFooter = `
                                    <div class="product-footer">
                                        <div> <span class="product-price">${product.price} &#x20b4 </span> </div>                                    
                                        <div class="product-manage-btns">
                                            <div class="product-btn-buy" id='popUp${product._id}' >BUY </div>
                                        </div> 
                                    </div>`;
   
    const user = getUser();
    console.log(user);
    
    switch (true) {
        
        case user === null:
            productCard.innerHTML = `${commonProductCardPart} ${unAuthProductCardFooter}`;
            break;
        case user && !user.isAdmin:
            productCard.innerHTML = `${commonProductCardPart} ${userProductCardFooter}`;
            break;
        case user.isAdmin:
            productCard.innerHTML = `${commonProductCardPart} ${adminProductCardFooter}`;
            break;   
    }

  
    const dataContainer = document.querySelector(".data-container");
    dataContainer.appendChild(productCard);

   
    attachEventHandler(`popUp${product._id}`, 'click', () => { popUp('Please log in', 'danger') });
    console.log(user);
    attachEventHandler(`addToCart${product._id}`, 'click', () => { addToCart(product) });
    attachEventHandler(`editProduct${product._id}`, 'click', () => { editProduct(product) });
    attachEventHandler(`removeProduct${product._id}`, 'click', () => { removeProduct(product) });

   
    const productImage = document.getElementById(`productImage${product._id}`);
    if (productImage) {
        productImage.addEventListener('click', (event) => {
            event.stopPropagation();
            updateProductDetails(product, category, user);
        });
    }
}

const updateProductDetails = (product, category, user) => {
    const productDetailsContainer = document.querySelector('.data-container');

    if (productDetailsContainer) {
       
        productDetailsContainer.innerHTML = `
            <div class="product-details-container">
                <button class="back-button">BACK</button>
                <img src="${product.image}" class="details-img">
                <div class="product-details-info">
                    <div class="details-name">${product.name}</div>
                    <div class="details-category-text">${category.name}</div>
                    <div class="details-text">Producer: <span class="details-producer">${product.producer}</span></div>
                    <div class="details-text">Material: <span class="details-material">${product.material}</span></div>
                    <div class="details-text">Size: <span class="details-size">${product.size}</span> cm</div> 
                    <div class="details-text">Insertion: <span class="details-insertion">${product.insertion}</span></div>  
                    <div class="details-price">${product.price} &#x20b4</div>  
                </div>
                <div class="product-details-buttons">
                    ${user && !user.isAdmin ? `<div class="details-btn buy" id="addToCart${product._id}">BUY</div>` : ''}
                    ${user && user.isAdmin ? `<div class="details-btn" id="editProduct${product._id}">Edit</div>
                                             <div class="details-btn" id="removeProduct${product._id}">Delete</div>` : ''}
                    ${user === null ? `<div class="details-btn" id='popUp${product._id}'>BUY</div>` : ''}
                </div>
            </div>
        `;

       
        if (user && !user.isAdmin) {
            const addToCartBtn = document.getElementById(`addToCart${product._id}`);
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => { addToCart(product) });
            }
        }
        if (user && user.isAdmin) {
            const editProductBtn = document.getElementById(`editProduct${product._id}`);
            const removeProductBtn = document.getElementById(`removeProduct${product._id}`);
            if (editProductBtn) {
                editProductBtn.addEventListener('click', () => { editProduct(product) });
            }
            if (removeProductBtn) {
                removeProductBtn.addEventListener('click', () => { removeProduct(product) });
            }
        }
        if (user === null) {
            const buyBtn = document.getElementById(`popUp${product._id}`);
            if (buyBtn) {
                buyBtn.addEventListener('click', () => { popUp('Please log in', 'danger') });
            }
        }
    }
    const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) {
        filterContainer.style.display = 'none';
    }
    
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            getAndShowAllProducts();
            
         
            if (paginationContainer) {
                paginationContainer.style.display = 'flex';
            }
            if (filterContainer) {
                filterContainer.style.display = 'flex';
            }
        });
    }
}
