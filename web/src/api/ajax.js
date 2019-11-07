import axios from 'axios'
import qs from 'qs'
import router from '../router'
import { Notification } from 'element-ui';
import { setCookie, getCookie, loginOut } from '../utils/common.js'
import { apiUrl } from '../utils/config.js'

/*
*请求前拦截此处可以添加请求头
*/
axios.defaults.timeout = 10000;
axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Authorization': getCookie('_token')||'',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        if (config.method == 'post') {
            console.log(config.data)
            config.data = qs.stringify(config.data);
        }else if(config.method=='get' || config.method == 'put' || config.method == 'delete'){
            config.params = config.data;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
/*
*请求后拦截
*/
axios.interceptors.response.use(
    response => {
        if (response.data.code == 200) {
            return response;
        } else if (response.data.code == 11002){
            loginOut();
            router.push({ path: '/' })
        } else {
            Notification.error({
                title: '错误',
                message: response.data.msg
            })
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status){
                case 404:
                    Toast('404,错误请求');
                    break
                  case 401:
                    Toast('401,未授权');
                    break
                  case 403:
                    Toast('403,禁止访问');
                    break
                  case 408:
                    Toast('408,请求超时');
                    break
                  case 500:
                    Toast('500,服务器内部错误');
                    break
                  case 501:
                    Toast('501,功能未实现');
                    break
                  case 503:
                    Toast('503,服务不可用');
                    break
                  case 504:
                    Toast('504,网关错误');
                    break
                  default:
                    Toast('未知错误');
                }
            }else{
                Toast('网络不给力,请稍后再试！');
            }
        return Promise.reject(error.response.data);
    });
export default axios;