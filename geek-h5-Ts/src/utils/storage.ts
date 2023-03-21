// 用户 Token 的本地缓存键名
const TOKEN_KEY = 'geek-itcast-21'
const CHANNEL_KEY = 'geek-itcast-21-channels'
const SEARCH_HIS_KEY = 'geek-itast-21-search'

type Token = {
  token: string
  refresh_token: string
}
// type Channels = number[]  //数字类型的数组
// type Channels = object[]
type Channels = {
  id: number
  name: string
}[]
/**
 * 将 Token 信息存入缓存
 * @param {Object} tokenInfo 从后端获取到的 Token 信息
 */
export const setTokenInfo = (tokenInfo: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))
}

/**
 * 从本地缓存中获取 Token 信息
 */
export const getTokenInfo = (): Token => {
  // JSON.parse() 参数1必须是string类型
  // localStorage.getItem() 获取到的结果类型  string | null
  // 大白话，听哥的，这个地方就是string
  // 非空断言
  // return JSON.parse(localStorage.getItem(TOKEN_KEY) as string) || {}
  return JSON.parse(localStorage.getItem(TOKEN_KEY)!) || {} // 这里不会为 null,  如果是null 返回的是 {}  |  断言的使用 | QA
}

/**
 * 删除本地缓存中的 Token 信息
 */
export const removeTokenInfo = () => {
  // console.log(213)
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 判断本地缓存中是否存在 Token 信息
 */
export const hasToken = () => { // 会有类型推断：const hasToken: () => boolean   返回的就是布尔值
  return !!getTokenInfo().token
}

/**
 * 保存频道数据到本地
 * @param {*} channels
 */
export const setLocalChannels = (channels: Channels) => {
  localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
}

/**
 * 获取本地的频道数据，，，，，，，如果没有数据，不要默认为空数组
 * @returns
 */
export const getLocalChannels = (): Channels => {
  return JSON.parse(localStorage.getItem(CHANNEL_KEY)!) // 断言， 返回的不是空
}

/**
 * 删除本地的频道数据
 */
export const removeLocalChannels = () => {
  localStorage.removeItem(CHANNEL_KEY)
}

/**
 * 从缓存获取搜索历史关键字
 */
export const getLocalHistories = (): string[] => {
  return JSON.parse(localStorage.getItem(SEARCH_HIS_KEY)!) || []
}

/**
 * 将搜索历史关键字存入本地缓存
 * @param {Array} histories
 */
export const setLocalHistories = (histories: string[]) => {
  localStorage.setItem(SEARCH_HIS_KEY, JSON.stringify(histories))
}

/**
 * 删除本地缓存中的搜索历史关键字
 */
export const removeLocalHistories = () => {
  localStorage.removeItem(SEARCH_HIS_KEY)
}
