import * as React from "react";
import * as ReactDOM from "react-dom";

// import App from "./App";
import DiffPage from "./pages/DiffPage";

import "./index.css";

console.log("当前React版本是:" + React.version);

ReactDOM.render(<DiffPage />, document.getElementById("root"));
