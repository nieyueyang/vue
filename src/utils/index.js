
import Message from 'bee-message';


export const success = (msg) => {
    Message.create({ content: msg, color : 'success'  });
}

export const Error = (msg) => {
    Message.create({ content: msg, color : 'danger'});
}

export const Warning = (msg) => {
    Message.create({ content: msg, color : 'warning' });
}
/**
 * 数据返回统一处理函数
 * @param {*} response
 * @param {*} successMsg 成功提示
 */
export const processData = (response,successMsg) => {
    if(typeof response != 'object') {
        Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台');
        return;
    }
    if(response.status=='401'){
        Error(`错误:${(response.data.msg)}`);
        return;
    }
    if(response.status=='200'){
        let data=response.data;
        let repMsg = data.success;
        if(repMsg=='success'){
            if(successMsg){
                success(successMsg);
            }
            return data.detailMsg.data;
        }else if(repMsg=='fail_field'){
            Error(`错误:${(data && data.detailMsg && convert(data.detailMsg.msg)) || '数据返回出错'}`);
        }else {
            Error(`错误:${convert(data.message)}`);
            return;
        }
    }else{
        Error('请求错误');
        return;
    }
}

/**
 * param拼接到url地址上
 * @param {*} url
 * @param {*} params
 * @param {*} prefix
 */
export const paramToUrl = (url,params,prefix) =>{
    if(!prefix)prefix='';
    if(url.indexOf('?')==-1){
        url += '?r='+Math.random();
    }
    for(let attr in params){
        if((attr=='pageIndex')||(attr=='pageSize')){
            url+='&'+attr+'='+params[attr];
        }else{
            url+='&'+prefix+attr+'='+params[attr];
        }
    }
    return url;
}

// 后台乱码转换
export const convert = (text) => {
    let element = document.createElement("p");
    element.innerHTML = text;
    let output = element.innerText || element.textContent;
    console.log("output",output);
    element = null;
    return output;
}

export const setCookie = (name, value, options) => {

    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [ cookie, expires, path, domain, secure ].join('');
    var secure = options.secure ? '; secure' : '';
    var c = [ name, '=', encodeURIComponent(value) ].join('');
    var cookie = [ c, expires, path, domain, secure ].join('')
    document.cookie = cookie;

}

export const getCookie = (name) => {

    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    // 按照总设部规范，调整为下划线
    if(cookieValue != null && typeof cookieValue != 'undefined'){
        cookieValue = cookieValue.replace(/-/,"_");
    }
    return cookieValue;
}

export const checkFieldType = (oldFieldType,newFieldType) => {//字段类型转换限制
  //oldFieldType原始类型，newFieldType 目的类型
    //不能由字符、大本文、参照、下拉、图片和文件转为时间，日期，时间、布尔、整数、浮点型,但它们彼此可以互转
    if( (parseInt(oldFieldType)==parseInt(1) || (
       parseInt(oldFieldType)>parseInt(6) &&
       parseInt(oldFieldType)<parseInt(12)))
         && ((parseInt(newFieldType)>parseInt(1) && parseInt(newFieldType)< parseInt(7))
         || parseInt(newFieldType)==parseInt(12))
    ){
      Message.create({ content: '当前字段类型，不能变更为目标类型', color : 'danger'});
      return false;
    }
    //整数不能转为布尔、时间，日期，时间
    else if(parseInt(oldFieldType)==parseInt(2) && (
         (parseInt(newFieldType)>parseInt(4) &&  parseInt(newFieldType)<parseInt(7))||
       parseInt(newFieldType) == parseInt(3)|| parseInt(12)==parseInt(newFieldType))
    ){
        Message.create({ content: '当前字段类型，不能变更为目标类型', color : 'danger'});
         return false;
    }
    //布尔不能转为时间、日期、时间
    else if(parseInt(oldFieldType)==parseInt(3) && (
        (parseInt(newFieldType)>parseInt(4) &&  parseInt(newFieldType)<parseInt(7))||
        parseInt(12)==parseInt(newFieldType))
    ){
           Message.create({ content: '当前字段类型，不能变更为目标类型', color : 'danger'});
         return false;
    }
    //浮点数不能转为整数、时间、日期、时间
    else if(parseInt(oldFieldType)==parseInt(4) && (
       (parseInt(newFieldType)>parseInt(4) &&  parseInt(newFieldType)<parseInt(7))||
       parseInt(12)==parseInt(newFieldType) || parseInt(newFieldType) == parseInt(2))
    ){

        Message.create({ content: '当前字段类型，不能变更为目标类型', color : 'danger'});
         return false;
    }
    //时间、日期、时间不能转为浮点数、整数和布尔
    else if(((parseInt(oldFieldType)>parseInt(4) &&
       parseInt(oldFieldType)<parseInt(7)) ||
       parseInt(12)==parseInt(oldFieldType)) && (
       parseInt(newFieldType)>parseInt(1) && parseInt(newFieldType) < parseInt(5))
    ){
      Message.create({ content: '当前字段类型，不能变更为目标类型', color : 'danger'});
      return false;
    }else{
       return true;
    }
}

export const checkFieldLength = (type, value) => {//字段长度的限制
  //字段长度检查，不能超过固定长度，字符型4000，整数11，浮点数(25,8),布尔和时间类型固定，不能更改
  var tl = {
    "1": 100, "2": 11, "3": 1, "4": "25,8",
    "5": 19, "6": 19, "7": 64, "8": 64,
    "9": 255, "10": 255, "11": 255, "12": 19
  };
  // var inputPre = $(target).parent().prev().children()[0];//字段类型
  //字符、文件、图片、参照和下拉长度不能超过4000,oracle中支持最大4000
  if(parseInt(type) == 1 || parseInt(type) > 6 && parseInt(type) < 12){
    if(parseInt(value) > 4000 || parseInt(value) == 0){
      Error('字段长度合法范围：1-4000');
      return true
    }
  }
  //整数范围11
  if(parseInt(type) == 2){
    if(parseInt(value) > parseInt(11) || parseInt(value) == 0){
      Error('字段长度合法范围：1-11');
      return true
    }
  }
  //浮点数(25,8)
  if(parseInt(type) == 4){
    var part = value.split(',')
    var part1 = part[0];
    var part2 = part[1];
    if(parseInt(part1) > 25 || parseInt(part2) > 8 || parseInt(part1)==0){
      Error('字段长度合法范围：(1,0)-(25,8)');
      return true
    }
  }
}


// "1": 100, 字符
// "2": 11, 整型
// "3": 1, 布尔
// "4": "25,8",  浮点数
// "5": 19, 日期
// "6": 19, 日期时间
// "7": 64, 参照
// "8": 64, 下拉
// "9": 255, 图片
// "10": 255, 文件
// "11": 255, 大文本
// "12": 19 时间

// export const typeLenJson = {
//   "1": 100,
//   "2": 11,
//   "3": 1,
//   "4": "25,8",
//   "5": 19,
//   "6": 19,
//   "7": 64,
//   "8": 64,
//   "9": 255,
//   "10": 255,
//   "11": 255,
//   "12": 19
// }
