import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getApiError(error: unknown): Promise<string> {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        return parsed.detail || 'The request could not be completed.';
      } catch {
        return 'The request could not be completed.';
      }
    }
    return error.response.data?.detail || error.message;
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export const encryptImage = async (file: File, key: string, method: string) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);
    formData.append('method', method);

    const response = await axios.post(`${API_URL}/encrypt`, formData, {
      responseType: 'blob',
    });

    return {
      blob: response.data,
      width: response.headers['x-image-width'],
      height: response.headers['x-image-height'],
      pixels: response.headers['x-image-pixels'],
    };
  } catch (error) {
    throw new Error(await getApiError(error));
  }
};

export const decryptImage = async (file: File, key: string, method: string) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);
    formData.append('method', method);

    const response = await axios.post(`${API_URL}/decrypt`, formData, {
      responseType: 'blob',
    });

    return {
      blob: response.data,
      width: response.headers['x-image-width'],
      height: response.headers['x-image-height'],
      pixels: response.headers['x-image-pixels'],
    };
  } catch (error) {
    throw new Error(await getApiError(error));
  }
};
