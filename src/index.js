// import * as React from "react";
// import * as ReactDOM from "react-dom";

import App from "./App";

import "./index.css";

import React from "./kreact/";
import ReactDOM from "./kreact/ReactDOM";
import DiffPage from "./pages/DiffPage";

console.log("当前React版本是:" + React.version);

ReactDOM.render(<DiffPage />, document.getElementById("root"));
