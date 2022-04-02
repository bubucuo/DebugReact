import { React, createRoot } from "./whichReact";
import "./index.css";

import NewHookApi from "./pages/NewHookApi";

// ReactDOM.render(<SetStatePage />, document.getElementById("root"));

const root = createRoot(document.getElementById("root"));

root.render(<NewHookApi />);

console.log("React", React.version); //sy-log
