## 开发环境和发布环境的接口地址配置

## axios
### npm install --save axios
  > bus.js axios的封装
  > process 进程 process.env 用户的环境信息



## 项目结构
### build/ 开发服务器和生产webpack构建的的实际配置

### config/ 主要配置文件
  #### index.js
  > proxyTable代理 联调跨域
  > session 跨域
  #### dev.env.js
  > 
  ### prod.env.js
  > 

### static/ webpack不处理的静态资产，直接复制到构建资产同目录
### test/unit 单元测试文件 test/e2e e2e测试文件



## 构建命令
  > npm run dev 启动本地开发服务器：热加载和编译错误覆盖；webpack+vue-loader用于单个vue组件
  > npm run build 建立生产资产：使用html-minifier缩小html；提取css到单文件
  > npm run unit
  > npm run e2e
  > npm run lint

## 接口配置
  > proxyTable 代理中间件
  > bus.js
  >

## 引入字体文件

## 注册登录
  > 命名视图
  > 监听路由变化

## 导航路由