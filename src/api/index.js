import axios from 'axios';
import * as util from '../assets/util.js';
//axios配置
const instance = axios.create({
  baseURL: '/vplan'
});

instance.defaults.headers.post['Content-Type'] = 'application/json';
// http request 拦截器
instance.interceptors.request.use(
    config => {
        let token = util.cookie("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
instance.interceptors.response.use(function(response) {
  return response;
}, util.catchError);

export default instance;