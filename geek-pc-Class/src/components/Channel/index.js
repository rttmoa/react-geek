import { Component } from 'react'
import { Select } from 'antd'
import request from 'utils/request'
const { Option } = Select


/**
 * 内容管理中 选择文章频道: HTML、开发者咨询、C++、CSS......
 */
class Channel extends Component {
  state = {
    channels: []
  }

  componentDidMount() {
    this.getChannles()
  }
  async getChannles() {
    const res = await this.GetChannels()
    this.setState({channels: res.data.channels})
  }
  GetChannels = () => {
    return request({
      methods: "get",
      url: '/channels'
    })
  }

  render() {
    const { channels } = this.state

    // console.log(this.props) 

    // 接受 父组件 传递过来的 onChange 和 value 事件
    const { value, onChange, width } = this.props;  

    return (
      <Select
        value={value}
        onChange={onChange}
        placeholder = "请您选择文章频道"
        style={{ width }}
      >
        {channels.map(item => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default Channel
