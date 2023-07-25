// 用户 Token 的本地缓存键名
const TOKEN_KEY = 'geek-itcast-21'            // Token
const CHANNEL_KEY = 'geek-itcast-21-channels' // Channel 
const SEARCH_HIS_KEY = 'geek-itast-21-search' // Search

type Token = {
  token: string
  refresh_token: string
}
// type Channels = number[]  // 数字类型的数组
// type Channels = object[]  // 对象类型的数组
type Channels = {
  id: number
  name: string
}[]


// FIXME: TOKEN数据的 获取、存储、删除

/** #### 存储 TOKEN ---*/
export const setTokenInfo = (tokenInfo: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))
}

/** #### 获取 TOKEN ---*/
export const getTokenInfo = (): Token => {
  // JSON.parse() 参数1必须是string类型
  // localStorage.getItem() 获取到的结果类型  string | null
  // 大白话，听哥的，这个地方就是string 
  // return JSON.parse(localStorage.getItem(TOKEN_KEY) as string) || {}
  return JSON.parse(localStorage.getItem(TOKEN_KEY)!) || {} // 这里不会为 null,  如果是null 返回的是 {}  |  非空断言的使用 | QA
}

/** #### 删除 TOKEN */
export const removeTokenInfo = () => {
  localStorage.removeItem(TOKEN_KEY)
}

/** #### 判断 是否有TOKEN ---*/
export const hasToken = () => { // 会有类型推断：const hasToken: () => boolean   返回的就是布尔值
  return !!getTokenInfo().token
}




// FIXME: 频道数据的 获取、存储、删除

/** ####  存储 频道数据 */
export const setLocalChannels = (channels: Channels) => {
  localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
}

/** ####  获取 频道数据  */
export const getLocalChannels = (): Channels => {
  return JSON.parse(localStorage.getItem(CHANNEL_KEY)!) // 断言， 返回的不是空
}

/** ####  删除 频道数据  */
export const removeLocalChannels = () => {
  localStorage.removeItem(CHANNEL_KEY)
}




// FIXME: 搜索关键词的 获取、存储、删除

/** #### 获取 历史关键字 ---*/
export const getLocalHistories = (): string[] => {
  return JSON.parse(localStorage.getItem(SEARCH_HIS_KEY)!) || []
}

/** #### 存储 历史关键字 ---*/
export const setLocalHistories = (histories: string[]) => {
  localStorage.setItem(SEARCH_HIS_KEY, JSON.stringify(histories))
}

/** #### 删除 历史关键字 ---*/
export const removeLocalHistories = () => {
  localStorage.removeItem(SEARCH_HIS_KEY)
}
