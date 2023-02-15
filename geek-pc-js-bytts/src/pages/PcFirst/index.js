import React,{ Component } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  Button,
  Table,
  message,
  InputNumber,
  Input,
} from "antd";
import {OBTAIN_MES,EMPTY_DATA} from '../../utils/pathMap'
import request from "utils/request";

import { VirtualKeyboard } from "../../components/ReactInput/VK.jsx";
// import React from "react";

class index extends Component {
  V = { value: "hello" };
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      selectedRowKeys: [],
      Is_show_one_table: false,
      Is_show_two_table: false,
      results_2: [],
      Number: 0
    };
  }

  columns = [
    {
      title: "主键",
      dataIndex: "id__c",
    },
    {
      title: "项目号",
      dataIndex: "project__c",
    },
    {
      title: "柜子号",
      dataIndex: "cupboard__c",
    },
    {
      title: "物料号",
      dataIndex: "material__c",
    },
    {
      title: "需求数量",
      dataIndex: "demand__c",
    },
  ];
  // 获取项目-柜子-物料信息
  objData = async () => {
    this.setState({
      results: [],
      Is_show_one_table: true,
      Is_show_two_table: false,
    });
    const res = await request.get(OBTAIN_MES);
    if (res) {
      this.setState({
        results: res.message,
        selectedRowKeys: [],
      });
      message.success("获取数据成功");
    }
  };
  objEmptyContainer = async () => {
    this.setState({ Is_show_one_table: false });
    const res = await request.get(EMPTY_DATA);
    // console.log(res.message)
    const ww = res.message.filter((v) => {
      return v.box_location__c === "一号";
    });
    // console.log(ww)
    if (res) {
      this.setState({ results_2: ww, Is_show_two_table: true });
    }
    // console.log(res)
  };
  // 呼叫空箱
  callBox = () => {
    alert(123);
    // this.setState({ Is_Button_status1_loading: true });
    // setTimeout(() => {
    //   this.setState({
    //     alert_message: "空箱呼叫成功",
    //     Is_Button_status1_loading: false,
    //   });
    // }, 3000);
  };

  // 绑定柜子
  bind = async () => {
    const params = this.state.selectedRowKeys;

    if (!params.length) {
      alert("请选择要绑定的数据-----------------");
      return;
    }
    // console.log("params", params);
    // 发请求 提交后台 绑定成功！
    message.success("绑定成功！");
    this.setState({ Is_show_one_table: false });

    // 发请求
    const res = await request.post("/api/pc/screen/2/material/bind/insert", {
      data: params,
      loc: "一号",
    });
    if (res) {
      // console.log(res); //{message: 'router ok'}
    }
    // if (res) {
    //   this.setState({
    //     Isfree: false,
    //     Is_show_data: true,
    //     Is_Button_status2_loading: false,
    //     results: res.message,
    //   });
    //   message.success("获取数据成功");
    // } else {
    //   message.error("绑定箱子失败");
    // }
  };

  // 一号空箱值变化
  onSelectChange = (_id, Rows) => {
    this.setState({
      selectedRowKeys: [..._id],
    });
  };
  columns_2 = [
    {
      title: "箱号",
      dataIndex: "container_number__c",
    },
    {
      title: "位置",
      dataIndex: "box_location__c",
    },
    {
      title: "项目号",
      dataIndex: "project_number__c",
    },
    {
      title: "柜子号",
      dataIndex: "cupboard_number__c",
    },
    {
      title: "物料号",
      dataIndex: "material_number__c",
    },
    {
      title: "需求数量",
      dataIndex: "demand_number__c",
    },
    {
      title: "拣选数量",
      // dataIndex: "select_number__c",
      render: (data) => {
        console.log('data', data)
        return (
          <InputNumber
            style={{ width: "60px" }}
            min={0}
            max={data.demand_number__c}
            defaultValue={data.select_number__c}
            onChange={(data) => {this.setState({ Number:data  })}}
            // value={this.state.Number}
            value={data.select_number__c}
          />
        );
      },
    },
    {
      title: "操作",
      render: (data) => {
        // console.log(data)
        return <Button disabled={data.iscompleted__c ? true : false} onClick={() => this.emptyContainer(data)}>提交</Button>;   // 是否完成 加 disabled
      },
    },
  ];
  emptyContainer = (data) => {
    console.log(this.state.Number)
    console.log('data', data)
    const num = this.state.Number
    const query = {
      data: data,
      num
    }
    
    // console.log('number', this.state.Number)
  };
  // InputNumber_Change = (data) => {
  //   // console.log("InputNumber_Change", data);
  //   this.setState({ Number:data  });
  // };
  onSelectChange_2 = (_id, Rows) => {};
  render() {
    const {
      results,
      selectedRowKeys,
      Is_show_one_table,
      Is_show_two_table,
      results_2,
    } = this.state;
    const hasSelected = selectedRowKeys.length > 0;

    // console.log(results)
    return (
      <div>
        <Row gutter={10} justify="space-between">
          <Col span={12}>
            <Card title="位置一" bordered={false}>
              <div>
                <Space size="large">
                  <Button type="primary" onClick={this.objData}>
                    获取项目清单
                  </Button>
                  <Button type="primary" onClick={this.objEmptyContainer}>
                    空箱装箱情况
                  </Button>
                  <Input
                    onClick={() =>
                      VirtualKeyboard.showKeyboardSetState(this.V, this)
                    }
                    value={this.V.value}
                  />
                </Space>

                {/* 第一个表格 */}
                <div>
                  {Is_show_one_table ? (
                    <div>
                      <Card
                        title={
                          hasSelected
                            ? `选择了 ${selectedRowKeys.length} 条数据：`
                            : "当前未选择数据"
                        }
                      >
                        <Table
                          columns={this.columns}
                          dataSource={results}
                          // rowKey={(data) => data._id}
                          rowKey="_id"
                          rowSelection={{
                            type: "checkbox",
                            onChange: (_id, Rows) => {
                              this.onSelectChange(_id, Rows);
                            },
                            // onSelectAll: (selected, _, __) => !selected,
                            selectedRowKeys: selectedRowKeys,
                            getCheckboxProps: (record) => ({
                              disabled: record.receiveStatus === 0,
                              receiveStatus: record.receiveStatus,
                            }),
                          }}
                          pagination={false}
                          scroll={{ y: 400 }}
                        />
                      </Card>
                      <Space size="large">
                        <Button type="primary" onClick={this.callBox}>
                          呼叫空箱
                        </Button>

                        <Button type="primary" onClick={this.bind}>
                          绑定柜子
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {/* 第二个表格 */}
                <div>
                  {Is_show_two_table ? (
                    <div>
                      <Card
                        title={
                          hasSelected
                            ? `选择了 ${selectedRowKeys.length} 条数据：`
                            : ""
                        }
                      >
                        <Table
                          columns={this.columns_2}
                          dataSource={results_2}
                          // rowKey={(data) => data._id}
                          rowKey="_id"
                          rowSelection={{
                            type: "checkbox",
                            onChange: (_id, Rows) => {
                              this.onSelectChange_2(_id, Rows);
                            },
                            // onSelectAll: (selected, _, __) => !selected,
                            selectedRowKeys: selectedRowKeys,
                            getCheckboxProps: (record) => ({
                              disabled: record.receiveStatus === 0,
                              receiveStatus: record.receiveStatus,
                            }),
                          }}
                          pagination={false}
                          scroll={{ y: 400 }}
                        />
                      </Card>
                      <Space size="large">
                        <Button type="primary" onClick={this.call_box}>
                          下线
                        </Button>

                        <Button type="primary" onClick={this.bind}>
                          回库
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Card>
          </Col>

          {/* 右侧箱子 */}
          <Col span={12}>
            <Card title="位置二" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default index;
