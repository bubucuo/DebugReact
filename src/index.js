import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// basic
import jsx from "./pages/ExamplePage";

// action | form
import ActionPage from "./pages/ActionPage";
import UseActionStatePage from "./pages/UseActionStatePage";
import UseFormStatusPage from "./pages/UseFormStatusPage";

// import UseOptimisticPage from "./pages/UseOptimisticPage";
// import RootRouter from "./RootRouter";
import UseOptimisticPage from "./pages/UseOptimisticPage";

const root = createRoot(document.getElementById("root"));

// let MyComponent = () => Promise.resolve();

// MyComponent = () => false;
// root.render(<RootRouter />);
root.render(<ActionPage />);

console.log(
  "%c React Version  " + React.version,
  "font-size:24px; background:green; color:yellow;"
);
