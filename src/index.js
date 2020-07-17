import {React, ReactDOM} from "./CONST";
import App from "./App";
import "./index.css";
import DiffPage from "./pages/DiffPage";

ReactDOM.render(<DiffPage />, document.getElementById("root"));

console.log("version", React.version); //sy-log
