## [1.4.2](one-team-web/compare/v1.4.1...v1.4.2) (2019-11-25)


### Bug Fixes

* **okr:** 创建okr时,不限年度语义化 ([bd5290c](one-team-web/commit/bd5290c))


### Features

* **okr:** 优化回退机制 ([89b9257](one-team-web/commit/89b9257))
* **okr:** 去除input可清空项 ([6a12bf8](one-team-web/commit/6a12bf8))
* **okr:** 完善成员权限 ([00138b4](one-team-web/commit/00138b4))



## [1.4.1](one-team-web/compare/v1.4.0...v1.4.1) (2019-11-25)


### Features

* **okr:** promise包装获取小组信息接口 ([70cb859](one-team-web/commit/70cb859))
* **okr:** 修复登录页重定向的问题 ([8b8104e](one-team-web/commit/8b8104e))



# [1.4.0](one-team-web/compare/v1.3.7...v1.4.0) (2019-11-25)


### Features

* **okr:** okr 初步交互完成 ([360e456](one-team-web/commit/360e456))
* **okr:** 中文输入法回车不被enter事件捕获 ([7a285e1](one-team-web/commit/7a285e1))



## [1.3.7](one-team-web/compare/v1.3.5...v1.3.7) (2019-10-28)


### Features

* **forum:** 在编辑页和新增页禁止切换日期 ([d236ceb](one-team-web/commit/d236ceb))
* **http:** 修复多次请求出现多个loading的问题 ([1cfd825](one-team-web/commit/1cfd825))
* **index:** 添加favicon ([3524718](one-team-web/commit/3524718))
* **markdown:** markdown支持图片上传啦 ([3b157c6](one-team-web/commit/3b157c6))
* **xss:** 优化过滤规则 ([4d336d6](one-team-web/commit/4d336d6))
* **xss:** 防止xss攻击 ([014e50a](one-team-web/commit/014e50a))



## [1.3.5](one-team-web/compare/v1.3.4...v1.3.5) (2019-10-14)


### Bug Fixes

* **forum:** 修复参与者在侧边栏错乱的问题 ([043e397](one-team-web/commit/043e397))
* **forum:** 修复论坛参与者重复出现的问题 ([4873da4](one-team-web/commit/4873da4))


### Features

* **forum:** 全员周报在滚动到底部时不再出现[已加载完全部数据]的message提示，而是在列表底部提醒 ([98e3e61](one-team-web/commit/98e3e61))



## [1.3.4](one-team-web/compare/v1.3.3...v1.3.4) (2019-09-24)


### Features

* **forum:** 从论坛详情回到论坛列表保持滚动位置 ([cabda11](one-team-web/commit/cabda11))
* **forum:** 换一种方式实现从详情页回到列表也记录滚动位置 ([177a415](one-team-web/commit/177a415))
* **forum:** 显示参与者头像一栏,可点击定位到相应成员的论帖 ([2d972d3](one-team-web/commit/2d972d3))
* **forum:** 论坛信息显示具体的编写时间 ([da81f09](one-team-web/commit/da81f09))
* **forum:** 论坛模块显示未写论帖的成员 ([707f14a](one-team-web/commit/707f14a))
* **login:** 前端暂且把登录有效期调整为一个月 ([37e8884](one-team-web/commit/37e8884))
* **markdown:** 链接采取target形式跳转 ([bf2e885](one-team-web/commit/bf2e885))



## [1.3.3](one-team-web/compare/v1.3.2...v1.3.3) (2019-09-05)


### Features

* **forum:** 禁止提交空内容 ([7487d4a](one-team-web/commit/7487d4a))
* **forum:** 论帖详情页禁止点击日期翻页 ([a2d3958](one-team-web/commit/a2d3958))
* **forum:** 评论页可以对自己发表的评论进行删除和再编辑操作 ([2f2f38f](one-team-web/commit/2f2f38f))
* **forum:** 详情页优化 ([f9600fa](one-team-web/commit/f9600fa))



## [1.3.2](one-team-web/compare/v1.3.1...v1.3.2) (2019-09-04)


### Features

* **forum:** 实名显示点赞 ([daa9f62](one-team-web/commit/daa9f62))
* **forum:** 成员可在一周内发布多条论帖 ([5aa90cf](one-team-web/commit/5aa90cf))



## [1.3.1](one-team-web/compare/v1.3.0...v1.3.1) (2019-08-29)


### Bug Fixes

* **forum:** 解决markdown文本过长超出的问题 ([8ea0783](one-team-web/commit/8ea0783))


### Features

* **forum:** 上线点赞功能,但还没有消息提示 ([657f63e](one-team-web/commit/657f63e))
* **forum:** 修复详情页切换日期报错的问题 ([755756d](one-team-web/commit/755756d))
* **forum:** 论坛模块增加默认头像 ([eb6ee75](one-team-web/commit/eb6ee75))
* **forum:** 详情页增加编辑论帖按钮 ([6d6caac](one-team-web/commit/6d6caac))


