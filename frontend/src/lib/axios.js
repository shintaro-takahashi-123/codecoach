import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/', // Laravel APIのベースURL
  withCredentials: true, // Cookieでのセッション維持に必要
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default instance;
