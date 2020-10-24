import {React, ReactDOM} from "./CONST";
import App from "./App";
import "./index.css";
// import jsx from "./pages/ExamplePage";
import DiffPage from "./pages/DiffPage";

ReactDOM.render(<DiffPage />, document.getElementById("root"));

console.log("version-sy-log", React.version); //sy-log
