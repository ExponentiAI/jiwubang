## /demo/sadsad.json
#### 接口类型
	GET
#### 接口请求地址
	/demo/jsondemo.json
#### 请求参数
|序号 |参数名 |是否必填 |说明 |
| -------- | -------- |-------- |-------- |  
|1. |fsdf |必填 |int |
#### 返回接口
```js
{
 "code": "200", //错误码
 "data": {
  "accountName": "xxxxxxx", //我是随机字符
  "accountStatus": "0", //我是1～10的随机数
  "quota": { //我是对象
   "class": "com.aliyun.csc.sls.model.AccountModel$Quota"
  }
 },
 "responseDatas": "A", //我是A、B、C随机出现
 "success": false, //我是true／false 随机出现
 "array": [ //我是数组1～10随机出现
  {
   "name": "10"
  }
 ]
}
```