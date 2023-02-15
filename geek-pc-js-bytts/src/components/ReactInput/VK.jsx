/*--
海皮智造 虚拟键盘 20200930
=============================================
React 内调用说明：
import { VirtualKeyboard } from './VK'
VirtualKeyboard 有2个参数，3个方法。
//
参数1：
VirtualKeyboard.isDisableEnter=true|false
是否禁用Enter键，默认为true。
参数2：
VirtualKeyboard.isDisableTab=true|false
是否禁用Tab键，默认为true。
------------------------
方法1：
  .showKeyboardSetState(valueObject,reactComponent)
  显示虚拟键盘，此方式主要用于Antd Input组件，由于Antd的输入组件直接修改dom的value不生效，故只能传入值Object对象。
  valueObject 是一个Object，Object对象必须使用value属性来传递值。
  reactComponent 是当前React Component，用于按键后setState更新显示。
  如下例子：
  let V={value:'123'}
  <Input onClick={()=>VirtualKeyboard.showKeyboardSetState(V,this)} value={V.value}/>
方法2：
  .showKeyboard(e)
  显示虚拟键盘，此方式主要用于大部分模式。
  参数e可是3种类型，
  1、字符串，即要联动的dom的id
  使用举例： VirtualKeyboard.showKeyboard("inputA")
  2、直接是要联动的dom对象，
  使用举例： VirtualKeyboard.showKeyboard(document.getElementById("xxx"))
  3、鼠标/触摸事件
  使用举例： <input onClick={VirtualKeyboard.showKeyboard} />
方法3：
  .closeKeyboard()
  用命令来关闭键盘，一般来说用不到。
--*/
import React from "react";
import ReactDOM from "react-dom";
class VK extends React.Component {
  C = [
    "~`",
    "!1",
    "@2",
    "#3",
    "$4",
    "%5",
    "^6",
    "&7",
    "*8",
    "(9",
    ")0",
    "_-",
    "+=",
    "Backspace",
    "Tab",
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "{[",
    "}]",
    "|\\",
    "CapsLock",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "L",
    "L",
    ":;",
    "\"'",
    "Enter",
    "Shift",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "<,",
    ">.",
    "?/",
    "Space",
  ];
  W = [
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    120,
    90,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    90,
    110,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    135,
    140,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    170,
  ];
  F_MouseDown = (e) => {
    e = e.nativeEvent;
    if (e.button !== 0) return;
    if (e.target.id.indexOf("VK_") !== 0) {
      if (
        (e.target.innerText === "Enter" &&
          this.props.values.isDisableEnter === true) ||
        (e.target.innerText === "Tab" &&
          this.props.values.isDisableTab === true)
      ) {
        return;
      }
      e.target.style.backgroundColor = "#F80";
      e.target.style.boxShadow = "0px 0px 4px #000 inset";
      this.V.keydom = e.target;
      document.addEventListener("mouseup", this.F_KeyMouseUp);
      return;
    }
    document.addEventListener("mousemove", this.F_MouseMove);
    document.addEventListener("mouseup", this.F_MouseUp);
    this.V.posX = -e.pageX;
    this.V.posY = -e.pageY;
  };
  F_MouseMove = (e) => {
    let tx = this.V.posX + e.pageX + this.V.x;
    let ty = this.V.posY + e.pageY + this.V.y;
    this.dom.style.left = tx + "px";
    this.dom.style.top = ty + "px";
  };
  F_MouseUp = (e) => {
    this.V.x = this.V.posX + e.pageX + this.V.x;
    this.V.y = this.V.posY + e.pageY + this.V.y;
    document.removeEventListener("mousemove", this.F_MouseMove);
    document.removeEventListener("mouseup", this.F_MouseUp);
  };
  F_KeyMouseUp = (e, dom) => {
    this.V.keydom.style.backgroundColor = "#FFF";
    this.V.keydom.style.boxShadow = null;
    document.removeEventListener("mouseup", this.F_KeyMouseUp);
  };
  F_TouchStart = (e) => {
    e = e.nativeEvent;
    if (e.target.id.indexOf("VK_") !== 0) {
      if (
        (e.target.innerText === "Enter" &&
          this.props.values.isDisableEnter === true) ||
        (e.target.innerText === "Tab" &&
          this.props.values.isDisableTab === true)
      ) {
        return;
      }
      e.target.style.backgroundColor = "#F80";
      e.target.style.boxShadow = "0px 0px 4px #000 inset";
      this.V.keydom = e.target;
      document.addEventListener("touchend", this.F_KeyTouchEnd);
      return;
    }
    document.addEventListener("touchmove", this.F_TouchMove);
    document.addEventListener("touchend", this.F_TouchEnd);
    this.V.posX = -e.targetTouches[0].pageX;
    this.V.posY = -e.targetTouches[0].pageY;
  };
  F_TouchMove = (e) => {
    let tx = this.V.posX + e.targetTouches[0].pageX + this.V.x;
    let ty = this.V.posY + e.targetTouches[0].pageY + this.V.y;
    this.dom.style.left = tx + "px";
    this.dom.style.top = ty + "px";
  };
  F_TouchEnd = (e) => {
    this.V.x = this.V.posX + e.changedTouches[0].pageX + this.V.x;
    this.V.y = this.V.posY + e.changedTouches[0].pageY + this.V.y;
    document.removeEventListener("touchmove", this.F_TouchMove);
    document.removeEventListener("touchend", this.F_TouchEnd);
  };
  F_KeyTouchEnd = (e) => {
    this.V.keydom.style.backgroundColor = "#FFF";
    this.V.keydom.style.boxShadow = null;
    document.removeEventListener("touchend", this.F_KeyTouchEnd);
  };
  F_KeyDown = (e) => {
    let dom = e.target;
    let txt = dom.innerText;
    if (txt === "CapsLock") {
      this.V.isCaps = !this.V.isCaps;
      if (this.V.isCaps) {
        dom.style.backgroundColor = "#F80";
      } else {
        dom.style.backgroundColor = "#FFF";
      }
      this.setState({});
    } else if (txt === "Shift") {
      this.V.isShift = !this.V.isShift;
      if (this.V.isShift) {
        dom.style.backgroundColor = "#F80";
      } else {
        dom.style.backgroundColor = "#FFF";
      }
      this.setState({});
    } else if (txt === "Enter") {
      if (this.props.values.isDisableEnter === false) {
        this.F_ChangeInput(String.fromCharCode(13));
      }
    } else if (txt === "Space") {
      this.F_ChangeInput(" ");
    } else if (txt === "Tab") {
      if (this.props.values.isDisableTab === false) {
        this.F_ChangeInput(String.fromCharCode(9));
      }
    } else if (txt === "Backspace") {
      this.F_ChangeInput(-1);
    } else if (txt.indexOf("\n") >= 0) {
      if (this.V.isShift) {
        this.F_ChangeInput(txt[0]);
      } else {
        this.F_ChangeInput(txt[2]);
      }
    } else {
      if (this.V.isShift) {
        this.F_ChangeInput(
          txt.toUpperCase() === txt ? txt.toLowerCase() : txt.toUpperCase()
        );
      } else this.F_ChangeInput(txt);
    }
  };
  render() {
    let keyStyle = {
      boxSizing: "border-box",
      float: "left",
      height: 60,
      margin: 2.5,
      borderRadius: 4,
      border: "1px solid #333",
      textAlign: "center",
      cursor: "pointer",
    };
    return (
      <div
        onContextMenu={(e) => e.preventDefault()}
        tabIndex="-1"
        id="VK_Main"
        ref={(dom) => (this.dom = dom)}
        style={{
          outline: "none",
          top: this.V.y,
          left: this.V.x,
          position: "absolute",
          zIndex: "999999999",
          backgroundColor: "#AAA",
          padding: 3,
          width: 1000,
          fontSize: 20,
          border: "1px solid #444",
          borderRadius: 8,
          userSelect: "none",
        }}
        onMouseDown={this.F_MouseDown}
        onTouchStart={this.F_TouchStart}
        onBlur={this.F_Close}
      >
        <div
          id="VK_Title"
          style={{ fontSize: 14, margin: 5, textAlign: "right" }}
        >
          <span id="VK_Tip" style={{ float: "left" }}>
            昱庄智造 © 虚拟键盘
          </span>   
          如虚拟键盘遮挡显示内容，可以拖动移开或{" "}
          <button
            style={{ borderRadius: 6, border: "1px dotted #333" }}
            onClick={this.F_Close}
          >
            关闭虚拟键盘
          </button>
        </div>
        <div
          id="VK_Keys"
          style={{ height: 67, lineHeight: 67 }}
          onClick={this.F_KeyDown}
        >
          {this.C.map((c, n) => {
            if (c.length === 2) {
              return (
                <div
                  key={n}
                  style={{
                    ...keyStyle,
                    width: this.W[n] ? this.W[n] : 60,
                    lineHeight: "28px",
                    backgroundColor: "#fff",
                  }}
                >
                  {c[0]}
                  <br />
                  {c[1]}
                </div>
              );
            } else {
              return (
                <div
                  key={n}
                  style={{
                    ...keyStyle,
                    width: this.W[n] ? this.W[n] : 60,
                    lineHeight: "60px",
                    backgroundColor:
                      (c === "Tab" && this.props.values.isDisableTab) ||
                      (c === "Enter" && this.props.values.isDisableEnter)
                        ? "#888"
                        : "#fff",
                  }}
                >
                  {c.length === 1
                    ? this.V.isCaps
                      ? c.toUpperCase()
                      : c.toLocaleLowerCase()
                    : c}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
  constructor(props) {
    super();
    if (props.values.dom !== null) {
      this.V.currentDom = props.values.dom;
    }
    if (props.values.value !== null && props.values.state !== null) {
      this.V.reactValueObject = props.values.value;
      this.V.reactStateObject = props.values.state;
    }
    let w = document.body.clientWidth;
    let h = document.body.clientHeight;
    this.V.x = w / 2 - 970 / 2;
    this.V.y = h - 400;
  }
  UNSAFE_componentWillUpdate(props) {
    if (props.values.dom !== null) {
      this.V.currentDom = props.values.dom;
      this.V.reactValueObject = null;
      this.V.reactStateObject = null;
    } else if (props.values.value !== null && props.values.state !== null) {
      this.V.reactValueObject = props.values.value;
      this.V.reactStateObject = props.values.state;
      this.V.currentDom = null;
    }
  }
  componentDidMount() {
    this.dom.focus();
  }
  F_ChangeInput = (c) => {
    let inputContent = "";
    if (this.V.currentDom !== null) {
      inputContent =
        this.V.currentDom.innerText ||
        this.V.currentDom.textContent ||
        this.V.currentDom.value;
    } else inputContent = this.V.reactValueObject.value;
    inputContent = inputContent.toString();
    let strArr = inputContent.split("");
    if (c === -1) {
      strArr.pop();
    } else strArr.push(c);
    if (this.V.currentDom !== null) {
      if (this.V.currentDom.nodeName === "INPUT") {
        this.V.currentDom.value = strArr.join("");
      } else if (this.V.currentDom.nodeName !== undefined) {
        this.V.currentDom.innerHTML = strArr.join("");
      }
    } else if (
      this.V.reactStateObject !== null &&
      this.V.reactValueObject !== null
    ) {
      this.V.reactValueObject.value = strArr.join("");
      this.V.reactStateObject.setState({});
    }
  };
  V = {
    isCaps: false,
    isShift: false,
    currentDom: null,
    reactValueObject: null,
    reactStateObject: null,
  };
  F_Close = () => {
    this.props.values.closeKeyboard();
  };
}
const data = {
  VK: VK.prototype,
  div: null,
  props: {},
};
export const VirtualKeyboard = {
  isDisableEnter: true,
  isDisableTab: true,
  showKeyboardSetState: (valueObject, reactComponent) => {
    data.props.value = valueObject;
    data.props.state = reactComponent;
    data.props.dom = null;
    if (data.div !== null) {
      data.VK.setState({});
    } else {
      data.props.closeKeyboard = VirtualKeyboard.closeKeyboard;
      data.props.isDisableEnter = VirtualKeyboard.isDisableEnter;
      data.props.isDisableTab = VirtualKeyboard.isDisableTab;
      let body = document.getElementsByTagName("body")[0];
      if (body === undefined) return;
      let div = document.createElement("div");
      data.div = div;
      body.appendChild(div);
      let V = <VK ref={(dom) => (data.VK = dom)} values={data.props} />;
      ReactDOM.render(V, div);
    }
  },
  showKeyboard: (e) => {
    data.props.value = null;
    data.props.state = null;
    data.props.dom = null;
    if (typeof e === "string") {
      let dom = document.getElementById(e);
      if (dom !== null) {
        data.props.dom = dom;
      }
    } else if (typeof e === "object") {
      if (typeof e.type === "string" && typeof e.nodeName === "string") {
        data.props.dom = e;
      } else if (e.target !== undefined) {
        e = e.target;
        if (typeof e.type === "string" && typeof e.nodeName === "string") {
          data.props.dom = e;
        }
      }
    }
    if (data.props.dom === null) return;
    if (data.div !== null) {
      data.VK.setState({});
    } else {
      data.props.closeKeyboard = VirtualKeyboard.closeKeyboard;
      data.props.isDisableEnter = VirtualKeyboard.isDisableEnter;
      data.props.isDisableTab = VirtualKeyboard.isDisableTab;
      let body = document.getElementsByTagName("body")[0];
      if (body === undefined) return;
      let div = document.createElement("div");
      data.div = div;
      body.appendChild(div);
      let V = <VK ref={(dom) => (data.VK = dom)} values={data.props} />;
      ReactDOM.render(V, div);
    }
  },
  closeKeyboard: () => {
    ReactDOM.render(null, data.div);
    data.div.remove();
    data.div = null;
  },
};
