/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * apiUrl: 接口api地址
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = window.location.protocol + "//" + window.location.host;
let apiUrl = '';
let imgBaseUrl = '';

let debug = false;//是否测试模式
if (!debug) {//线上 
    apiUrl = '';
    imgBaseUrl = 'http://file.fclubs.co/';
}else{//测试
    apiUrl = '';
    imgBaseUrl = 'http://file.fclubs.co/';
}

export {
    baseUrl,
    apiUrl,
    imgBaseUrl,
}