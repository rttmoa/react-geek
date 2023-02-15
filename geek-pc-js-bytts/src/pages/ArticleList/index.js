import { Component } from 'react'
import { Link } from 'react-router-dom'
import {EditOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import {Card, Breadcrumb, Form, Button, Radio, DatePicker, Table, Tag, Space, Modal, message} from 'antd'
import { ArticleStatus, articleStatus } from 'api/constants'
import Channel from 'components/Channel'
// import  from 'assets/error.png'
import request from 'utils/request'
import styles from './index.module.scss'

const { RangePicker } = DatePicker
const { confirm } = Modal






/**实现功能:
 * 1.文章筛选功能
 * 2.文章编辑功能
 * 3.文章删除功能
 * 4.渲染 ul=>li 渲染接口获取到的数据 封面	标题	状态	发布时间	阅读数	评论数	点赞数	操作
 * 5.文章分页功能
 */

class ArticleList extends Component {
  state = {
    articles: {  }  
  }

  // {"id" ,"title" ,"status" ,"comment_count":0,"pubdate" ,"cover":{"type":3,"images":["http://geek.itheima.net/resources/images/80.jpg","http://geek.itheima.net/resources/images/79.jpg","http://geek.itheima.net/resources/images/47.jpg"]},"like_count" ,"read_count" }
  // 表格的配置项---- 渲染 ul=>li的结构
  columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: data => {
        return (
          <img
            src={data.images[0]}
            alt=""
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
        const tagObj = articleStatus[status]
        return <Tag color={tagObj.color}>{tagObj.text}</Tag>
        // const obj = articleStatus.find((item) => item.id === status)
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
          <Space>  
            {/* 编辑按钮 */}
            {/* <Link to={`/home/publish?id=${data.id}`}>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              ></Button>
            </Link> */}

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
              onClick={() => {
                this.deleteArticle(data.id)  
              }}
            ></Button>
          </Space>
        )
      }
    }
  ]

  // 删除文章
  deleteArticle = id => {
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将永久删除该文章, 是否继续?',
      // 注意：此处，需要使用箭头函数，否则，会有 this 指向的问题
      onOk: async () => {
        // console.log(data)
        // try {
        // 4. 用户点击确认，发送请求，删除该 id 对应的数据
        const res = await request.delete(`/mp/articles/${id}`)
        // console.log('删除文章', res)
        if (res.message === 'OK') {
          // 提供删除成功
          message.success('删除成功', 0.6)
          // 5. 重新调用获取文章列表数据的接口，获取删除后的数据
          this.getList({
            ...this.queryParams,
            // 给 page 设置默认值，也就是，如果没有切换分页，就获取第一页的数据
            page: this.page || 1
          })
        }
        // } catch (e) {}
      }
      // onCancel() {
      //   // 取消按钮的回调
      //   console.log('Cancel')
      // }
    })
  }


  // 在这 发起请求
  componentDidMount() {
    this.getArticles()
  }

  // 获取文章列表数据
  async getArticles() {
    this.getList()
  }

  // Form 的 提交事件   ==>  【筛选功能】
  query = async values => {
    console.log('表单提交 query的值 Is', values)
    // 表单中拿到的数据，无法直接作为接口的参数来使用，所以，需要对数据做处理
    const { status, Channel_id, date } = values
    const queryParams = {}

    // 先处理状态：不传为全部，全部这一项的值为 -1
    if (status !== -1) {
      queryParams.status = status
    }

    // 处理频道
    if (Channel_id) {
      queryParams.Channel_id = Channel_id
    }
    
    // 处理日期
    if (date) {
      // begin_pubdate
      const begin_pubdate = date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
      // end_pubdate
      const end_pubdate = date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
      queryParams.begin_pubdate = begin_pubdate
      queryParams.end_pubdate = end_pubdate
    }
    // console.log(queryParams) //{status: 2, Channel_id: 4, begin_pubdate: '2022-06-07 00:00:00', end_pubdate: '2022-07-20 23:59:59'}
    // 将筛选数据，存储到 this 中
    this.queryParams = queryParams

    // 调用封装好的方法
    this.getList(queryParams)
  }

  // 创建一个方法，用来封装 【获取文章列表数据功能】
  async getList(params) {
    // 参数默认值的原始写法 & 参数的默认值：params = {}
    params = params || {}
    const res = await request.get('/mp/articles', {
      params
    })
    this.setState({
      articles: res.data
    })
  }

  // 切换分页
  // 两种情况：
  //  1 如果没有筛选数据，直接传入 page 和 pageSize 即可
  //  2 如果有筛选数据，分页应该是基于筛选后的数据，进行分页，此时，就得拿到表单中的筛选数据，再传入 page 和 pageSize 才可以了
  // 所以，为了代码的实现，我们直接不管什么情况下，都拿到 表单的筛选数据，
  // 只不过，如果没有筛选数据，拿到一个空对象，有筛选数据，就拿到筛选数据
  changePage = (page, pageSize) => {
    // console.log(page, pageSize)
    // 1 拿到表单中的筛选数据
    // console.log('表单中的筛选数据', this.queryParams)
    // 2 组装请求参数
    const params = {
      ...this.queryParams,
      page,
      per_page: pageSize
    }

    // 将当前页存储到 this 中，这样，其他方法中就可以拿到 page
    this.page = page

    // 3 发请求拿数据
    this.getList(params)
  }
  





  render() {

    // const { total_count, results, per_page, page } = this.state.articles
    const {  articles: { page, per_page, results, total_count } } = this.state
    // console.log(results)
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
          style={{ marginBottom: 20 }}
        >

          {/* 状态、频道、日期组件 */}
          <Form
            initialValues={{   
              status: -1
            }}
            onFinish={this.query}  /* onFinish 获取 单选框 值 */
          >
            {/* 状态的值为 -1, 0, 1, 2, 3 */}
            <Form.Item label="状态" name="status">
              <Radio.Group>

                {
                  ArticleStatus.map((item)=>{
                    // console.log(item);
                    return <Radio key={item.id} value={item.value}>{item.name}</Radio>
                  })
                }

                {/* <Radio value={-1}>全部</Radio>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>待审核</Radio>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核失败</Radio> */}

              </Radio.Group>
            </Form.Item>

            <Form.Item label="频道" name="Channel_id">
              <Channel width={200} />
            </Form.Item>

            <Form.Item label="日期" name="date">
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">筛选</Button>
            </Form.Item>
          </Form>
        </Card>



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