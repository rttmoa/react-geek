# 极客园-移动端-TypeScript

* **安装：yarn**
* **启动：yarn start**

js/jsx/ts/tsx/.d.ts
js: 写js功能和react组件
js--> ts (工具类)
js--> tsx (组件必须用tsx)
.d.ts: typescript类型声明文件

此项目改造: js->ts,  jsx->tsx

QA-index备份中==> 断言的使用?  改造storage文件?

type不能继承 interface可以继承

redux中的Dispatch是做类型校验的、传参dispatch({type: ''})、必须要有type类型

先改reducers再改actions

/**直接看MD笔记即可*/

项目代码改动==>(公共组件)
1.NavBar -> 2.Icon -> 3.在QA中测试组件功能 -> 4.Img -> 5.Input -> 6.Testarea

项目代码改动==>(页面部分)
1.Layout -> 2.NotFound ->
3.Login(unKnow和any区别-QA) ->
4.Store(indexts) -> actions(logints) ->dispatch类型校验Dispatch -> 索引签名类型QA ->
5.Profile -> Store -> reducers -> actions ->
6.pages -> Profile -> index.tsx
7.Home ->  reducers -> utils错误 -> actions -> 使用thunkaction：https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks
reducers处理的是 { type: 'profile/user' payload: User }
8.Search(新加模块) -> 视频6-12-搜索功能(上) -> 15-搜索功能-准备redux的结构
