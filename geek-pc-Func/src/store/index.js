import React from "react"
// https://stackoverflow.com/questions/64770762/mobx-since-strict-mode-is-enabled-changing-observed-observable-values-withou
import { configure } from "mobx"
import LoginStore from './login.Store'
import UserStore from './user.Store'
import ChannelStore from './channel.Store'

configure({
  enforceActions: "never",
})

class RootStore {
  // 组合模块
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new ChannelStore()
  }
}

const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)