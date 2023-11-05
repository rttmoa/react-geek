import './index.scss'
import { useState } from 'react'
import { Divider, Typography, Tag, BackTop, Radio, Space } from "antd";

const Home = () => {
  const { Title, Paragraph, Text } = Typography;
  const [radioValue, setRadioValue] = useState("red"); // 单选框的值

  return (
    <div className="app">
      <div className="card">
        {/* 标题及标签部分 */}
        <Title level={2}>仓储控制出入库管理实时查看</Title>
        <Paragraph style={{ marginLeft: 30 }}>
          <Tag color="red" className="tag">
            环穿
          </Tag>
          <Tag color="cyan" className="tag">
            输送机
          </Tag>
          <Tag color="cyan" className="tag">
            堆垛机
          </Tag>
        </Paragraph>

        {/* ---------- TODO: 每一个描述内容的盒子 ----------------------------------- */}
        <div className="content">
          <div className="str">
            {/* <div
              className={clsx(
                radioValue === "green"
                  ? "stackerGreen"
                  : radioValue === "red"
                  ? "stackerRed"
                  : radioValue === "yellow"
                  ? "stackerYellow"
                  : null,
                "stacker1"
              )}
            ></div> */}
            <div className="stackerGreen stacker2"></div>
            <div className="stackerGreen stacker3"></div>
            {/* <div
              className={clsx(
                radioValue === "green"
                  ? "stackerGreen"
                  : radioValue === "red"
                  ? "stackerRed"
                  : radioValue === "yellow"
                  ? "stackerYellow"
                  : null,
                "stacker4"
              )}
            ></div> */}
            <div className="stackerGreen stacker5"></div>
            <div className="stackerGreen stacker6"></div>
            {/* <div
              className={clsx(
                radioValue === "green"
                  ? "stackerGreen"
                  : radioValue === "red"
                  ? "stackerRed"
                  : radioValue === "yellow"
                  ? "stackerYellow"
                  : null,
                "stacker7"
              )}
            ></div> */}
            <div className="stackerGreen stacker8"></div>
          </div>
          {/* TODO: 左侧输送线 */}
          <div>
            <div className="small loc_1056">1056</div>
            <div className="small loc_1055">1055</div>
            <div className="small loc_1054">1054</div>
            {/* <div className={clsx("small", "loc_1053", radioValue === "red" ? "red" : null)}>1053</div> */}
            <div className="small loc_1057">1057</div>
            <div className="small loc_1058">1058</div>
            <div className="small loc_1059">1059</div>
            <div className="small loc_1060">1060</div>
          </div>
          <div>
            <div className="small loc_1061">1061</div>
            <div className="small loc_1067">1067</div>
          </div>
          <div>
            <div className="small loc_1068">1068</div>
            <div className="small loc_1079">1079</div>
          </div>
          {/* TODO: 中间输送线 */}
          <div>
            <div className="middle loc_1051">1051</div>
            <div className="middle loc_1050">1050</div>
            <div className="middle loc_1047">1047</div>
            <div className="middle loc_1046" style={{ backgroundColor: "red" }}>
              1046
            </div>
            <div className="middle loc_1043">1043</div>
            <div className="middle loc_1042">1042</div>
            <div className="middle loc_1039">1039</div>
            <div className="middle loc_1038">1038</div>

            <div className="middle loc_1035">1035</div>
            <div className="middle loc_1034" style={{ backgroundColor: "red" }}>
              1034
            </div>
            <div className="middle loc_1031">1031</div>
            <div className="middle loc_1030">1030</div>
            <div className="middle loc_1027">1027</div>
            <div className="middle loc_1026" style={{ backgroundColor: "red" }}>
              1026
            </div>
            <div className="middle loc_1023">1023</div>
            <div className="middle loc_1022">1022</div>

            <div className="middle loc_1052">1052</div>
            <div className="middle loc_1049">1049</div>
            <div className="middle loc_1048">1048</div>
            <div className="middle loc_1045">1045</div>
            <div className="middle loc_1044">1044</div>
            <div className="middle loc_1041">1041</div>
            <div className="middle loc_1040">1040</div>
            <div className="middle loc_1037">1037</div>

            <div className="middle loc_1036">1036</div>
            <div className="middle loc_1033">1033</div>
            <div className="middle loc_1032">1032</div>
            <div className="middle loc_1029">1029</div>
            <div className="middle loc_1028">1028</div>
            <div className="middle loc_1025">1025</div>
            <div className="middle loc_1024">1024</div>
            <div className="middle loc_1021">1021</div>
          </div>
          {/* TODO: 右侧输送线 */}
          <div>
            <div className="small loc_1001">1001</div>
            <div className="small loc_1002">1002</div>
            <div className="small loc_1003">1003</div>
            <div className="small loc_1004">1004</div>
            <div className="small loc_1005" style={{ backgroundColor: "red" }}>
              1005
            </div>
            <div className="small loc_1006">1006</div>
            <div className="small loc_1008">1008</div>
            <div className="small loc_1007" style={{ backgroundColor: "red" }}>
              1007
            </div>
            <div className="small loc_1010">1010</div>
            <div className="small loc_1009">1009</div>

            <div className="small loc_1011">1011</div>
            <div className="small loc_1012" style={{ backgroundColor: "red" }}>
              1012
            </div>
            <div className="small loc_1016">1016</div>
            <div className="small loc_1015">1015</div>

            <div className="middle loc_1017">1017</div>
            <div className="small loc_1018">1018</div>
            <div className="small loc_1019">1019</div>
            <div className="small loc_1020">1020</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home