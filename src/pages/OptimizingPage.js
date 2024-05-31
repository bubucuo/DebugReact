import {
  Component,
  PureComponent,
  useEffect,
  useState,
  memo,
  useMemo,
} from "react";

export default function OptimizingPage(props) {
  const [arr, setArr] = useState([0, 1, 2, 3]);

  return (
    <div className="border">
      <h3>OptimizingPage</h3>
      <button
        onClick={() => {
          setArr([...arr, arr.length]);
        }}
      >
        修改数组
      </button>

      {arr.map((item, index) => {
        return <ChildUseMemo key={"Child" + item} item={item} />;
      })}
    </div>
  );
}

function Child({ item }) {
  useEffect(() => {
    return () => {
      console.log("destroy"); //sy-log
    };
  }, []);
  console.log("Child", item); //sy-log
  return <div className="border">{item}</div>;
}

const ChildMemo = memo(Child, (prev, next) => {
  return prev.item === next.item;
});

class ChildShouldComponentUpdate extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.item !== nextProps.item;
  }
  render() {
    console.log("ChildComponent", this.props.item); //sy-log
    return (
      <div className="border">
        <p>{this.props.item}</p>
      </div>
    );
  }
}

class ChildPureComponent extends PureComponent {
  render() {
    console.log("ChildPureComponent"); //sy-log
    return (
      <div className="border">
        <p>{this.props.item}</p>
      </div>
    );
  }
}

function ChildUseMemo({ item }) {
  return useMemo(() => <Child item={item} />, []);
}
