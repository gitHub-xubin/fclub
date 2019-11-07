import { imgBaseUrl } from './config.js'
/**
 * loginOut 退出登录
 * 删除本地cookie
*/
export function loginOut() {
	setCookie("_token", '')
	setCookie("user_status", 0)
	setCookie("user", '')
};
/**
 * setCookie 设置cookie
 * 参数expiredays为过期时间;
*/
export function setCookie(name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
/**
 * getCookie 获取cookie
 *
*/
export function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	}
	else {
		return null;
	}
};

export default function (Vue, options) {
	Vue.prototype.$loginOut = loginOut;
	Vue.prototype.$setCookie = setCookie;
	Vue.prototype.$getCookie = getCookie;
    /**
     * imgHref 图片地址拼接
     * id 图片id
     * mode @imageView2/1/w/200 缩略图显示格式
    */
	Vue.prototype.$url = function (id, mode) {
		if (!id)
			return "";
		if (!mode)
			mode = "";
		var n = id.indexOf(",");
		if (n > -1)
			id = id.slice(0, n);
		if (id.indexOf('http') > -1) {
			return id;
		}
		else {
			return imgBaseUrl + id + mode;
		}
	};
    /**
     * formatDate 时间戳转化
     *
    */
	Vue.prototype.$formatDate = function (timestamp, type) {
		var d = new Date(timestamp);
		switch (type) {
			case 1: //12-27 12:00
				var s = (d.getMonth() + 1) + "-" + d.getDate();
				s += " " + d.getHours() + ":" + d.getMinutes();
				break;
			case 2: //2017-12-27 12:00
				var s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
				s += " " + d.getHours() + ":" + d.getMinutes();
				break;
			case 3: //2017-12-27 12:00:00
				var s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
				s += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				break;
			case 4: //2017年12月27日 12:00:00
				var s = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
				s += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				break;
			case 5: //2017年12月27日 12:00
				var s = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
				s += " " + d.getHours() + ":" + d.getMinutes();
				break;
			case 6: //12月27日 
				var s = (d.getMonth() + 1) + "月" + d.getDate() + "日";
				break;
			case 7: //2018年1月15日
				var s = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
				break;
			case 8: //1月15日 12:00:00
				var s = (d.getMonth() + 1) + "月" + d.getDate() + "日";
				s += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				break;
			case 9: //2017-12-27
				var s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
				break;
			case 10: // 2018.03.29
				var s = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
				break;
		}
		s = s.replace(/\b(\d)\b/g, "0$1");
		return s;
	};
    /**
     * [onScroll 监听滚动条]
     * 判断条件scrollHeight == clientHeight + scrollTop
     */
	Vue.prototype.$onScroll = function (callBack) {
		window.addEventListener("scroll", function (event) {
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			var scrollHeight = document.documentElement.scrollHeight;
			var clientHeight = document.documentElement.clientHeight;
			callBack({
				scrollTop: scrollTop,
				scrollHeight: scrollHeight,
				clientHeight: clientHeight
			});
		});
	};
}