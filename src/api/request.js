/**接口请求封装 */
import axios from "axios";
import { apiRoot } from "./host";

axios.defaults.timeout = 200000;

/**json转form */
const json2Form = json => {
  const str = [];
  for (let p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
};

// 根据请求url 按/切割路由
const splitRoute = url => {
  if (url.startsWith("/")) {
    url = url.slice(1);
  }
  const arr = url.split("/");
  return arr;
};

// 设置baseUrl,传入url根据第一个参数判断使用哪个url
const setUrl = url => {
  const arr = splitRoute(url);
  const root = arr[0];

  let baseUrl = apiRoot;
  switch (root) {
    case "http:":
    case "https": {
      return url;
    }
  }
  return `${baseUrl}/${arr.join("/")}`;
};

// response数据格式化
const responseParse = res => {
  return res;
};

// 请求主方法
const fetch = async (method, url, data, axiosExtra) => {
  const reqUrl = setUrl(url);

  let config = {
    method,
    url: reqUrl
  };

  // 添加额外参数
  if (axiosExtra) {
    config = { ...config, ...axiosExtra };
  }

  switch (method) {
    case "GET": {
      config.params = data;
      break;
    }
    case "POST": {
      config.data = data;
      break;
    }
  }
  config.headers.authorization = localStorage.getItem("token");
  const result = await axios(config)
    .then(res => {
      return responseParse(res.data);
    })
    .catch(error => {
      console.error("Error", error);
      const errorObj = {
        error: "网络可能不好，重新再进入试试吧!",
        level: "error"
      };
      return errorObj;
    });
  return result;
};

// get请求
const get = (url, data, axiosExtra) => {
  return fetch("GET", url, data, axiosExtra);
};

// post请求
const post = (url, data, axiosExtra) => {
  return fetch("POST", url, data, axiosExtra);
};

// post json请求
const postJson = (url, data, axiosExtra) => {
  let headers = axiosExtra.headers || {};
  headers = { "content-type": "application/json", ...headers };
  axiosExtra.headers = headers;
  return fetch("POST", url, data, axiosExtra);
};

// post form表单请求
const postForm = (url, data, axiosExtra) => {
  let headers = axiosExtra.headers || {};
  headers = { "content-type": "application/x-www-form-urlencoded", ...headers };
  axiosExtra.headers = headers;
  return fetch("POST", url, json2Form(data), axiosExtra);
};

// formdata请求
const postFormdata = (url, data, axiosExtra) => {
  let headers = axiosExtra.headers || {};
  headers = { "content-type": "multipart/form-data", ...headers };
  axiosExtra.headers = headers;
  return fetch("POST", url, data, axiosExtra);
};

export { get, post, postForm, postJson, postFormdata };