### Performance Improvements

* **forum:** 动画减弱,减少路由切换页面跳动 ([7233343](one-team-web/commit/7233343))



# [1.3.0](one-team-web/compare/v1.2.0...v1.3.0) (2019-08-23)


### Bug Fixes

* **report:** 当周周报为空时,查看上一周周报报错 ([4cc33ca](one-team-web/commit/4cc33ca))
* **team:** 解决成员搜索框无法输入的问题 ([12182ed](one-team-web/commit/12182ed))


### Features

* **forum:** 新增论坛模块 ([77dc1e6](one-team-web/commit/77dc1e6))
* **report:** 所有成员周报数据由之前的分页加载改成滚动懒加载 ([2480901](one-team-web/commit/2480901))



# [1.2.0](one-team-web/compare/v1.0.8...v1.2.0) (2019-07-11)


### Bug Fixes

* **center:** 在浏览别人周报的前提下点击[我自己]没有跳转到自己的周报 ([26a5854](one-team-web/commit/26a5854))
* **firework:** 修复没在首页拖动窗口大小报错的问题 ([6bda919](one-team-web/commit/6bda919))
* **header:** 尝试解决样式冲突的问题 ([7ed676c](one-team-web/commit/7ed676c))
* **header:** 解决文件打包后样式冲突的问题 ([aff6772](one-team-web/commit/aff6772))
* **list:** 大管理员默认看到的周报以分页的形式展示 ([04afdc9](one-team-web/commit/04afdc9))
* **member:** 修复删除成员报错的问题 ([e7f31f2](one-team-web/commit/e7f31f2))
* **notification:** 点击通知正确跳转 ([2178da6](one-team-web/commit/2178da6))
* **report-list:** 解决我自己模块中点击日期跳转url中id丢失的问题 ([2a11156](one-team-web/commit/2a11156))
* **router:** 文件名小写 ([c8fe1e5](one-team-web/commit/c8fe1e5))


### Features

* **404:** 添加404页面 ([a1545fd](one-team-web/commit/a1545fd))
* **base:** 容错处理 ([a88345f](one-team-web/commit/a88345f))
* **home:** 去除首页烟花效果并修改首页欢迎文案 ([7af458f](one-team-web/commit/7af458f))
* **pagination:** 添加分页功能 ([1b6e7e7](one-team-web/commit/1b6e7e7))
* **team:** 团队列表支持姓名搜索 ([c679009](one-team-web/commit/c679009))
* **team:** 增加[把成员加入白名单功能] ([65ee72c](one-team-web/commit/65ee72c))
* **team:** 暂且规定一个人只能存在一个组 ([724b87f](one-team-web/commit/724b87f))
* **team-list:** 全部成员按钮高亮 ([e879e8c](one-team-web/commit/e879e8c))
* **team-list:** 操作成员时增加二次提示 ([4660a53](one-team-web/commit/4660a53))
* **version:** 引进standard-version工具 ([7e78314](one-team-web/commit/7e78314))
* **version:** 添加scripts脚本 ([f070255](one-team-web/commit/f070255))


### Performance Improvements

* **center:** 修改url传参方式 ([a593115](one-team-web/commit/a593115))
* **date:** 将一周的开始时间设为周一 ([b299c72](one-team-web/commit/b299c72))
* **editor:** 编辑器增加取消按钮 ([b731ca8](one-team-web/commit/b731ca8))
* **firework:** 禁止右键激出烟花效果 ([1c1a9ae](one-team-web/commit/1c1a9ae))
* **header:** 点击首页icon时导航栏的active-text-color恢复 ([eda0bd5](one-team-web/commit/eda0bd5))
* **header:** 顶部导航栏点击logo图标时菜单栏高亮消失 ([0bc2a46](one-team-web/commit/0bc2a46))
* **list:** 更改获取组员的参数 ([9b1ae5a](one-team-web/commit/9b1ae5a))
* **list:** 汇报页默认显示自己小组成员的周报 ([41c6616](one-team-web/commit/41c6616))
* **login:** 登录拦截机制优化 ([a3b6584](one-team-web/commit/a3b6584))
* **login-home:** 登录页改版以及首页新春特别版 ([4242a9c](one-team-web/commit/4242a9c))
* **nav:** 侧边栏加载增加动画效果 ([ecc1f7b](one-team-web/commit/ecc1f7b))
* **one-team-main:** 将滚动属性修改为overlay，防止页面抖动 ([e5fba61](one-team-web/commit/e5fba61))


### BREAKING CHANGES

