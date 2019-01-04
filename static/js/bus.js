// 初始化axios请求默认部分
import axios from 'axios';

const baseUrl = process.env.NODE_ENV === "development" ?  '/api/management' : '/bcm-mrg/management'

// 根据dev/prod.js 中的API_ROOT 调接口
// const baseUrl=process.env.API_ROOT
const instance = axios.create({
  baseURL: baseUrl
});

export {
  axios ,
  baseUrl ,
  instance
}