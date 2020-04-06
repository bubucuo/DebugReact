// import React, {Component} from "react";
// import * as ReactDOM from "react-dom";

// export default class DiffPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0
//     };
//   }

//   changeValue = v => {
//     const {count} = this.state;
//     this.setState({
//       count: count + v
//     });
//   };
//   changeCount = () => {
//     this.changeValue(1);
//   };

//   render() {
//     const {count} = this.state;
//     let arr = [0, 1, 2, 3, 4];
//     if (count && count % 2) {
//       // arr.splice(2, 2);
//       arr = [3, 2, 1, 4, 0];
//     }
//     return (
//       <div>
//         {/* <h3>DiffPage</h3> */}
//         <button onClick={this.changeCount}>change count {count}</button>

//         {arr.map(item => {
//           return (
//             <p className="border" key={item}>
//               {item}
//             </p>
//           );
//         })}
//       </div>
//     );
//   }
// }

import * as React from "react";
import {useState} from "react";
// import React from "../kreact/";
// import {useState} from "../kreact/ReactDOM";

export default function DiffPage(props) {
  const [count, setCount] = useState(0);
  let arr = [0, 1, 2, 3, 4];
  if (count && count % 2) {
    arr.splice(2, 2);
    // arr = [3, 2, 1, 4, 0];
    // arr[5] = 5;
    arr = arr.concat([5, 6, 7]);
  }
  console.log("arr", arr); //sy-log

  const changeCount = () => {
    setCount(count + 1);
  };
  return (
    <div className="diff">
      {/* <h3>DiffPage</h3> */}
      <button onClick={changeCount}>{count}</button>
      {arr.map(item => {
        return (
          <p className="border" key={item}>
            {item}
          </p>
        );
      })}
    </div>
  );
}
