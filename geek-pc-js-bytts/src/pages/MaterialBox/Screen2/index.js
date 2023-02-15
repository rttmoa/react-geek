import React, {Component} from "react";
import { getMaterialBoxData, postMaterialPutBackToStorage } from "api/materialbox";
import { Card } from 'antd';
import styles from './index.module.scss'

class index extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            Loc1: [],
            Loc2: []
        };
    }
    componentDidMount() {
        this.get()
    }
    async get(){
        this.getData()
    }
    async getData () {
        try {
            const Loc1 = await getMaterialBoxData('3003') // 获取3003位置的数据 
            this.setState({
                Loc1 : Loc1.message || [],
                // Loc2 : Loc2.message || []
             }); 
           
        } catch (error) {
            console.log(error) // return Promise.reject(error)
        }



        try {  
             const Loc2 = await getMaterialBoxData('3004') // 获取3003位置的数据 
             this.setState({
                 // Loc1 : Loc1.message || [],
                 Loc2 : Loc2.message || []
              });
           
        } catch (error) {
            console.log(error) // return Promise.reject(error)
        }





    }
    // 后台根据位置及标识处理数据即可
    BackToStorage (Location) {
        postMaterialPutBackToStorage(Location, 'BackToStorage')
    }


    render() {
        const { Loc1, Loc2 } = this.state;
        console.log(Loc1) // container_number__c material_code__c
        // console.log(Loc2)

        return (
            <div className={styles.root}>
                <div className="left"> 
                    <Card
                        title="原料入库 | 1023号位置"
                        bordered={false}
                        style={{
                            width: 650,
                            fontSize: 21,
                        }}
                    >
                        {
                            !!Loc1.length ? (Loc1.map((item, index) =>  {   
                                return(
                                    <div key={index} className="content">
                                        <div>容器箱号：<b>{item.container_number__c}</b></div>
                                        <div>装箱数量：<b>{item.box_number__c}</b></div>
                                        <div>物料代码：<b>{item.material_code__c}</b></div>
                                        <div>物料名称：<b>{item.material_name__c}</b></div>
                                        <div>规格型号：<b>{item.specifications__c}</b></div>
                                        <div>项目编号：<b>{item.project_number__c}</b></div>
                                        <div>单据类型：<b>{item.operation__c}</b></div>
                                        <div>单据编号：<b>{item.document_number__c}</b></div>
                                    </div>
                                )
                            })) : <div>暂无信息...</div>
                        } 
                        {!!Loc1.length && (<button style={{width: '200px', marginTop: '50px'}} onClick={this.BackToStorage.bind(this, '1023')} >回库</button>)}
                    </Card>
                    
                </div>



                <div className="left"> 
                    <Card
                        title="原料入库 | 1022号位置"
                        bordered={false}
                        style={{
                            width: 650,
                            fontSize: 21,
                        }}
                    >
                        {
                            !!Loc2.length ? (Loc2.map((item, index) =>  {
                                return(
                                    <div key={index} className="content">
                                        <div>容器箱号：<b>{item.container_number__c}</b></div>
                                        <div>装箱数量：<b>{item.box_number__c}</b></div>
                                        <div>物料代码：<b>{item.material_code__c}</b></div>
                                        <div>物料名称：<b>{item.material_name__c}</b></div>
                                        <div>规格型号：<b>{item.specifications__c}</b></div>
                                        <div>项目编号：<b>{item.project_number__c}</b></div>
                                        <div>单据类型：<b>{item.operation__c}</b></div>
                                        <div>单据编号：<b>{item.document_number__c}</b></div>
                                    </div>
                                )
                            })) : <div>暂无信息...</div>
                        }
                        {!!Loc2.length && (<button style={{width: '200px', marginTop: '50px'}} onClick={this.BackToStorage.bind(this, '1022')} >回库</button>)}
                    </Card>
                    
                </div>


            </div>
        );
    }   
}

export default index;