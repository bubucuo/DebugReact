import {React, ReactDOM} from "./CONST";
import DiffPage from "./pages/DiffPage";
import ClassFunctionComponent from "./pages/ClassFunctionComponent";

import "./index.css";

ReactDOM.render(<ClassFunctionComponent />, document.getElementById("root"));

console.log("version", React.version); //sy-log
