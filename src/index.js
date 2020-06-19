import {React, ReactDOM} from "./CONST";
import App from "./App";
import "./index.css";
import CloneElementPage from "./pages/CloneElementPage";

ReactDOM.render(<CloneElementPage />, document.getElementById("root"));

console.log("version", React.version); //sy-log
