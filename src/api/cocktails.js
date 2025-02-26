// 导入 axios配置
import request from "../utils/request"

export const search = (name) => request({
    url: '/search.php',
    method: 'GET',
    params: {s: name}
});

export const popular = () => request({
    url: '/popular.php',
    method: 'GET',
});


export const recipe = (id) => request({
    url: '/lookup.php',
    method: 'GET',
    params: {i: id}
});


export const randomCocktails = () => request({
    url: '/random.php',
    method: 'GET',
});

export const searchByIngredient = (name) => request({
    url: '/filter.php',
    method: 'GET',
    params: {i: name}
});

export const searchIngredientByName = (name) => request({
    url: '/search.php',
    method: 'GET',
    params: {i: name}
});

export const listCategories = () => request({
    url: '/list.php',
    method: 'GET',
    params: {c: 'list'}
});

export const listGlasses = () => request({
    url: '/list.php',
    method: 'GET',
    params: {g: 'list'}
});

export const listIngredients = () => request({
    url: '/list.php',
    method: 'GET',
    params: {i: 'list'}
});

export const listAlcoholic = () => request({
    url: '/list.php',
    method: 'GET',
    params: {a: 'list'}
});

export const filterByMultipleIngredient = (ingredients) => request({
    url: '/filter.php',
    method: 'GET',
    params: {
        i: ingredients.join(','),  // 配料，多个配料用逗号分隔，无需编码
    },
});
export const filterByGlass = (glass) => request({
    url: '/filter.php',
    method: 'GET',
    params: {
        g: glass,
    },
});

export const filterByAlcoholic = (alcoholic) => request({
    url: '/filter.php',
    method: 'GET',
    params: {
        a: alcoholic,
    },
});

export const filterByCategory = (category) => request({
    url: '/filter.php',
    method: 'GET',
    params: {
        c: category,
    },
});