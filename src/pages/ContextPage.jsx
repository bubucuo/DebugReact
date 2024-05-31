import {createContext, Component, useContext} from "react";

const MyContext = createContext({});
const MyProvider = MyContext.Provider;
const MyConsumer = MyContext.Consumer;

const MyBGContext = createContext({});

export default class ContextPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: {color: "red"},
      bgTheme: {background: "red"},
      count: 0,
    };
  }
  changeTheme = () => {
    const {color} = this.state.theme;
    this.setState({
      theme: {
        color: getRandomColor(),
      },
      bgTheme: {background: getRandomColor()},
      count: 0,
    });
  };
  render() {
    const {theme, bgTheme, count} = this.state;
    return (
      <div className="border">
        <h3>ContextPage</h3>
        <MyProvider value={theme}>
          <MyConsumer>{(ctx) => <Child {...ctx} />}</MyConsumer>
          <ClassChild />
          <MyProvider value={theme}>
            <FunctionChild />
          </MyProvider>
        </MyProvider>

        <button onClick={() => this.setState({count: count + 1})}>
          change count : {count}
        </button>
        <button onClick={this.changeTheme}>change theme color</button>
      </div>
    );
  }
}

class ClassChild extends Component {
  static contextType = MyContext;

  render() {
    const {color} = this.context;
    console.log("render-omg-"); //sy-log

    return (
      <div className="border">
        <button
          style={{color: color}}
          onClick={() => console.log("log ClassChild")}>
          ClassChild-{color}
        </button>
      </div>
    );
  }
}

function FunctionChild(props) {
  console.log("%c [  ]-73", "font-size:13px; background:pink; color:#bf2c9f;");
  const context = useContext(MyContext);
  const bgContext = useContext(MyBGContext);

  const {color} = context;
  const {background} = bgContext;

  return (
    <div className="border" style={{color: color, background: background}}>
      FunctionChild: {color || background}
    </div>
  );
}

function getRandomColor(props) {
  return "#" + Math.floor(Math.random() * Math.pow(10, 6));
}

function Child({color, background}) {
  return (
    <div className="border" style={{color: color, background: background}}>
      Child-{color || background}
    </div>
  );
}

