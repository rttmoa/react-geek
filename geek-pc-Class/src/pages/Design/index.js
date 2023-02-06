import { Component } from "react";
import styles from './index.module.scss'
import {  Radio,Card ,Row, Col } from 'antd'
import request from 'utils/request'

class Design extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            articles: { },
            id: 1,
            SelectValue: 1,
            btn: [],
            defaultVlaue: 1,
            test: '',
            like_count: '',
            pubdate: '',
            status: '',
            title: '',
            img: ''
        };
    }
    // columns = [
    //     {
    //         title: "标题",
    //         dataIndex: 'title'
    //     },
    //     {
    //         title: "封面",
    //         dataIndex: 'cover'
    //     }
    // ]


    // comment_count: 0
    // cover: {type: 0, images: Array(0)}
    // id: "8211"
    // like_count: 0
    // pubdate: "2019-03-11 09:00:00"
    // read_count: 0
    // status: 2
    // title: "迭代器和生成器"

    RadioBtn = (Event) => {
        // console.log(Event.target.value)
        // console.log(Event.target.value.status)
        this.setState({
            id: Event.target.value.id,
            title:  Event.target.value.title,
            comment_count:  Event.target.value.comment_count,
            status: Event.target.value.status,
            like_count:  Event.target.value.like_count,
            img: Event.target.value.cover.images[0]
        })
    }

    
    //获取数据
    componentDidMount() {
        this.getArtciles()
    }
    async getArtciles () {
        this.getList()
    }
    async getList(params)  {
        params = params || {}
        const res = await request.get('/mp/articles', {
            params
        })
        // console.log(res)
        this.setState({
            articles: res.data
        })
    }

   

    render() {
        // console.log(this.props)//可以拿到URL、history、location、match、
        // const {articles: { results } } = this.state
        // console.log( results )
        const gridStyle = {  width: '100%',  textAlign: 'center', height: '40%'  };

        // console.log(this.state.articles.results)
        return (
            <div className={styles.root}>
               {/* <Table
                columns={this.columns}
                dataSource={results}
                rowKey="id"
                // pagination={{
                //     width: 123,
                //     position: ['bottomLeft'],
                //     defaultCurrent: 1,
                //     current: page,
                //     pageSize: 1, //	每页条数
                //     total: total_count,
                //     showSizeChanger: false,
                //     responsive: true,
                // }}
               >
               </Table> */}
                <div className="header">
                    <Row gutter={16}>
                        <Col span={9}>
                            <Card title="产品详情" bordered={false}>
                                <Card.Grid style={gridStyle}>标题：{this.state.title}</Card.Grid>
                                <Card.Grid style={gridStyle}>ID：{this.state.id}</Card.Grid>
                                <Card.Grid style={gridStyle}>like_count：{this.state.like_count}</Card.Grid>
                                <Card.Grid style={gridStyle}>status: {this.state.status}</Card.Grid>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="产品图片内容" bordered={false}>
                                <img src={this.state.img} alt="正在加载中..."></img>
                            </Card>
                        </Col>
                    </Row>
                    
                </div>
               <div className="footer">
               
               <Radio.Group  >
                {   this.state.articles.results && 
                    this.state.articles.results.map( (val, key) => {
                            // console.log(val)
                            // return (<Button 
                            //     className="btn" 
                            //     key={val.id} 
                            //     value={val}
                            //     onClick={() => {this.btn(val)}}
                            //     // type="text"
                            //     size="large"
                            //     >BTN {key} </Button>)
                            return (
                                    <Radio.Button 
                                    onChange={this.RadioBtn} 
                                    key={key} 
                                    value={val}
                                    // defaultChecked="8208"
                                    defaultChecked={true}
                                    
                                    >第{key+1}件</Radio.Button>  
                                 
                            )
                        })
                }
                </Radio.Group> 
                
               </div>
            </div>
        );
    }
}

export default Design;