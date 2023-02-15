import React from "react";
import history from "utils/history";
import {  AppstoreOutlined,  CloudOutlined,  } from "@ant-design/icons";
import { Button, InputNumber, Layout, Menu, message,Table } from "antd";
import { getCommonLibrary, getSeniorLibrary } from "api/print";

const { Header, Content, Footer, Sider } = Layout;


const menu = [
    {key: 1, icon: React.createElement(CloudOutlined), label: '立体库'},
    {key: 2, icon: React.createElement(AppstoreOutlined), label: '普通库'},
];
 
 
 

const orgdata = [
  // {uu: '普通B1',uname: 'A.001.002.099.010a', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B2',uname: 'A.001.002.099.010b', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B3',uname: 'A.001.002.099.010c', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B4',uname: 'A.001.002.099.010d', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B5',uname: 'A.001.002.099.012e', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B6',uname: 'A.001.002.099.010f', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B7',uname: 'A.001.002.099.010g', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  // {uu: '普通B8',uname: 'A.001.002.099.010h', uname2: '压铆铜扣2', uname3: 'P1604-6.22',uname4: 22},
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2',},
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
  {uu: '普通B',uname: 'A.001.002.099.010', uname2: '压铆铜扣2', },
];

let k = 0
const data = orgdata.map(item => {
  k++
  return{
    key: k, 
    ...item
  }
})

// console.log(data)

class index extends React.Component {
  state = {
    // 获取普通和立库的数据
    getData: [],
    // 选择要打印的数据
    printData: [],
    // 是否显示表格
    showTable: false,
    // 是否显示立体库的列、默认为false
    SeniorLibraryColumns: false
  }

  CommonLibrarycurrentRef = React.createRef()

 

  async selectZone(item) {/**--- 侧边栏选择仓库区域 ---**/
    this.setState({ showTable: false  });
    // return
    const {key} = item;
    if(key === '1'){
        // 发请求获取立体库数据 
        message.info('立体库', 2)
        const result = await getSeniorLibrary()
        // console.log('立库', result.message)
        const newResult = result.message.map((item, index) => {
          return{
            key: ++index,
            ...item,
          }
        })
        // console.log(newResult)
        this.setState({ 
          showTable: true,
          getData: newResult,
          SeniorLibraryColumns: true,
        });
    }else if(key === '2'){
      // 发请求获取普通库数据 
        message.info('普通库', 2)
        const result = await getCommonLibrary()
        // console.log('普通', result.message)
        const newResult = result.message.map((item, index) => {
          // console.log(item)
          // return { key: ++index, ...item }
          return {
            key: ++index,
            _id: item._id, 
            ware_attr__c: item.ware_attr__c,
            material_code__c: item.material_code__c,
            material_name__c: item.material_name__c,
            specifications__c: item.specifications__c,
            arrive_number__c: item.arrive_number__c,
            doc_type__c: item.doc_type__c,
            document_number__c: item.document_number__c,
          }
        })
        // console.log(newResult)
        this.setState({ 
          showTable: true,
          getData: newResult,
          SeniorLibraryColumns: false
        });
    }else{
        message.info('未匹配到?选择出错', 2)
    } 
  }

  selectRowData(selectedRowKeys, selectedRows) { 
    this.setState({ printData: selectedRows });  
  }

  submitData() {
    const result = this.state.printData;
    // const re = result.some(item => item.container_type__c === '料箱') // 区分是立体库还是普通库
    if(result.length === 0){message.info('请选择打印的数据', 1);return;}
    // 1.将数据提交到打印页面 2.设置newData为[] 
    history.push('/pqrcode', result)
    this.setState({ printData:[] });
  }

