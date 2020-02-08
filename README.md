# jiwubang
## 急物帮：新型肺炎生活（应急）物资小帮手。

![](https://github.com/ExponentiAI/jiwubang/blob/master/JWB_UI/jiwubang000.png)

针对 2020 年初在武汉爆发的新型冠状病毒疫情，本项目旨在收集居民和群众反馈的周边超市、药店卖口罩和消毒液的情况（位置、门店、基本类别、价格），便于这阶段居民出门购物和找到合适的地方购买口罩和消毒液。

## UI设计与交互

本项目的UI设计和交互如下：

1.结合地理位置收集物资信息，构建周边物资数据库。
鼓励居民、药店通过“信息提供”板块反馈信息，提供物资所在位置、种类、价格等结构化信息，帮助构建周边物资数据库。
![](https://github.com/ExponentiAI/jiwubang/blob/master/JWB_UI/function%20part1.png)

2.搜索周边物资信息，规划购买行程。
在小程序中直接搜索所需物资，可以从商店、口罩、消毒液三种类别的入口进行搜索，并规划自身的购买行程。
![](https://github.com/ExponentiAI/jiwubang/blob/master/JWB_UI/function%20part2.png)

3.发布物资求助信息，从线上社区中获得反馈。
当搜索的信息无法满足资源需求时，居民可以通过“信息求助”板块，发布自己所需物资的基本信息、所在位置、家庭生活的基本状况，向线上社区中的他人求助，从而获得信息帮助。
![](https://github.com/ExponentiAI/jiwubang/blob/master/JWB_UI/function%20part3.png)

## 总体技术路线 

面向当下步行距离（社区）范围内的生活应急物资采购需求，发挥基于地理位置（LBS）和群智感知（Crowdsensing）的信息共享模式，解决新型肺炎疫情下远距离出行购物不便，降低跨区域购物风险。

微信小程序前端信息发布、查询、交互开发基于Taro框架，后台数据管理和维护基于Python+Django+Rest框架，同时积极组建专业团队持续更新前端交互功能需求，以及后台可能面临的存储、读写、并发、IO、管控等性能优化方案。目前可支持的生活应急物资种类主要是口罩和消毒液，同时研发团队在陆续补充买菜、粮油等生活物资需求模块 。项目相关代码和设计已经在Github托管平台开源，方便更多开源社区爱好者了解项目，加入项目，一起参与改进和维护。

## 开源项目结构

- 前端小程序：https://github.com/ExponentiAI/jiwubang/tree/master/JWB_Client
- UI交互设计：https://github.com/ExponentiAI/jiwubang/tree/master/JWB_UI
- 后台服务：https://github.com/ExponentiAI/JWB_Server_API
- 测试数据：https://github.com/ExponentiAI/jiwubang/tree/master/JWB_Data

## 项目开发团队

- 湖南大学数据智能与服务协同实验室
- 湖南大学嵌入式与网络计算湖南省重点实验室
- 国防科技大学高性能计算国家重点实验室
- 中山大学大数据与计算之后能研究所

### 项目开发

- 指导老师：吴迪、胡莹、吴涛、袁翔、刘芳、吴诚堃、余从刚
- 前端开发学生：邓晗晖、蚁佳才、郭烨婷
- 后台开发学生：罗杰、廖学文、李硕、金航、唐安遥
- 交互设计学生：赵一迪、杜韦柯
- 社会推广学生：蔡傲彪、何璇、万紫荆、陈朵怡
- 技术支持人员：吴筐宇、莫凡、Jation、王忠、欧阳微娜
