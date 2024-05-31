import * as React from "react";
import {createContext, useContext} from "react";

import {useReducer, useCallback, useMemo} from "react";
// import { ChildContext, ChildOperation, ChildDisplay } from "./Child";

// export default class NewPage extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       items: [],
//     };
//   }
//   add = (name) => {
//     const {items} = this.state;
//     const p = items.find((item) => item.name === name);
//     if (p) {
//       p.count++;
//       this.setState({items: [].concat(items)});
//     } else {
//       this.setState({items: [].concat(items).concat({name, count: 1})});
//     }
//   };
//   remove = (name) => {
//     const {items} = this.state;
//     this.setState({items: items.filter((item) => item.name !== name)});
//   };
//   render() {
//     const {items} = this.state;
//     const {add, remove} = this;
//     return (
//       <ChildContext.Provider value={{items, add, remove}}>
//         <ChildDisplay p="Claz" />
//         <ChildOperation name="张三" add={add} p="Claz" />
//         <ChildOperation name="李四" add={add} p="Claz" />
//       </ChildContext.Provider>
//     );
//   }
// }

export default function NewPage() {
  const [items, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        const p = state.find((item) => item.name === action.name);
        if (p) {
          p.count++;
          return [].concat(state);
        } else {
          return [].concat(state).concat({name: action.name, count: 1});
        }
      case "remove":
        return state.filter((item) => item.name !== action.name);
      default:
    }
  }, []);

  const add = useCallback((name) => {
    dispatch({type: "add", name});
  }, []);
  const remove = useCallback((name) => {
    dispatch({type: "remove", name});
  }, []);

  // const [items, dispatch] = useReducer((state, action) => {
  //   return action;
  // }, []);

  // const add = useCallback(
  //   (name) => {
  //     const p = items.find((item) => item.name === name);
  //     let res = [];
  //     if (p) {
  //       p.count++;
  //       res = res.concat(items);
  //     } else {
  //       res = res.concat(items).concat({name: name, count: 1});
  //     }
  //     dispatch(res);
  //   },
  //   [items]
  // );

  // const remove = useCallback(
  //   (name) => {
  //     let res = items.filter((item) => item.name !== name);
  //     dispatch(res);
  //   },
  //   [items]
  // );

  // const val = useMemo(() => {
  //   return {
  //     items,
  //     add,
  //     remove,
  //   };
  // }, [items, add, remove]);

  return (
    <ChildContext.Provider value={{items, add, remove}}>
      <ChildDisplay p="Func" />
      <ChildOperation name="张三" add={add} p="Func" />
      <ChildOperation name="李四" add={add} p="Func" />
    </ChildContext.Provider>
  );
}

export const ChildContext = createContext();

export const ChildOperation = React.memo(function (props) {
  const {name, add, p} = props;

  console.log(`[${p}] - child operation ${name} render...`);

  return (
    <div>
      <button onClick={() => add(name)}>{name}</button>
      {useMemo(
        () => (
          <Child />
        ),
        []
      )}
    </div>
  );
});

function Child(props) {
  console.log("%c [  ]-128", "font-size:13px; background:pink; color:#bf2c9f;");
  return <div>Child</div>;
}
export const ChildDisplay = React.memo(function (props) {
  const {p} = props;
  const ctx = useContext(ChildContext);

  console.log(`[${p}] - child display render...`);

  return (
    <div>
      {ctx.items.map((item) => {
        return (
          <div key={item.name}>
            <span>
              {item.name} - {item.count}
            </span>
            <button onClick={() => ctx.remove(item.name)}> - </button>
          </div>
        );
      })}
    </div>
  );
});
