const KEY = 'geek-itcast'



export const getTokens = () => JSON.parse(localStorage.getItem(KEY)) || {}

export const setTokens = tokens => localStorage.setItem(KEY, JSON.stringify(tokens))

export const removeTokens = () => localStorage.removeItem(KEY)

/**TODOS: 双!!: 把任意类型的值转换为布尔值    &&    单!: 表示取反 */
export const isAuth = () => !!getTokens().token;