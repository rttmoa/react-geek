import React, {Component} from "react";
import { getMaterialData, postMaterialPickBackToStorage }  from 'api/bindbox'
import { Card,Breadcrumb  } from 'antd';
import styles from './index.module.scss'


/**--- 原料箱子发请求获取配餐关系表中的状态字段为 '到达' ---**/
class index extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        MaterialData: []
      };
    }
    componentDidMount(){
      this.get()
    }
    async get(){
     await this.getData()
    //  this.interval = setInterval(() => this.getData(), 2000);
    }
    async getData(){
      try {
        const res = await getMaterialData()
        console.log(res)
        this.setState({ MaterialData: res.message });
      } catch (error) {
        console.log(error) // 后台服务未启动会报错
      }

    }

     
    componentWillUnmount() {
      // clearInterval(this.interval);
    }

    PickBackToStorage (Location){
      postMaterialPickBackToStorage(Location, 'BackToStorage')
    }

    /**--- 使用ANTD组件渲染请求到的数据 ---**/
    /**--- 回库的按钮、回库后发请求清空Mes和配餐关系表的数据 ---**/
    render() {
        const { MaterialData } = this.state;
        // console.log(MaterialData)

        return (
          <div className={styles.root}>
            {/* <h2>10022位置</h2>
            <div>123</div>
            <div>数据长度{this.state.MaterialData.length}</div> */}
            <Breadcrumb separator=">" className="Bread">
              <Breadcrumb.Item>主页</Breadcrumb.Item>
              <Breadcrumb.Item>原料箱屏幕</Breadcrumb.Item> 
            </Breadcrumb> 
            {
              !!MaterialData.length ? (MaterialData.map((value, index) => {
                // console.log(value)
                return(
                  <Card
                    title="拣选区原料箱"
                    className="Card"
                    bordered={false}
                    key={index}
                  >
                    {/* 渲染的内容为：项目号、 */}
                    <div className="all-card-content">
                        <div className="per-card-content">
                          <div><span>空箱容器编号：</span><span className="span-font">{value.config_container_number__c}</span></div>
                          <div><span>空箱绑定柜号：</span><span className="span-font">{value.config_cabinet_number__c}</span></div>  
                          <div>{/* 原料标记数量 =  */}<span>放入空箱数量：</span><span className="span-font">{value.remark_number__c}</span></div>   
                        </div>
                        <div className="per-card-content">
                          <div><span>原料容器编号：</span><span className="span-font">{value.container_number__c}</span></div>
                          <div><span>原料项目编号：</span><span className="span-font">{value.project_number__c}</span></div>
                          <div><span>原料箱内数量：</span><span className="span-font">{value.box_number__c}</span></div>
                          <div><span>原料箱内数量：</span><span className="span-font">{value.box_number__c}</span></div> 
                        </div>

                        <div className="per-card-content">
                          <div><span>原料物料代码：</span><span className="span-font">{value.material_code__c}</span></div>
                          <div><span>原料物料名称：</span><span className="span-font">{value.material_name__c}</span></div>
                          <div><span>原料规格型号：</span><span className="span-font">{value.specifications__c}</span></div>
                        </div>
                    </div> 
                  </Card>
                )
              })) : <Card>暂无信息...</Card>
            }
            {!!MaterialData.length && (<button style={{width: '300px',height:'50px', marginTop: '50px'}} onClick={this.PickBackToStorage.bind(this, '2010')} >原料箱回库</button>)}
          </div>
        );
    }
}

export default index;