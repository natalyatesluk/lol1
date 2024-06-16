
import { renderProductCategoriesOptions } from "./modals/productModal.js";

export const backURL = `https://jewelery-course-web.onrender.com`;


export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getCategories = () => {
    return JSON.parse(localStorage.getItem('categories'));
};

export const setCategories =  (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
    renderProductCategoriesOptions(); 
}

export const getPage = () => {
    return JSON.parse(localStorage.getItem('page'));
}


export const setPage = (page) => {
    localStorage.setItem('page', JSON.stringify(page));
}

export const getPageCount = () => {
    return JSON.parse(localStorage.getItem('pageCount'));
}


export const setPageCount = (pageCount) => {
    localStorage.setItem('pageCount', JSON.stringify(pageCount));
}

export const clearStorage = async () => {
    localStorage.clear();
};

// Функція для навішування обробників подій
export function attachEventHandler (elementId, eventType, method) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(eventType, () => method());
    }
}






