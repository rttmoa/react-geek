import React from "react";
import ReactToPrint from "react-to-print";



class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [1, 23,3,33,2,4,21,15,235  ],
      // arr: [2],
      // 普通库及其他区域样式
      CommonLibraryData: [],
      // 立体库样式
      SeniorLibraryData: [],
      // 打印样式如果为true、渲染立体库样式
      // 如果为false、就渲染普通及其他样式
      printStyle: false,
    };
  } 

  componentDidMount(){
    this.getData()
  }
  getData(){
    const result = this.props.location.state;
    const re = result.some(item => item.container_type__c === "料箱")
    // console.log(re)
    if(re){// 如果true就是立体库 - 打印立体库的样式
      // 这里面还要处理Number、打印数量的问题

      this.setState({
        printStyle: true,
        SeniorLibraryData: result
      });
    }else{// 普通库及其他区域 - 打印普通区域的样式
      this.setState({
        printStyle: false,
        CommonLibraryData: result
      });
    }
  }





  render() {
    const { printStyle,SeniorLibraryData,CommonLibraryData  } = this.state;

    // console.log('普通', this.state.CommonLibraryData)
    // console.log('立体', this.state.SeniorLibraryData)



    const qy = '普通G';
    const dh = '33'
    const code = 'A012..2350124.235'
    const name = 'Aajflnl案说法拉萨能否拿到'
    const num = 'fksdgmnajsfniaf'
    return (
      <div>
        <br />
        <br />
        <br />
        <ReactToPrint
          trigger={() => (<button style={{ fontSize: "22px", marginLeft: "40px" }}>打印</button>)}
          content={() => this.componentRef}
          copyStyles={false}
          suppressErrors={true}
          //这里是第一处设置：打印未显示元素的关键，默认情况copyStyles是为true的，
          //打印未显示的元素时，我们需要把它设置为false，这样打印出来的页面才不会是空白页。
        />
        {/* //这里需要给打印的内容添加一个css类，类的样式如style.less文件： */}
        <div ref={(el) => (this.componentRef = el)}>
          {
            printStyle ? (
              // 立体库样式
              SeniorLibraryData.map((item, k) => {
                // console.log(item)
                return (
                  <div
                    key={k}
                    style={{
                      width: '400px',
                      height:'610px',
                      margin: '40px 40px',
                      display: "inline-block",
                      border: "1px solid #f3f3f3",
                      // border: '1px solid grey',
                      position:'relative',  
                      // backgroundColor: '#f3f3f3'
                    }}
                  >
                    <div style={{ position:'absolute',top:'400px',left:'60px', width: "280px", height: "180px", }}> 
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden', }}>
                            {`区域:: 立体库`}
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', }}>
                            {`代码:: ${item.material_code__c}`}
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',  }}>
                            {`名称:: ${item.material_name__c}`} 
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', }}>
                            {`型号:: ${item.specifications__c}`} 
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', }}>
                            {`箱号:: ${item.container_number__c}`} 
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', }}>
                            {`装箱量:: ${item.box_number__c}`} 
                        </div>
                        <div style={{marginTop:'5px', width:'280px', height:'20px',fontSize:'12px',lineHeight:'20px',padding:'0 5px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',  }}>
                            {`项目属性:: ${item.project_number__c}`} 
                        </div> 
                      </div> 
                  </div> 
                );
              })
            ) : (
              // 普通库及其他
              CommonLibraryData.map((item, k) => {
                // console.log(item)
                // 二维码内容 = 单号/代码/数量
                const params = `${item.document_number__c}/${item.material_code__c}/${item.arrive_number__c}`;
                // console.log(params)
                return (
                  <div
                    key={k}
                    style={{
                      width: '400px',
                      height:'610px',
                      margin: '40px 40px',
                      display: "inline-block",
                      border: "1px solid #f3f3f3",
                      // border: '1px solid grey',
                      position:'relative',  
                    }}
                  >
                    <div style={{ position:'absolute',top:'400px',left:'60px', width: "120px", height: "120px" }}>
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={`https://api.pwmqr.com/qrcode/create/?url=${params}`}
                          alt=""
                        />
                      </div>
                      <div style={{position:'absolute', top:'405px',left:'200px',}}> 
                        <div style={{fontSize:'14px', fontWeight:'bold'}}>{`放货区域==>${item.ware_attr__c}`}</div>
                        <div style={{fontSize:'14px', fontWeight:'bold'}}>{`到货数量==>${item.arrive_number__c}`}</div> 
                      </div>  
                      <div style={{position:'absolute', top:'520px',left:'70px',}}>  
                        <div style={{fontSize:'14px', fontWeight:'bold'}}>{`物料代码==>${item.material_name__c}`}</div>
                        <div style={{fontSize:'14px', fontWeight:'bold'}}>{`物料名称==>${item.material_code__c}`}</div>
                        <div style={{fontSize:'14px', fontWeight:'bold'}}>{`规格型号==>${item.specifications__c}`}</div>
                      </div>
                  </div> 
                );
              })
            )
          }
        </div>
      </div>
    );
  }
}

export default index;
