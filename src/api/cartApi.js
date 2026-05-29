import api from './axios';

export const getCart    = ()           => api.get('/panier');
export const addToCart  = (data)       => api.post('/panier/add', data);
export const updateCart = (data)       => api.put('/panier/update', data);
export const removeItem = (productId)  => api.delete(`/panier/${productId}`);
export const clearCart  = ()           => api.delete('/panier');
export const syncCart   = (items)      => api.post('/panier/sync', { items });
