import { renderCalcCount, updateCartInDB } from "../cartAPI/cart.js";
import { attachEventHandler, backURL, getUser, setUser } from "../config.js";
import { dropDownClose } from "../modals/main.js";
import { orderModal } from "../modals/orderModal.js";
import { hidePagination } from "../pagination.js";
import { popUp } from "../popup.js";
import { getAndShowAllProducts } from "../productAPI/products.js";
import { orderCardRender } from "./orderCard.js";

// Підтвердження замовлення в корзині
export const createOrder = async () => {
    try {
        const recipientName = document.forms['orderForm'].elements.recipientName.value;
        const deliveryRegion = document.forms['orderForm'].elements.deliveryRegion.value; 
        const deliveryRemark = document.forms['orderForm'].elements.deliveryRemark.value; 
        const warehouseNumber = document.forms['orderForm'].elements.warehouseNumber.value; 
        const user = getUser();
        // Формуємо тіло запиту
        const requestPayload = {
            userId: user._id,
            cart: user.cart,
            name: recipientName,
            city: deliveryRegion,
            remark: deliveryRemark,
            post_office: warehouseNumber
        };
        const response = await fetch(`${backURL}/order/create`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',   
            },
            body: JSON.stringify(requestPayload)
        });
        const data = await response.json();
        // Закриваємо вікно
        orderModal.close();
        // Очищуємо поля форми
        document.forms['orderForm'].reset();
        // Очищуємо корзину
        user.cart = [];
        setUser(user);
        // Перемальовуємо значок корзини в navbar
        renderCalcCount();
        // Оновлюємо інформацію в БД
        updateCartInDB(user);
        // Повідомлення про успіх
        console.log(data.msg);
        popUp(data.msg, 'success');
    } catch (error) {
        console.error('Order creation error: ', error);
    } finally {
        // Перемальовуємо замовлення незалежно від того, чи відбулося виконання запиту або сталася помилка
        renderOrders();
    }
};

export const renderOrders = async () => {
    //Закриваємо випадаюче меню в адаптиві 
    dropDownClose();
    hidePagination();
    // Очищуємо контейнер кнопок
    const btnContainer = document.querySelector(".btn-container");
    btnContainer.innerHTML = ``;
    
    try {
    const user = getUser();
    
        await fetch(`${backURL}/order/${user._id}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
        .then( response => response.json())
        .then( orders => {
            const dataContainer = document.querySelector(".data-container");
            dataContainer.innerHTML = "";                   // Очищуємо контейнер продуктів
            const orderContainer = document.createElement('div');
            orderContainer.classList.add(`order-container`);
            dataContainer.appendChild(orderContainer);

            // Перевіряємо, чи є замовлення
            if (orders.length) {
                orders.forEach(order => {
                    // Якщо є - рендиримо карточки ордерів
                    orderCardRender(order);
                });
            }
            else {
                dataContainer.innerHTML = `<div class="empy-errors">
                    <div class="empy-errors-item">No orders found yet. </div>
                    <div class="empy-errors-item">Visit the store and buy some products.</div>
                    <button class="btn btn-secondary" id="emptyOrderBtn" >Go shopping ...</button>
                </div>`;
                attachEventHandler('emptyOrderBtn', 'click', () => { getAndShowAllProducts() })
            }
        })
        .catch( err => {
            console.error('Order render error: ', err);
        });
    } catch (error) {
        console.error(error);
    }
}