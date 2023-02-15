import React, { Component } from "react";
import { Card,Col,  Row, Popconfirm, Button, Table, message, Typography } from "antd";
import {OBTAIN_DATA,DETELE_DATA} from '../../utils/pathMap'
import request from "utils/request";
import styles from "./index.module.scss";

/**--- 主页面渲染料箱数据的时候、过程 PLC->WCS(标记字段)->前台请求获取
 *
 *  ---**/
export default class Home extends Component {
  state = {
    is_show_table: false,
    is_show_out_prompt: false,
    results: [],
    results_material: [],
    prompt_message: [
      "物料不足！所选的物料编号B0的数量为70, 原料的物料编号B0数量为50",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
      "物料库存为0！原料C0未找到",
      "物料库存为0！原料D0未找到",
      "物料库存为0！原料B1未找到",
      "物料库存为0！原料C1未找到",
    ],
  };

  /**--- 点击按钮获取空箱的数据 ---**/
  ObtainBind = async () => {
    this.setState({ is_show_table: true, is_show_out_prompt: false });
    try {
      const res = await request.get(OBTAIN_DATA);// return Promise.reject(error)
      console.log(res)
    if (res.length > 0) {
      message.success("获取所有空箱绑定柜子的信息!");
      this.setState({ results: res.message });
    }else{
      message.error("没有查询到数据信息");
    }
    } catch (error) {
      // console.log(error.message)
      message.error("网络错误！");
    }
  };

  /**--- 空箱汇总之后 主屏幕提交 进行空箱和料箱出库             合并数量     ---**/
  SubmitBind = () => {
    // https://forum.vuejs.org/t/id/34251
    const res = this.state.results;
    // console.log(res);
    const ids = {};
    const newArr = res.filter((val, index) => {
      if (val.material_number__c in ids) {
        res[ids[val.material_number__c]].demand_number__c += val.demand_number__c;
        return false;
      } else {
        ids[val.material_number__c] = index;
        return true;
      }
    });
    console.log(newArr)
    message.success("分配的料箱即将出库, 请耐心等待");
    this.setState({ is_show_table: false, is_show_out_prompt: true });
  };

  /**--- 空箱汇总之后 主屏幕确认提交(再次筛选) ---**/
  DeleteData = async (delete_id) => {
    const res = await request.get(`${DETELE_DATA}?id=${delete_id}`);
    console.log("res", res);
    if (res.message === 1) {
      message.success("删除成功！");
      const reset = await request.get(OBTAIN_DATA);
      if (reset) {
        this.setState({ results: reset.message });
      }
    } else {
      message.error("删除失败！");
    }
  };
  columns = [
    {
      title: "容器类型",
      dataIndex: "container_type__c",
    },
    {
      title: "容器编号",
      dataIndex: "container_number__c",
    },
    {
      title: "箱子位置",
      dataIndex: "box_location__c",
    },
    {
      title: "用途",
      dataIndex: "container_use__c",
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
      title: "物料编码",
      dataIndex: "material_number__c",
    },
    {
      title: "需求数量",
      dataIndex: "demand_number__c",
    },
    {
      title: "删除",
      render: (data) => {
        return (
          <Popconfirm
            title="您确定要删除此条数据?"
            onConfirm={() => this.DeleteData(data._id)}
            onCancel={() => message.error("取消成功")}
            okText="确认"
            cancelText="取消"
          >
            <Button>删除</Button>
          </Popconfirm>
        );
      },
    },
  ];

  /**--- 获取料箱接口数据 ---**/
  ObtainMaterial = async () => {
    alert("获取原料料箱表中 到达1号位置的数据");
  };

  render() {
    const { is_show_table, results } = this.state;
    // console.log(results)

    return (
      <div className={styles.root}>
        <div className="main">
          <div className="left">
            <Button className="Btn1" type="primary" onClick={this.ObtainBind} >
                    查看物料清单
              </Button>
              <Button className="Btn2" type="primary" onClick={this.ObtainMaterial}>
                  当前原料
                </Button>
                <Button className="Btn3" type="primary" onClick={this.ObtainMaterial} >
                  全部原料
                </Button>
                <Button className="Btn4" type="primary" onClick={this.ObtainMaterial}>
                  未完成物料
                </Button> 
              </div> 


            <div className="right">
              <div>
                {is_show_table ? (
                  <div>
                    <Card title={`根据筛选条件共查询到 ${results.length} 条结果：`}>
                      <Table
                        columns={this.columns}
                        dataSource={results}
                        // rowKey={(data) => data._id}
                        rowKey="_id"
                        pagination={false}
                        scroll={{ y: 550 }}
                      />
                      <Button onClick={this.SubmitBind}>
                        提交分配物料，进行出库
                      </Button>
                    </Card>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {this.state.is_show_out_prompt ? (
                  <div style={{ marginLeft: "35px", marginTop: "20px" }}>
                    <div style={{ fontSize: "35px", fontWeight: "bold" }}>
                      空箱和料箱分配情况：
                    </div>
                    <div style={{ marginTop: "20px", fontSize: "24px" }}>
                      {this.state.prompt_message.map((v, k) => {
                        // return(<div key={k}>{v}</div>)
                        return (
                          <div key={k}>
                            <Typography.Text
                              strong={true}
                              underline={true}
                              type="danger"
                            >
                              {v}
                            </Typography.Text>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: "30px" }}>
                      <Button>先补货再出库</Button>
                      <Button>先出库后补货</Button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
           </div>

        </div>{/* main结束 */}
         
      </div>
    );
  }
}
