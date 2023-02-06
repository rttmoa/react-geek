import { Component } from 'react'
import { Link } from 'react-router-dom'
import {EditOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import {Card, Breadcrumb, Form, Button, Radio, DatePicker, Table, Tag, Space, Modal, message} from 'antd'
import { ArticleStatus, articleStatus } from 'api/constants';
import { getArticles, delArticle } from 'api/article';
import Channel from 'components/Channel'
import defaultImage from 'assets/error.png'
// import request from 'utils/request'
import styles from './index.module.scss'

const { RangePicker } = DatePicker
const { confirm } = Modal






/**
 * 实现功能:
 * 1.文章筛选功能
 * 2.文章编辑功能
 * 3.文章删除功能
 * 4.渲染 ul=>li 渲染接口获取到的数据 封面	标题	状态	发布时间	阅读数	评论数	点赞数	操作
 * 5.文章分页功能
 * 6.getList() 函数复用
 * 7.Form.Item组件的说明、https://ant.design/components/form-cn/#Form.Item
 * 8.筛选中的this.queryParams = queryParams
 * 9.分页中的this.page = page
 */

class ArticleList extends Component {
  state = {
    articles: {} // 文章列表数据
  }

  /**
    {
      * id: '8217',
      * title: '深入理解Java虚拟机06--虚拟机字节码执行引擎' ,
      *  status: 2 ,
      * comment_count: 0,
      * pubdate: '2019-03-11 09:00:00' ,
      * "cover":{"type":3,"images":["http://geek.itheima.net/resources/images/80.jpg","http://geek.itheima.net/resources/images/79.jpg","http://geek.itheima.net/resources/images/47.jpg"]},
      * like_count: 0 ,
      * read_count: 0 
    }
   */
  // 表格的配置项---- 渲染 ul=>li的结构
  columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: data => {
        // if( data.cover.type === 0 ){return <img src={defaultImage} alt="" style={{width: 200,height: 150, objectFit: 'cover' } }  />}
        return (
          //  <div>我是封面</div>  /* 可以自己定义任意数据 */
          <img
            src={data.images[0] || defaultImage}
            alt="213"
            width={200}
            height={150}
          />
        )
      }
    },
    {
      title: '标题',
      dataIndex: 'title'   
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status =>  {

        // 多种处理方式
        const tagObj = articleStatus[status]
        return <Tag color={tagObj.color}>{tagObj.text}</Tag>
        
        // const obj = articleStatus.find((item) => item.id === status)
        // // console.log(obj)   在这里 用 map  返回的是 true 和 false
        // return <Tag color={obj.color}>{obj.name}</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          // Space 组件 让两个按钮 紧靠着
          <Space> 
            {/* 编辑按钮 */}
            {/* <Link to={`/home/publish?id=${data.id}`}> </Link> */}
               
            {/* to="/home/publish/8192" */}
            <Link to={`/home/publish/${data.id}`}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              ></Button>
            </Link>
            {/* 删除按钮 */}
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {  this.deleteArticle(data.id)   }}
            ></Button>
          </Space>
        )
      }
    }
  ]

  // 删除文章
  // 1. 给删除按钮绑定点击事件
  // 2. 在点击事件中，拿到当前要删除项的 id ，然后，弹窗让用户确认是否删除
  // 3. 用户点击取消，不作任何处理
  // 4. 用户点击确认，发送请求，删除该 id 对应的数据
  // 5. 重新调用获取文章列表数据的接口，获取删除后的数据
  deleteArticle = id => {
    // console.log(id)
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该文章, 是否继续?',
      // 注意：此处，需要使用箭头函数，否则，会有 this 指向的问题
      onOk: async () => {
        // console.log(data)
        try {
        // 4. 用户点击确认，发送请求，删除该 id 对应的数据
        // const res = await request.delete(`/mp/articles/${id}`)
        const res = await delArticle(id)

          if (res.message === 'OK') {
            message.success('删除成功', 0.6)

            this.getList({
              ...this.queryParams,
              
              page: this.page || 1,  
            })
          }
        } catch (e) {throw new Error(e)}
      }
      // onCancel() {
      //   // 取消按钮的回调
      //   console.log('Cancel')
      // }
    })
  }


  componentDidMount() {
    this.getArticles()
  }

  // 获取文章列表数据
  async getArticles() {
    this.getList()
  }

  // 筛选
  query = async values => {
    // console.log('Form value', values)
    
    // return

    // 表单中拿到的数据，无法直接作为接口的参数来使用，所以，需要对数据做处理
    const { status, Channel_id, date } = values;

    const queryParams = {}

    if (status !== -1) { queryParams.status = status }

    // 处理频道
    // console.log('Channel_id', !!Channel_id) // 如果未选择就是undefined, 为false
    if (Channel_id) { queryParams.Channel_id = Channel_id }
    
    // 处理日期
    if (date) {
      const begin_pubdate = date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const end_pubdate = date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
      queryParams.begin_pubdate = begin_pubdate
      queryParams.end_pubdate = end_pubdate
    }
    // console.log(queryParams) //{status: 2, Channel_id: 4, begin_pubdate: '2022-06-07 00:00:00', end_pubdate: '2022-07-20 23:59:59'}
    // return;

    // 将筛选数据，存储到 this 中、挂载到this下
    this.queryParams = queryParams

    // 调用封装好的方法
    this.getList(queryParams)
  }

  // 创建一个方法，用来封装 【获取文章列表数据功能】
  async getList(params) {
    params = params || {}
    // console.log('getList-> params', params)
    // const res = await request.get('/mp/articles', { params })

    const res = await getArticles(params)
    this.setState({ articles: res.data })
  }

  // 切换分页
  changePage = (page, pageSize) => { 
    // 两种情况：
    //  1 如果没有筛选数据，直接传入 page 和 pageSize 即可
    //  2 如果有筛选数据，分页应该是基于筛选后的数据，进行分页，此时，就得拿到表单中的筛选数据，再传入 page 和 pageSize 才可以了
    // 所以，为了代码的实现，我们直接不管什么情况下，都拿到 表单的筛选数据，
    // 只不过，如果没有筛选数据，拿到一个空对象，有筛选数据，就拿到筛选数据
 
    // console.log(page, pageSize)

    // 1 拿到表单中的筛选数据
    // console.log('表单中的筛选数据', this.queryParams)

    // 2 组装请求参数
    const params = {
      ...this.queryParams || {},
      page,
      per_page: pageSize
    }

    // 将当前页存储到 this 中，这样，其他方法中就可以拿到 page
    this.page = page;
    // console.log(123, this) // this中挂载page属性
    
    // return;

    // 3 发请求拿数据
    this.getList(params)
  }
  





  render() {

    const {  articles: { page, per_page, results, total_count } } = this.state
    // console.log(results) // 结果是分页及每页页数的结果
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>
          }
          style={{ marginBottom: 2 }}
        > 
          <Form
            initialValues={{  status: -1  }}
            onFinish={this.query}
          >
            {/* Form.Item取的是里面的 value */}
            <Form.Item label="状态" name="status">
              <Radio.Group>
                {ArticleStatus.map((item)=>{
                    return <Radio key={item.id} value={item.value}>{item.name}</Radio>
                })}
                {/* 
                  <Radio value={-1}>全部</Radio>
                  <Radio value={0}>草稿</Radio>
                  <Radio value={1}>待审核</Radio>
                  <Radio value={2}>审核通过</Radio>
                  <Radio value={3}>审核失败</Radio>
                */}
              </Radio.Group>
            </Form.Item>

            <Form.Item label="频道" name="Channel_id">
              <Channel width={200} />{/* 组件封装-Channel */}
            </Form.Item>

            <Form.Item label="日期" name="date">
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">筛选</Button>
            </Form.Item>
          </Form>
        </Card>

        <div>两个card分隔</div>

        <Card title={`根据筛选条件共查询到 ${total_count} 条结果：`}>
          {/* rowKey 表示使用数据源中的哪一个属性来作为 key 值 */}
          {/* 也就是：使用 results 数组中的每一项（{ id, title, ... }） 中的 id 这一项来作为 key 值 */}
          <Table
            columns={this.columns}
            dataSource={results}  ////发请求 获取数据 对应的columns
            rowKey="id"
            pagination={{
              position: ['bottomCenter'],///--------------指定分页显示的位置
              current: page,
              pageSize: per_page,
              total: total_count, //---------------------- 每页大小 或者 页码 改变时，触发的事件
              onChange: this.changePage
            }}
          />
        </Card>
      </div>
    )
  }
}

export default ArticleList