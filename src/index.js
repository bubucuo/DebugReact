import { React, createRoot } from "./whichReact";
import "./index.css";
// import SuspenseListPage from "./pages/SuspenseListPage";
// import SuspensePage from "./pages/SuspensePage";
// import UseDeferredValuePage from "./pages/UseDeferredValuePage";
import TransitionPage from "./pages/TransitionPage";
import SetStatePage from "./pages/SetStatePage";
// import DiffPage from "./pages/DiffPage";
// import jsx from "./pages/ExamplePage";
// import App from "./App";

// ReactDOM.render(<SetStatePage />, document.getElementById("root"));

// ReactDOM.render(<DiffPage />, document.getElementById("root"));

const root = createRoot(document.getElementById("root"));

root.render(<TransitionPage />);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <UseDeferredValuePage />
// );

console.log("React", React.version); //sy-log
