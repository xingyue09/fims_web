import Vue from 'vue'
import VueRouter from 'vue-router'
import {routers} from './router';
import Cookies from 'js-cookie';

Vue.use(VueRouter)



const routerMap =  new VueRouter({
	mode: 'history',
    routes: routers
});

routerMap.beforeEach((to,from,next) => {
	const token = Cookies.get("token");
	if(!token  && to.path !== '/login'){//判断是否登录
		next({
			name:"login"
		});
	}else{
		next();
	}
});
export default routerMap;
