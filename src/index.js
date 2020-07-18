import {React, ReactDOM} from "./CONST";
import App from "./App";
import "./index.css";
import DiffMovePage from "./pages/DiffMovePage";

ReactDOM.render(<DiffMovePage />, document.getElementById("root"));

console.log("version", React.version); //sy-log