  render() {
    const { showTable, SeniorLibraryColumns, getData } = this.state;
    // console.log(getData)
    // console.log(this.state.printData)

    return (
      <div>
        <Layout hasSider>
        {/* 侧边栏 */}
          <Sider style={{overflow: "auto",height: "100vh",position: "fixed",left: 0,top: 0,bottom: 0}}>
            <div className="logo" style={{width: '32px', height: '60px', background: '', marginLeft: '24px'}} />
            <Menu
              theme="dark"
              mode="inline"
              items={menu}
              onClick={(item) => this.selectZone(item)}
            />
          </Sider>

         {/* 内容区域 */}
          <Layout
            className="site-layout"
            style={{marginLeft: 200,background: '#fff'}} 
          >
            <Header
              className="site-layout-background"
              style={{
                color: 'white',
                padding: 0,
                textAlign: 'center',
                fontSize: '18px'
              }}
            >
                选择区域/选择数据/打印二维码
            </Header>

            {
              showTable ? (<Content style={{margin: "0px 24px 0", overflow: "initial",position: 'relative'}}>
              <div className="site-layout-background" style={{ padding: 12,textAlign: "center"}}>
              {/* Table组件中功能：可选择、固定列、可编辑单元格 */}
              {/* https://ant.design/components/table-cn/#components-table-demo-row-selection */}
             <p style={{color: 'blue'}}>请先填写要打印的数量再全选</p>
             <Button style={{position: 'absolute', left: 12, top: 10}} onClick={this.submitData.bind(this)}> 提交</Button>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  // ...rowSelection,
                  onChange: (selectedRowKeys, selectedRows) => {return this.selectRowData(selectedRowKeys, selectedRows)}
                }} 
                // columns={this.columns}
                columns={SeniorLibraryColumns ? this.isSeniorLibraryColumns : this.isCommonLibraryColums}
                dataSource={getData}
                pagination={false}
                scroll={{
                  // x: 1500,
                  y: 820,
                }}
              /> 
              </div>
            </Content>):(<div style={{height:'800px',lineHeight:'800px',textAlign:'center',fontWeight:'bold',fontSize:'33px',color:'blue'}}><div>请选择仓库</div></div>)
            }
          </Layout>
        </Layout>
      </div>
    );
  }

  // 普通库列
  isCommonLibraryColums = [
    {
      title: '区域',
      dataIndex: 'ware_attr__c',
      width: 140,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '物料代码',
      dataIndex: 'material_code__c',
      // fixed: 'left',
      width: 150,
    },
    {
      title: '物料名称',
      dataIndex: 'material_name__c',
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'specifications__c',
      width: 150,
    },
    {
      title: '到货数量',
      dataIndex: 'arrive_number__c',
      width: 150,
    },
    {
      title: '打印数量',
      width: 130,
      fixed: 'right',
      render: (item) => {
        // console.log(item)
        return(<InputNumber ref={this.CommonLibrarycurrentRef} min={1} max={50} defaultValue={1} onChange={(val) => item.Number = val} />)
      }
    }
  ]; 
  
  // 立体库列
  isSeniorLibraryColumns = [
    {
      title: '区域',
      dataIndex: 'container_use__c',
      width: 80,
      fixed: 'left',
      render: (text) => <strong>{`立体库`}</strong>,
    },
    {
      title: '物料代码',
      dataIndex: 'material_code__c', 
      width: 150,
    },
    {
      title: '物料名称',
      dataIndex: 'material_name__c',
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'specifications__c',
      width: 150,
    },
    {
      title: '箱号',
      dataIndex: 'container_number__c',
      width: 150,
    },
    { 
      title: '装箱量',  
      dataIndex: 'box_number__c',
      width: 150,
    },
    { 
      title: '项目属性',  
      dataIndex: 'project_number__c',
      width: 150,
    },
    {
      title: '打印数量',
      width: 130,
      fixed: 'right',
      render: (item) => {
        // console.log(item)
        return(<InputNumber ref={this.CommonLibrarycurrentRef} min={1} max={50} defaultValue={1} onChange={(val) => item.Number = val} />)
      }
    }
  ]
  
}

export default index;

// 普通库
// {
//   _id: '63567cf62c08d443e4976ff7',
//   material_code__c: 'A.001.002.099.010',
//   material_name__c: '圆排线',
//   specifications__c: '20芯 带PVC 护套',
//   arrive_number__c:40,
//   ware_attr__c:"普通F",
//   document_number__c:"POORD003602",
//   operation__c:"采购订单", 
// }


// 立体库
// {
//   box_number__c:40
//   col__c:"1"
//   container_number__c: "123400001"
//   container_type__c:"料箱"
//   container_use__c:"原料"
//   document_number__c:"POORD003602"
//   lay__c:"1"
//   material_code__c:"A.001.003.270"
//   material_name__c:"端子盖"
//   operation__c: "采购订单"
//   picking_areas__c:"投料区"
//   project_number__c:"P02"
//   row__c:"1"
//   specifications__c:"3247967"
//   _id:"635f90614ab93f31c4fe07d6"

//   created:"2022-10-31T09:07:45.778Z"
//   created_by:"62f4805b23c63d2784fed286"
//   space: "GrthuZrX4aRYxNypq"
//   modified:"2022-10-31T09:07:45.778Z"
//   owner:"62f4805b23c63d2784fed286"
// }