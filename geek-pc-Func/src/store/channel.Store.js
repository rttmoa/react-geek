// 登录模块
import { makeAutoObservable } from "mobx"
import { http } from '@/utils'

class ChannelStore {
  channels = []
  constructor() {
    makeAutoObservable(this)
  }
  // 获取频道列表
  getChannels = async () => {
    const res = await http.get('/channels')
    this.channels = res.data.channels
  }
}

export default ChannelStore