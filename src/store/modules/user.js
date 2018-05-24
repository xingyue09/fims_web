import Cookies from 'js-cookie';

const user = {
	state:{
	},
	mutations:{
		logout(state,vm){
			Cookies.remove("token");
			Cookies.remove("username");
		},
		login(state,vm){
			Cookies.set("username",vm.usercode,{expires:1/48});
			Cookies.set("token",vm.token,{expires:1/48});//设置cookie过期时间30分钟
		}
	}
}
export default user;
