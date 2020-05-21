import * as React from "react";
import {Component, useRef} from "react";

export default class RefPage extends Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.nameInputRef = React.createRef();
    this.passwordRef = React.createRef();
    this.ageInputRef = React.createRef();
    this.countryInputRef = React.createRef();
  }
  submit = e => {
    let name = this.nameInputRef.current.value;

    let password = this.passwordRef.current.getPassword();

    const age = this.ageInputRef.current.value;

    const country = this.countryInputRef.current.value;

    const galaxy = this.refs.galaxy.value;

    const sun = this.refs;
    console.log("submit", name, password, age, country, galaxy, sun); //sy-log
  };

  render() {
    const AgeWithRef = React.forwardRef(AgeInput);
    const HocCountry = hoc(Country);
    const {count} = this.state;
    return (
      <div>
        <h3>RefPage</h3>
        <button onClick={() => this.setState({count: this.state.count + 1})}>
          click change count {count}
        </button>
        <div className="border">
          <label htmlFor="">姓名</label>
          <input type="text" ref={this.nameInputRef} />
        </div>

        <PasswordInput label="密码" ref={this.passwordRef} />

        <AgeWithRef label="年龄" ref={this.ageInputRef} />

        <BirthInput label="生日" />

        <CityInput label="城市" />

        <HocCountry label="国家" ref={this.countryInputRef} />

        <div className="border">
          <label>星系</label>
          <input type="text" ref="galaxy" />
        </div>

        <button onClick={this.submit}>submit</button>
      </div>
    );
  }
}
// 通用
class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.passwordInputRef = React.createRef();
  }
  getPassword = () => {
    return this.passwordInputRef.current.value;
  };
  render() {
    return (
      <div className="border">
        <label htmlFor="">{this.props.label}</label>
        <input type="text" ref={this.passwordInputRef} />
      </div>
    );
  }
}

// forwardRef 转发
function AgeInput(props, ref) {
  return (
    <div className="border">
      <label htmlFor="">{props.label}</label>
      <input type="text" ref={ref} />
    </div>
  );
}

// ref function
class BirthInput extends Component {
  constructor(props) {
    super(props);
    this.birthInput = null;
  }

  setTextInputRef = ele => {
    console.log("setTextInputRef--"); //sy-log
    this.birthInput = ele;
  };

  componentDidMount() {
    // React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。
    // 在 componentDidMount 或 componentDidUpdate 触发前，React 会保证 refs 一定是最新的。
    this.birthInput.value = "123";
    this.birthInput.focus();
  }

  render() {
    const {label} = this.props;
    return (
      <div className="border">
        <label>{label}</label>
        <input type="text" ref={this.setTextInputRef} />
        {/* ref回调以内联函数定义 更新阶段执行两次 */}
        {/* <input
          type="text"
          ref={ele => {
            console.log("setTextInputRef", ele); //sy-log
            this.birthInput = ele;
          }}
        /> */}
        <button
          onClick={() => {
            let val = this.birthInput.value;
            console.log("birth", val); //sy-log
          }}>
          click
        </button>
      </div>
    );
  }
}

// hook用法
function CityInput(props) {
  const cityInputRef = useRef(null);

  return (
    <div className="border">
      <label htmlFor="">{props.label}</label>
      <input type="text" ref={cityInputRef} />
      <button
        onClick={() => {
          let val = cityInputRef.current.value;
          console.log("city", val); //sy-log
        }}>
        click
      </button>
    </div>
  );
}

// hoc中转发refs
const hoc = WrapComponent =>
  React.forwardRef((props, ref) => {
    return (
      <div className="border">
        <WrapComponent {...props} countryInputRef={ref} />
      </div>
    );
  });

function Country({label, countryInputRef}) {
  return (
    <div className="border">
      <label>{label}</label>
      <input type="text" placeholder="Country" ref={countryInputRef} />
    </div>
  );
}
