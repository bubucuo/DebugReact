import React, {Component, Suspense} from "react";

export default class SuspensePage extends Component {
  render() {
    return (
      <div>
        <h3>SuspensePage</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent />
        </Suspense>
      </div>
    );
  }
}

const OtherComponent = React.lazy(() => import("./OtherComponent"));

function Loading(props) {
  return <div>loading...</div>;
}

function ReadData(props) {
  let data = setTimeout(() => {
    return 1;
  }, 1000);
  return <div>data-{data}</div>;
}
