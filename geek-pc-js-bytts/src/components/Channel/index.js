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
    const res = await request.get('/channels')
    //****  res  -->    channels: (25) [0: {id: 0, name: '推荐'}, 1: {id: 1, name: 'html'}, ........ ]
    this.setState({
      channels: res.data.channels
    })
  }

  render() {
    // this.state-->
    //刷新时渲染三次 分别是: {channels: Array(0)}、{channels: Array(25)}、{channels: Array(25)}
    //修改代码后 渲染两次: {channels: Array(0)}、{channels: Array(25)}
    // console.log(this.state)
    const { channels } = this.state

    // console.log(this.props) 这个this.props接收 ArticleList 和 ArticlePublish 的属性值

    // 接受 父组件 传递过来的 onChange 和 value 事件
    const { value, onChange, width } = this.props; //this.props={width: 200, value: undefined, id: 'Channel_id', onChange: ƒ}

    return (
      // 选择完频道 把Select中选择的值 传递给 父组件
      <Select
        value={value}//----给 父组件传的值 选择频道之后 {width: 200, value: 2, id: 'Channel_id', onChange: ƒ} 传递给父组件
        onChange={onChange}
        placeholder = "请您选择文章频道!"
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
