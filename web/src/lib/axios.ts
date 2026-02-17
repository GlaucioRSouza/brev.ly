/*import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});*/

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  // Isso ajuda a evitar que o navegador trave esperando respostas longas
  timeout: 5000, 
});