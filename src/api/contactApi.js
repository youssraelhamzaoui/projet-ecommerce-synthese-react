import api from './axios';

export const sendContact = (data) => api.post('/contact', data);
