## 急物帮前端

#### 开发框架

taro框架开发小程序文档 [链接](https://taro-docs.jd.com/)

已配置taro-ui 可直接使用 [链接](https://taro-ui.jd.com/#/docs/introduction)

微信小程序开发工具下载 [链接](https://dldir1.qq.com/WechatWebDev/1.2.0/201910121/wechat_devtools_1.02.1910121_x64.exe)

微信小程序文档 [链接](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/code.html#JSON-%E9%85%8D%E7%BD%AE)

##### 运行命令
`npm run dev:weapp`

##### 打包命令
`npm run build:weapp`


简要目录说明

dist 打包上传文件

src

 -- api api 统一管理目录 请求域名在config里面配置

 -- assets 静态资源目录

 -- components 公共组件

 -- config 全局配置文件

 -- lib 工具类

  -- http 公共http请求组件

project.config 配置appid desc等信息

```
// 网络http请求示例 首页有demo
http.request(api.getUser)
  .then((res:any)=>{
  if(res.success){
    this.setState({
    },()=>{
    // ...
    })
  }
})
```