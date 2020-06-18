import {React, ReactDOM} from "./CONST";
import DiffPage from "./pages/DiffPage";
import SetStatePage from "./pages/SetStatePage";

import "./index.css";
import App from "./App";

ReactDOM.render(<DiffPage />, document.getElementById("root"));

console.log("version", React.version); //sy-log
