import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // LaravelのAPIに合わせて変更
  withCredentials: true,
});

export default api;