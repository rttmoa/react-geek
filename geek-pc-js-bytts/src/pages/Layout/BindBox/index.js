import React from "react";
import { Button, InputNumber, Layout, Menu, message, Table } from "antd";
import { getMesAllData, postBindBoxData } from 'api/bindbox' 



// 将选择好的数据提交到后台、选择一个空箱进行绑定所选择的原料、修改MES表中的数据、标记字段为record1,recored2...
// 选择空箱的时候、在**立库货架-容器状态表**中根据创建时间查找容器用途为空箱的一条数据、并标记容器状态为预占用
// 最后将所有的数据进行汇总、可以进行增删改
class index extends React.Component {
  state = {
    // 获取MES数据
    MesData: [
      // {    key:1,  project__c:123,      cupboard__c: 22,      material__c:222,      demand__c:222    },  
    ],
    // 绑定MES的空箱数据
    bindBoxData: [],
    // 是否显示表格
    showTable: false,
    // 是否显示立体库的列、默认为false
    SeniorLibraryColumns: false,
    isTable: false,
    // 根据路由设置标题
    setTitle: '',
  }

  componentDidMount(){
    this.getData()
  }
  async getData(){
   // 一号箱子、获取MES数据、获取已标记之外的数据 
   const res = await getMesAllData();
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

  selectRowData(selectedRowKeys, selectedRows) { 
    // console.log(selectedRows)
    this.setState({ bindBoxData: selectedRows });  
  }

  async submitData() {
    const result = this.state.bindBoxData;
    // console.log(!!result.length)
    if(!result.length){message.info('请选择Mes数据再绑定', 2); return}; 
    // console.log('path', this.props.location.pathname)
    // 将选择好的数据提交到后台、选择一个空箱进行绑定所选择的原料、修改MES表中的数据、标记字段为record1,recored2...
    try {
      const res = await postBindBoxData(result, 1);
      // console.log(res)
      // message.info('绑定空箱失败, 库中没有剩余的空箱了', 2)
      if(res.message === 'ok'){
        message.info('绑定空箱成功', 2)
        this.setState({ isTable: false});
        const res = await getMesAllData();
        const newResult = res.message.map((item, index) => {
          return {
            key: ++index,
            ...item
          }
        })
        this.setState({ MesData: newResult, bindBoxData:[], isTable: true}); 
      }
     } catch (error) {
      message.info(error, 2)
     }
   

  }

  render() {
    const { showTable, MesData, isTable } = this.state; 
    // console.log(MesData)


    return (
      <div>
        <div style={{height:'50px',backgroundColor:'#fafafa',textAlign:'center',lineHeight:'50px',fontWeight:'bold'}}>
          Mes装配计划绑定一号空箱
        </div>
        {
          isTable && (<Table
            rowSelection={{
                type: 'checkbox',
                // ...,rowSelection
                onChange: (selectedRowKeys, selectedRows) => {return this.selectRowData(selectedRowKeys, selectedRows)}
            }} 
            columns={this.columns}
            // bordered={false} // 是否展示外边框和列边框
            dataSource={MesData}
            pagination={false}
            scroll={{
                y: 820,
            }}
        /> )
        }
        <div style={{position: 'fixed', top:'970px'}}>
            <Button onClick={this.submitData.bind(this)}>绑定空箱子</Button>
            <Button style={{marginLeft: '40px'}}>查看1号空箱绑定情况</Button>
        </div>
      </div>
    );  
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
    // {
    //   title: '到货数量',
    //   dataIndex: 'arrive_number__c',
    //   width: 150,
    // },
    // {
    //   title: '打印数量', 
    //   width: 130,
    //   fixed: 'right',
    //   render: (item) => {
    //     // console.log(item)
    //     return(<InputNumber ref={this.CommonLibrarycurrentRef} min={1} max={50} defaultValue={1} onChange={(val) => item.Number = val} />)
    //   }
    // }
  ]; 

  
}

export default index;