* **pagination:** 可能会影响到小程序
* **login:** 登录页和首页呈现机制
* **one-team-main:** 这么一改好像loading动画也变完整了，奇怪了。。
* **date:** 将原有的时间运算逻辑替换成moment来计算
* **login-home:** 路由和文件结构有修改



## [1.0.8](one-team-web/compare/v1.0.7...v1.0.8) (2019-01-15)


### Bug Fixes

* **date:** start 1 ([7938603](one-team-web/commit/7938603))
* **group:** 当小组成员没有周报时显示缺省图片 ([e4b8034](one-team-web/commit/e4b8034))
* **nav:** 解决侧边栏点击名字无法定位的问题 ([8947d88](one-team-web/commit/8947d88))
* **nav:** 解决屏幕变短时侧边栏过长时不能完全显示的问题 ([735f41e](one-team-web/commit/735f41e))
* **report:** 解决编写完周报以后汇报列表丢失的问题 ([c23926e](one-team-web/commit/c23926e))


### Features

* **loading:** 添加loading ([290b501](one-team-web/commit/290b501))
* **report:** delete cancel ([a9287e2](one-team-web/commit/a9287e2))


### Performance Improvements

* **loading:** 修改loading形状 ([445564b](one-team-web/commit/445564b))



## [1.0.7](one-team-web/compare/v1.0.5...v1.0.7) (2019-01-04)


### Bug Fixes

* **msgbox:** 兼容微信小程序不支持patch ([5577bdb](one-team-web/commit/5577bdb))


### Features

* **totop:** 增加totop按键 ([f1450ac](one-team-web/commit/f1450ac))


### Performance Improvements

* **index:** 优化可视区域滚动范围 ([724386f](one-team-web/commit/724386f))
* **list:** 优化页面切换时候出现的图标抖动的现象 ([e2a8b9e](one-team-web/commit/e2a8b9e))
* **list:** 当没有一个成员写周报时显示默认图片 ([e05326d](one-team-web/commit/e05326d))
* **nav:** 优化导航栏运动轨迹 ([1565e4b](one-team-web/commit/1565e4b))



## [1.0.5](one-team-web/compare/v1.0.4...v1.0.5) (2019-01-03)


### Bug Fixes

* **add:** 修改汇报页面接口参数 ([0dd5b96](one-team-web/commit/0dd5b96))
* **badge:** 0 hidden ([068874f](one-team-web/commit/068874f))
* **date:** 修复计算两个日期是否相差一周的逻辑 ([e80b612](one-team-web/commit/e80b612))
* **index.js:** 修正计算两个日期相差多少周的逻辑 ([938bcf8](one-team-web/commit/938bcf8))
* **list.vue:** 修改首页个人周报文案 ([14643e5](one-team-web/commit/14643e5))
* **report-editor:** 多个周报多个评论 ([7ab1f36](one-team-web/commit/7ab1f36))
* **setting:** style ([2b42b73](one-team-web/commit/2b42b73))


### Features

* **center:** 个人中心模块功能优化 ([1654cd9](one-team-web/commit/1654cd9))
* **report:** style ([35f92ed](one-team-web/commit/35f92ed))


### Performance Improvements

* **date-range:** 升级dateRange组件并在页面中统一使用 ([327e2b0](one-team-web/commit/327e2b0))
* **header:** 将个人中心移到header一级菜单 ([863f282](one-team-web/commit/863f282))
* **reportlist.vue:** 周报提示闪动 ([764a3da](one-team-web/commit/764a3da))



## [1.0.4](one-team-web/compare/v1.0.3...v1.0.4) (2018-12-19)


### Features

* **login:** eslint ([59982d0](one-team-web/commit/59982d0))
* **password:** eslint ([23d01e7](one-team-web/commit/23d01e7))



## [1.0.3](one-team-web/compare/v1.0.2...v1.0.3) (2018-12-12)


### Bug Fixes

* **logo:** logo size ([1e37aa6](one-team-web/commit/1e37aa6))
* **msgbox:** 横向滚动条 ([bdc1b0d](one-team-web/commit/bdc1b0d))
* 修正上一次提交 ([d46c064](one-team-web/commit/d46c064))


### Features

* **msgbox:** 点击通知跳转 ([ed6fca9](one-team-web/commit/ed6fca9))
* 个人中心memberId=>userId ([e74f5ae](one-team-web/commit/e74f5ae))
* 关注 + 接口修改 ([019db57](one-team-web/commit/019db57))
* **setting:** 校验 ([23ecc4d](one-team-web/commit/23ecc4d))



## [1.0.2](one-team-web/compare/db3611d...v1.0.2) (2018-12-03)


### Bug Fixes

* **msgbox:** 全部标记已读 ([91b674b](one-team-web/commit/91b674b))


### Features

* **cc:** 安装提交校验包 ([db3611d](one-team-web/commit/db3611d))



