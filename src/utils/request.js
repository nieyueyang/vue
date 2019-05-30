import axios from "axios";
import qs from 'querystring';
import Vue from 'vue';
let vue = new Vue();

let prefixUrl;
prefixUrl = process.env.NODE_ENV === 'development' ? '/api' : window.server+'/sso';// 'http://127.0.0.1:8080/sso';

function createLicenseDoc(){
  var img = "<div style='text-align: center;margin-top: 80px'><img src='../assets/images/error_02.png'/></div>"
  document.body.innerHTML = img
}

axios.defaults.timeout = 30*60*1000;  // 30分钟

export default (url, options) => {
  let param = options.param||{}
  param['_R']=Math.random();

  return new Promise((resolve) => {
    let data = {}
    if (options.formatJSon) {
      data = options.data
    } else {
      data = qs.stringify(options.data)
    }

    axios({
      method: options.method,
      url: prefixUrl + url,
      data: data,
      params: param,
      headers: options.formatJSon ? options.headers : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then((resp) => {
          if(resp.data.code == 200){
                resolve(resp.data);
              }else if(resp.data.code ==400){
                //特殊状态进行处理
                resolve(resp.data);
              }else{
                //给出提示
          }

      })
      .catch((param) => {
        // if (param.response.status == 306) {
        //   window.parent.location.href = '/wbalone/pages/login/login.html?r=L3BvcnRhbC8'
        // }
        // Message.create({ content: '数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台', color : 'danger'});
       // reject(param)
      })
  })
}





export const axiosPost = (url, options) => {
    return new Promise((resolve) => {
          axios({
              method:"post",
              url: prefixUrl + url,
              data:qs.stringify({
                ...options.data
              }),
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  "Authorization" : sessionStorage.getItem("Authorization")
              }
              
          }).then( (response)=> {
                responseHandle(response.data,resolve);
            }).catch(function (error){
              console.log(error);
            });
    })
}


export const axiosGet = (url, options) => {
  let param = options.param||{}
  param['_R']=Math.random();
  let data = {}
  data = qs.stringify(options.data)
  return new Promise((resolve) => {
        axios({
            method:"get",
            url: prefixUrl + url,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization" : sessionStorage.getItem("Authorization")
            }
        }).then( (response)=> {
              responseHandle(response.data,resolve);
          }).catch(function (error){
            console.log(error);
          });
  })
}

//返回数据处理
function responseHandle(data,resolve){
  if(data.code == 200){  //访问成功
    resolve(data.data);
  }else if (data.code == 20003 || data.code == 20001){ //需要特殊处理的数据
      vue.$message({type: 'warning', message:  data.msg})

  }else{  //弹出msg提示
      vue.$message({type: 'warning', message:  data.msg})
     
  }

  
}
