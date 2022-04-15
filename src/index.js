import { React, createRoot, ReactDOM } from "./whichReact";
import "./index.css";

import ContextPage from "./pages/ContextPage";

// ReactDOM.render(jsx, document.getElementById("root"));

const root = createRoot(document.getElementById("root"));

root.render(<ContextPage />);

console.log("React", React.version); //sy-log
