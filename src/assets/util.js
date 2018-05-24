import Cookies from 'js-cookie';
import Vue from 'vue'

//cookie
export const cookie = function(key, value){
  if (!value) {
    var lsVal = Cookies.get(key);
    return lsVal;
  }else {
    return Cookies.set(key, value);
  }
} 
//ajax错误处理
export const catchError = function(error) {
  if (error.response) {
    let msg = error.response.data.message;
    switch (error.response.status) {
      case 400:
        this.$Message.error(msg || '请求参数异常');
        break;
      case 401:
        Cookies.remove('token');// 401 清除token信息并跳转到登录页面
        this.$Message.warning(msg || '密码错误或账号不存在！');
        break;
      case 403:
        this.$Message.warning(msg || '无访问权限，请联系企业管理员');
        break;
      default:
        this.$Message.error(msg || '服务端异常，请联系技术支持');
    }
  }
  return Promise.reject(error);
}

//计算当前日期的周数（第几周）
export const  getWeekOfYear = function(date,weekStart) { // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
    weekStart = (weekStart || 0) - 0;  
    if(isNaN(weekStart) || weekStart > 6)  
        weekStart = 0;    
  
    var year = date.getFullYear();
    var firstDay = new Date(year, 0, 1);  
    var firstWeekDays = 7 - firstDay.getDay() + weekStart;  
    var dayOfYear = (((new Date(year, date.getMonth(), date.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;  
    return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1; 
}

/**  
* 获得iyear年，第weeknum周的起止日期  
**/  
export const getWeekStartAndEnd = function(iyear,weeknum) {  
    //起止日期数组    
    var arr = new Array();
    var firstDate = new Date(iyear,0,1);//年份的第一天日期    
    var endDate = new Date(firstDate.getFullYear(),firstDate.getMonth(),firstDate.getDate());
    endDate.setDate(endDate.getDate() + weeknum * 7  - 1);
    var startDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate());
    startDate.setDate(startDate.getDate() - 6);
    arr.push(getDateStr(startDate));
    arr.push(getDateStr(endDate));   
    return arr;
} 

//获取当前日期yy-mm-dd
//date 为时间对象
export const getDateStr = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var date = date.getDate();
    if(month < 10){
        month = "0" + month;
    }
    if(date < 10){
        date = "0" + date;
    }
    return year+"-"+month+"-"+date;
}