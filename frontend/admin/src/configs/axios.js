/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
// const API_KEY = ""
const Axios = axios.create({
  withCredentials: true,
  baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:9000/api/v1' : 'https://api.airneis.tsiang.fr',
  // headers: {
  //   'Cache-Control': 'no-cache',
  //   'Pragma': 'no-cache',
  //   'Expires': '0'
  // }
});


Axios.interceptors.request.use(function (config) {
  const  token =  localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});


Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error?.response?.data?.message === "invalidToken" && error?.response.status === 403) ||
     (error?.response?.data?.message === "Unauthorized" && error?.response.status === 401)
    ) {
      if(localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default Axios;
