import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const encryptImage = async (file: File, key: string, method: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', key);
  formData.append('method', method);

  const response = await axios.post(`${API_URL}/encrypt`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return {
    blob: response.data,
    width: response.headers['x-image-width'],
    height: response.headers['x-image-height'],
    pixels: response.headers['x-image-pixels'],
  };
};

export const decryptImage = async (file: File, key: string, method: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', key);
  formData.append('method', method);

  const response = await axios.post(`${API_URL}/decrypt`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return {
    blob: response.data,
    width: response.headers['x-image-width'],
    height: response.headers['x-image-height'],
    pixels: response.headers['x-image-pixels'],
  };
};
