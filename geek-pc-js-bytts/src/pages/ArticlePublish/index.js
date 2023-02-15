import { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import {Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from 'utils/request' //------------request 模块发请求
import Channel from 'components/Channel'  //------选择文章频道
import 'react-quill/dist/quill.snow.css'
import styles from './index.module.scss'
//****  styles  -->    {root: 'ArticlePublish_root__IpDLP'}

/**功能: 
 * 1.文章发布功能
 * 2.存入草稿功能
 * 3.文章编辑功能(isEdit)
 * 4.父子组件传值(Channel)
 * 5.图片上传功能(控制显示图片数量)
 */

class ArticlePublish extends Component {
  state = {
    article: {  }, // --------------------文章详情数据
    selectedValue: 1, // ---------------封面图片的选中值
    fileList: [  ],  // ----------------图片上传对应图片列表
    // { url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' }
    // isEdit: typeof this.props.match.params.id !== 'undefined'
    // id: this.props.match.params.id
  }
  // 通过 判断 id 是否为 undefined 来区分是否有id
  isEdit = typeof this.props.match.params.id !== 'undefined'; // 是否为编辑( 内容管理中- 编辑文章- 发布文章中渲染拿到的数据 )
  formRef = createRef(); // --------------------1. 创建一个 ref 对象

  async componentDidMount() {
    // console.log(this.isEdit)//----------------- 编辑文章时- 为true
    // console.log(this.props)//-------------------这里可以获取到 pathname 的值
    // if (this.isEdit) { this.getArticleById() }
    // 简化：
    this.isEdit && this.getArticleById() //如果isEdit为true、 就渲染getArticleById函数
  }

  // componentWillUnmount() {  console.log("组件销毁了")  }

  async getArticleById() {
    // console.log('this.props.match Is', this.props.match)
    //****  this.props.match  -->    {path: '/home/publish/:id', url: '/home/publish/8217', isExact: true, params: {id: '8217'}}
    
    // 从 路由信息 中获取到 路由参数 id 的值
    const id = this.props.match.params.id
    // console.log('id Is', id)  //--------------------id: 8217
    const res = await request.get(`/mp/articles/${id}`)
    // console.log("res Is", res) //****  res  -->   {channel_id, content, id, pub_date, title}
    // 1. 从文章详情接口返回的数据中，拿到 `cover` 数据（ 这里面有我们需要的图片地址 ）
    const { cover } = res.data
    // console.log('cover Is', cover) 
    const { images, type } = cover
    // 2. 利用数据格式的转换，来将 cover 中的数据，转化为 fileList 需要的数据格式
    // images -> ["http://geek.itheima.net/resources/images/94.jpg"]
    // type: 1
    // fileList -> [ { url } ]
    const fileList = images.map(url => {
      // console.log(url)//-------返回的是 三个地址  http://geek.itheima.net/resources/images/48.jpg
      return {
        url  
      }
    })
    // console.log(fileList)// ---------------------- [{0: {url: '', uid:''}, 1: {…}, 2: {…}]
    
    // 3 使用转化后的数据，更新为 fileList 状态
    this.setState({
      article: {
        ...res.data,
        // 因为 Form.Item 中需要这个数据，所以，此处直接将 type 添加给 article
        type
      },
      // 已上传图片的数据
      fileList,

      // 注意：通过接口拿到 type（ 也就是图片可选择数量 ），用它来更新 selectedValue 状态
      //      这样，才能让 Upload 中 maxCount 是正确的！！！
      selectedValue: type
    })

    // instance 实例
    const formInstance = this.formRef.current
    formInstance.setFieldsValue({
      ...res.data,
      // 因为 Form.Item 中需要这个数据，所以，此处直接将 type 添加给 article
      type
    })
  }

  // 表单提交 Card卡片组件中From表单中提交信息
  // 1. 直接在 Form 表单的 onFinish 事件处理程序中，来获取到表单中的所有数据
  // 2. 将拿到的表单数据，按照接口的要求，来进行数据格式化
  // 3. 将格式化后的数据，传递给接口
  // 4. 根据接口返回的数据，做出相应的处理
  onFinish = values => {
    //****  values  -->    {title: '测试标题1', Channel_id: 1, type: 1, content: '<p>文章内容</p>'}
    this.save(values, false)///--------这个false表示不是草稿
  }

  // ?处理封面上传图片 上传一张、三张、无 & 控制组件的显示和隐藏
  // 1. 给 Radio 绑定 `onChange` 事件
  // 2. 在 onChange 中，拿到当前选中项的值
  // 3. 根据不同的选中项进行不同的处理
  //  3.1 如果是单图（1），要展示上传图片组件，此时，只能上传一张图片
  //  3.2 如果是三图（3），要展示上传图片组件，此时，可以上传三张图片
  //  3.3 如果是无图（0），不展示上传图片组件
  // 因为这个数据，要控制页面内容的展示和隐藏，所以，此处，我们将选中值添加为组件的状态
  // 将来，通过状态来控制页面中内容的展示或隐藏
  // <Radio.Group onChange={this.changeImageType}>  <Radio value={1}>单图</Radio>  </Radio.Group>
  changeImageType = e => {
    //****  e  -->    checked、onFocus、onBlur、onKeyDown、onKeyUp、type、value: 0, 1, 3
    const selectedValue = e.target.value  
    this.setState({  
      selectedValue,
      fileList: [] //--------------------------这里是切换 三图到无图 删除图片
    })
  }

  // 上传图片的方法的参数，是一个对象(data)  改变fileList数组
  uploadImages = data => {
    // console.log('Upload onChange Is', data)
    //****  data  -->    {file: {response: {data: {url: 'http://geek.itheima.net/uploads/1654784943605.jpg'}, message: 'OK'}},
    //                   fileList: [ 0: {response: {data: {url: '接口'}, message: 'OK'}, 1:{response }, 2: {response }]}}
    // data.file.status 的状态为三种: 1.uploading、2.done、3.removed

    // if (data.file.status === 'removed') {  只需要将当前图片，从 fileList 中移除即可  }
    // else{ 注意：onChange 只触发一次的问题，需要不管什么情况下，都要更新 fileList 
    // this.setState({  fileList: [...data.fileList]  })}
   
    // const status = data.file.status
    // if (status === 'done') {
    //   const urls = data.fileList.map(item => {
    //     return item.response.data.url
    //   })
    //   console.log('上传图片的地址：', urls)//****  urls  -->    ['http://geek.itheima.net/uploads/1654785859254.jpg']
    // }
    this.setState({
      fileList: [...data.fileList]  //----完成时有 response: {data: {…}, message: 'OK'} 、 status: "done" 其他为加载中
    })
  }
  // uploadImages = (...rest) => {  console.log(rest)--------> [0: {file: {…}, fileList: Array(1)}]  }



  // 存入草稿---表单校验--this.save(value, true)
  saveDraft = async () => {
    // 1. 给存入草稿按钮绑定点击事件
    // 2. 在事件中，拿到表单中的数据
    // 通过 ref 来获取表单中所有元素的值
    // 注意： validateFields() 方法，会触发 Form 表单的校验
    //      如果校验成功了，可以直接通过返回值 values 拿到表单中的数据
    //      如果校验失败了，因为页面中直接在 Form 中已经提示了错误信息，所以，代码中不用做任何处理
    try {
      const values = await this.formRef.current.validateFields()   ////validateFields 触发表单验证 这个的一个Promise 得用异步
      // 直接调用封装好的方法
      this.save(values, true)   ///这个true 表示 是草稿
    } catch (e) { console.log( e )  }  ///channel_id: undefined
  }

  // 封装保存数据的方法 - 用来实现文章的编辑、发布以及相应的存入草稿功能
  save = async (values, isDraft) => {
    console.log('this.props Is', this.props)
    const id = this.props.match.params.id //------获取地址栏中的编辑 ID
    const { type, ...restValues } = values
    const { fileList } = this.state
    const images = fileList.map(item => {
      if (item.url) {
        return item.url
      }
      return item.response.data.url
    })
    const cover = { 
      type: type,
      images //-------------获取图片的URL地址
    }
    const data = {
      ...restValues,
      cover
    }

    let url = ''
    let msg = ''


// 判断isEdit是否为true & isDraft是否为true
    if (this.isEdit) {
// 编辑时
      if (isDraft) {
        // 草稿
        url = `/mp/articles/${id}?draft=true`
        msg = '存入草稿成功'
      } else {
        // 非草稿
        url = `/mp/articles/${id}`
        msg = '修改成功'
      }
      const res = await request.put(url, data)

      if (res.data.message.toLowerCase() === 'ok') {
        message.success(msg, 1)
      }else{console.log('添加失败')}
    } else {

// 发布时
      if (isDraft) {
        // 草稿
        url = '/mp/articles?draft=true'
        msg = '存入草稿成功'
      } else {
        url = '/mp/articles'
        msg = '发布成功'
      }

      // 添加文章接口
      const res = await request.post(url, data)
      if (res.data.message.toLowerCase() === 'ok') {
          message.success(msg, 1)
          this.props.history.push('/home/list') //------重定向
      }
    }
  }




  /**
   * render 渲染 组件
   */
  render() {
    //****  selectedValue, fileList 为渲染上传图片组件 Upload   
    const { selectedValue, fileList } = this.state //{ article: {}, fileList: [], selectedValue: 1 }   值selectedValue=0, 1, 3
    // console.log(selectedValue, fileList)

    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb separator=">">   {/* 面包屑 */}
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item>
                {this.isEdit ? '修改文章' : '发布文章'}  {/* 当编辑文章时, isEdit为true, Item是修改文章 */}
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >

          {/* 标题、频道、封面、内容、按钮是一个 Form表单  */}
          {/* span 表示 横向 占用了 4 格，一共 24 格 */}
          <Form
            ref={this.formRef}
            labelCol={{ span: 4 }}
            initialValues={{ type: 1, content: '' }}
            onFinish={this.onFinish}    //-----------------------------表单提交事件 获取表单数据 完成时的操作
          >

            {/* <Form.Item hidden name="id">
              <Input type="hidden" />123
            </Form.Item> */}

            <Form.Item   
              label="标题"
              name="title" //--------------------------------------------这个name 是接口中参数id
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>

            {/*//-------------------------------------------------------------------渲染 Channel 组件 */}
            <Form.Item label="频道" name="Channel_id" rules={[{ required: true, message: '请选择文章频道' }]}>
              <Channel width={400} />  
            </Form.Item>

            <Form.Item label="封面">
              <Form.Item name="type">
                <Radio.Group onChange={this.changeImageType}>
                  <Radio value={1}>单图</Radio>
                  <Radio value={3}>三图</Radio>
                  <Radio value={0}>无图</Radio>
                  {/* <Radio value={-1}>自动</Radio> */}
                </Radio.Group>
              </Form.Item>

              {/* 上传图片组件 */}
              {/* 如果 selectedValue 不等于 0  就把Upload上传组件渲染出来  |  等于0为 无图  */}
              {selectedValue !== 0 && (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList
                  maxCount={selectedValue}
                  action="http://geek.itheima.net/v1_0/upload"
                  onChange={this.uploadImages}
                  fileList={fileList}
                >
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined /> {/*------------------------------ PlusOutlined: css样式 一个 + 号 */}
                  </div>
                </Upload>
              )}
            </Form.Item>

            <Form.Item
              label="内容"
              name="content"
              rules={ [{ required: true, message: '请输入文章内容' }] }    /*这里是 数组 里面的对象 */
            >
              {/* 富文本编辑器 */}
              <ReactQuill
                className="publish-quill"
                theme="snow"
                placeholder="请输入文章内容"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  {this.isEdit ? '修改文章' : '发布文章'}
                </Button>
                <Button size="large" onClick={this.saveDraft}>
                  存入草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default ArticlePublish
