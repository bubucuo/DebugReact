import { useDeferredValue, useState, memo } from "react";
import MySlowList from "../components/MySlowList";

export default function UseDeferredValuePage(props) {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text);

  const handleChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div>
      <h3>UseDeferredValuePage</h3>
      {/* 保持将当前文本传递给 input */}
      {/* 紧急更新 */}
      <input value={text} onChange={handleChange} />
      {/* 但在必要时可以将列表“延后” */}
      <p>{deferredText}</p>

      {/* 非紧急更新 */}
      <MySlowList text={deferredText} />
    </div>
  );
}

// function ListItem({ children }) {
//   let now = performance.now();
//   while (performance.now() - now < 3) {}
//   return <div className="ListItem">{children}</div>;
// }

// const MySlowList = memo(function ({ text }) {
//   let items = [];
//   for (let i = 0; i < 80; i++) {
//     items.push(
//       <ListItem key={i}>
//         Result #{i} for "{text}"
//       </ListItem>
//     );
//   }
//   return (
//     <div className="border">
//       <p>
//         <b>Results for "{text}":</b>
//       </p>
//       <ul className="List">{items}</ul>
//     </div>
//   );
// });
