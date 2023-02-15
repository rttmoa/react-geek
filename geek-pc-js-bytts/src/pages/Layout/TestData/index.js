import React from "react";
import { Button, InputNumber, Layout, Menu, message, Table } from "antd";
import { getMesBindBoxData } from 'api/bindbox' 
import moment from "utils/moment";
import styles from  './index.module.scss'
 


class index extends React.Component {
  state = {
    // 获取MES数据
    MesData: [],
    // 绑定MES的空箱数据
    bindBoxData: [],
    // 是否显示表格
    showTable: false,
    // 是否显示立体库的列、默认为false
    SeniorLibraryColumns: false,
    isTable: false,
    // 根据路由设置标题
    setTitle: '',
    setKey: 4,
  }
  currentRef = React.createRef()
  componentDidMount(){
     this.getData()
  }
  async getData(){
   
   await this.get() 
   this.interval = setInterval(() => this.get(), 2000);
  }
  async get(){
    const res = await getMesBindBoxData();
    // console.log('绑定的空箱数据为', res) 
    const newResult = res.message.map((item, index) => {
        return{
          key: ++index,
          ...item,
        }
      })
    this.setState({
      MesData: newResult,
      isTable: true
    }); 
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  selectRowData(selectedRowKeys, selectedRows) { 
    // console.log(selectedRows)
    this.setState({ bindBoxData: selectedRows });  
  }

  async submitData() {
    // 将所选择的物料去库中查找、显示百分比，哪些有，哪些没有 
    // 项目号、物料代码、物料名称、规格型号都相同才行、   合并后到库中查找，因为是Mes的数据，所以带上id，到后面可以查出箱号
    // 如果有相同的数据、材料数量进行相加
    // 将所有选择的箱子提交到后台去处理

    // 提交后到后台进行查找、返回来哪有有哪些没有的
    // 将原料和空箱写入到WCS出库任务中、进行出库，开始配餐
  }

  render() {
    const { showTable, MesData, isTable } = this.state; 
    console.log(MesData)


    return (
      <div className={styles.root}>
        <div style={{height:'50px',backgroundColor:'#fafafa',textAlign:'center',lineHeight:'50px',fontWeight:'bold'}}>
            <h2> 测试高亮效果</h2>
        </div>
        {
          isTable && (<Table
            rowSelection={{
                type: 'checkbox',
                // ...,rowSelection
                onChange: (selectedRowKeys, selectedRows) => {return this.selectRowData(selectedRowKeys, selectedRows)}
            }} 
            columns={this.columns}
            dataSource={MesData} 
            rowClassName={this.setClassName}
            pagination={false}
            scroll={{
                y: 820,
            }}
        /> )
        }
        <div style={{position: 'fixed', top:'970px'}}>
            <Button onClick={this.submitData.bind(this)}>查找库中物料进行配餐</Button>
            {/* <Button style={{marginLeft: '40px'}}>查看1号空箱绑定情况</Button> */}
        </div>
      </div>
    );  
  }

  setClassName=(record,index)=>{//record代表表格行的内容，index代表行索引
    // console.log(record)
    //判断索引相等时添加行的高亮样式
    return record.key === this.state.setKey ? `l-table-row-active` : ""; 
    // return true
  }
  

  // 普通库列
  columns = [ 
    {
      title: '项目号',
      dataIndex: 'project__c',
      width: 140,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '柜子号',
      dataIndex: 'cupboard__c',
      // fixed: 'left',
      width: 150,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '物料名称',
      dataIndex: 'material__c',
      width: 150,
    },
    {
      title: '材料数量',
      dataIndex: 'demand__c',
      width: 150,
    },
    {
      title: '箱号',
      dataIndex: 'remarks__c',
      width: 140,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '绑定时间',
      dataIndex: 'bind_box_time__c',
      width: 140,
      render: (text) => <strong>{moment(text).format('YYYY-MM-DD HH:mm')}</strong>
    }, 
  ]; 

  
}

export default index;