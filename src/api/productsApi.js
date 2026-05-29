import api from './axios';

export const getHome       = ()       => api.get('/home');
export const getProducts   = (params) => api.get('/products', { params });
export const getProduct    = (id)     => api.get(`/products/${id}`);
export const getCategories = ()       => api.get('/categories');
export const getBrands     = ()       => api.get('/brands');
export const getSliders    = ()       => api.get('/sliders');
