import React, { memo } from "react";

function ListItem({ children }: any) {
  let now = performance.now();
  while (performance.now() - now < 3) {}
  return <div className="ListItem">{children}</div>;
}

export default memo(
  function MySlowList({ text }: any) {
    console.log("MySlowList render"); //sy-log
    let items = [];
    for (let i = 0; i < 80; i++) {
      items.push(
        <ListItem key={i}>
          Result #{i} for "{text}"
        </ListItem>
      );
    }
    return (
      <div className="border">
        <h1>MySlowList</h1>
        <p>{text}</p>
        <ul className="List">{items}</ul>
      </div>
    );
  },
  (prevProps: any, nextProps: any) => {
    return prevProps.text === nextProps.text;
  }
);
