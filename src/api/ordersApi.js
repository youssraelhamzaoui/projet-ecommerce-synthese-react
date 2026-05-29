import api from './axios';

export const getOrders  = ()     => api.get('/commandes');
export const getOrder   = (id)   => api.get(`/commandes/${id}`);
export const placeOrder = (data) => api.post('/commandes', data);
