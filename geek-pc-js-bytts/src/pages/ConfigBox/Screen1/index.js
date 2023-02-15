import React, { Component } from "react";
import { Card, Col, Row, Space, Button, Table, message, InputNumber, Input, } from "antd";
import { getNullBoxData } from 'api/bindbox'
import styles from  './index.module.scss'



/**--- 左右两个箱子、需要发两个请求、每个箱子根据每个请求位置去发请求、获取到数据并数据高亮问题 ---**/
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstScreen: [],
      SecondScreen: [],
      setFirstCalssKey: null,
    };
  }
  componentDidMount(){
    this.get()
  }
  async get(){
    await this.getData()
    // this.interval = setInterval(() => this.getData(), 2000);
  }
  async getData () {
    // 发请求获取数据
    const getFirst = await getNullBoxData('1001')
    // console.log(getFirst)
    const getSecond = await getNullBoxData('1002')
    // console.log(getSecond)
    const newFirstData = getFirst.message.map((item, index) => {
      return {
        key: ++index,
        ...item
      }
    })
    const setFirstKey = newFirstData.filter(item => {
      // console.log(item)
      return item.highlight__c === 'highlight'
    })[0]
    // console.log(setFirstKey)
    const newSecondData = getSecond.message.map((item, index) => {
      return {
        key: ++index,
        ...item
      }
    })
    this.setState({ 
      FirstScreen: newFirstData,
      SecondScreen: newSecondData,
      setFirstCalssKey: setFirstKey?.key,
    });
  }
  componentWillUnmount() {
    // clearInterval(this.interval);
  }





  render() {
    const { FirstScreen, SecondScreen } = this.state;
    // console.log(FirstScreen)
    // console.log(SecondScreen)
    return (
      <div className={styles.root}>
        <Row gutter={10} justify="space-between">
          <Col span={12}>
            <Card title="位置二" bordered={false}>
                Card content
            </Card> 
          </Col>

          {/* 右侧箱子 */}
          <Col span={12}>
            <Card title="位置一" bordered={false}>
              <Table
                rowSelection={{
                    type: 'checkbox',
                    // ...,rowSelection
                    // onChange: (selectedRowKeys, selectedRows) => {return this.selectRowData(selectedRowKeys, selectedRows)}
                }}
                columns={this.FirstColumns}
                // bordered={false} // 是否展示外边框和列边框
                dataSource={FirstScreen}
                rowClassName={this.setFirstClassName}
                pagination={false}
                scroll={{
                    y: 820,
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  FirstColumns = [
    {
      title: '空箱号',
      dataIndex: 'remarks__c',
      width: 100
    },
    {
      title: '项目号',
      dataIndex: 'project__c',
      width: 140,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '柜号',
      dataIndex: 'cupboard__c',
      // fixed: 'left',
      width: 60,
    },
    {
      title: '物料名称',
      dataIndex: 'material__c',
      width: 150,
    },
    {
      title: '需求数量',
      dataIndex: 'demand__c',
      width: 150,
    },
    {
      title: '装入数量',
      dataIndex: 'library__c',
      width: 150,
    },
   
  ];
  setFirstClassName=(record,index)=>{//record代表表格行的内容，index代表行索引
    // console.log(record)
    // console.log('this.state.setFirstCalssKey', this.state.setFirstCalssKey)
    //判断索引相等时添加行的高亮样式
    return record.key === this.state.setFirstCalssKey ? `l-table-row-active` : ""; 
    // return true
  }
}

export default index;
