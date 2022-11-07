import {React, createRoot, ReactDOM} from "./whichReact";
import "./index.css";

import jsx from "./pages/ExamplePage";
import TransitionPage from "./pages/TransitionPage";
import LifeCyclePage from "./pages/LifeCyclePage";
import SuspensePage from "./pages/SuspensePage";
import UseCallbackPage from "./pages/UseCallbackPage";
import UseMemoPage from "./pages/UseMemoPage";

// ReactDOM.render(jsx, document.getElementById("root"));

const root = createRoot(document.getElementById("root"));

// root.render(jsx);
root.render(<UseMemoPage />);

console.log("React", React.version); //sy-log
