import Cookie from 'js-cookie';
const baseRoutes = [
  '/404', '/login', '/error',
];
const url = window.location.origin;
const protocol = window.location.protocol;

// const STOMP_SERVICE = `ws://${window.location.hostname}:15674`;
let STOMP_SERVICE = '';
const env = process.env.NODE_ENV;
if (env === "production" || env === "none") {
  if (protocol === 'http:') {
    STOMP_SERVICE = `ws://${window.location.hostname}:15674/ws`;
  } else if (protocol === 'https:') {
    STOMP_SERVICE = `wss://${window.location.hostname}:15673/ws`;
  } else {
    STOMP_SERVICE = `ws://${window.location.hostname}:15674/ws`;
  }
} else {
  STOMP_SERVICE = `ws://192.168.1.91:15674/ws`;
}

const STOMP_HEADERS = {
  login: 'hzzt',
  passcode: 'hzztrbq@2018',
};

const baseUrl = `${url}/api` ;

const imgUrl = env === 'development' ? 'http://192.168.1.91:7011/' : url + '/';
const formatDate = (date, type = '/') => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date();
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(type);
};

const formatDateTime = (date, type = '-') => {
  if (!date) return;
  return formatDate(date, type) + ' ' + formatTime(date);
};

const formatTime = (date) => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date(date);
  }
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const strSplice = (str, index, count, newstr = '') => {
  if (!str) return '';
  if (index >= 0) {
    return str.slice(0, index) + newstr + str.slice(index + count);
  } else {
    return str.slice(0, str.length + index) + newstr + str.slice(str.length + index + count);
  }
};

const encodeQueryData = (data) => {
  let ret = [];
  for (let d in data) {
    if (Object.prototype.hasOwnProperty.call(data, d)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  }
  return ret.join('&');
};

const clearObject = (obj)=>{
  Object.keys(obj).forEach(item=>{
    if(obj[item] instanceof Object){
      obj[item].clear();
    } else if(obj[item] instanceof Array){
      obj[item] = []
    } else {
      obj[item] = null
    }
  })
  return obj;
}
function clearLoginInfo() {
  Cookie.remove('DD_TOKEN', { domain: '.hzztai.com' });
}
export {
  baseRoutes,
  baseUrl,
  imgUrl,
  url,
  formatDateTime,
  formatDate,
  formatTime,
  formatNumber,
  strSplice,
  clearLoginInfo,
  STOMP_SERVICE,
  STOMP_HEADERS,
  encodeQueryData,
  clearObject,
};

