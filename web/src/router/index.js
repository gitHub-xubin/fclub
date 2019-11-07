import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const feedManager = r => require.ensure([], () => r(require('@/page/feedManager')), 'feedManager');

export default new Router({
	routes: [
		{
			path: '/',
			component: login
		},
		{
			path: '/manage',
			component: manage,
			name: '',
			children: [{
				path: '',
				component: home,
				meta: [],
			}, {
					path: '/feedManager',
					component: feedManager,
					meta: ['明星管理', 'feed管理'],
				}]
		}
	]
})
