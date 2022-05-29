import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/categories";

const categories = [
    {category_id: 1, category_name: "Mobile Phones"},
    {category_id: 2, category_name: "Tablets"},
    {category_id: 3, category_name: "Laptops"},
    {category_id: 4, category_name: "Desktops"},
    {category_id: 5, category_name: "External Storage"},
    {category_id: 6, category_name: "Monitors"},
    {category_id: 7, category_name: "KeyBoards and Mice"},
    {category_id: 8, category_name: "Smart Watches"},
    {category_id: 9, category_name: "Smart TVs"},
    {category_id: 10, category_name: "Routers"},
]

const subCategories = [
    {subcategory_id: 1, subcategory_name: "Apple"},
    {subcategory_id: 2, subcategory_name: "Google"},
    {subcategory_id: 3, subcategory_name: "Microsoft"},
    {subcategory_id: 4, subcategory_name: "Nokia"},
    {subcategory_id: 5, subcategory_name: "Samsung"},
]

export function getCategories() {
    return {data: categories};
}

export function getSubCategories(category_id) {
    return {data: subCategories}
}
