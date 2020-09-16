import {React, ReactDOM} from "./CONST";
import App from "./App";
import "./index.css";
import SetStatePage from "./pages/SetStatePage";
// import DiffPage from "./pages/DiffPage";

ReactDOM.render(<SetStatePage />, document.getElementById("root"));

console.log("version-sy-log", React.version); //sy-log
