import React, { memo } from "react";

function ListItem({ children }) {
  let now = performance.now();
  while (performance.now() - now < 3) {}
  return <div className="ListItem">{children}</div>;
}

export default memo(function MySlowList({ text }) {
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
      <p>
        <b>Results for "{text}":</b>
      </p>
      <ul className="List">{items}</ul>
    </div>
  );
});
