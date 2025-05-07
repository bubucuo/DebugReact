import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ActionPage from "./pages/ActionPage";
// import UseOptimisticPage from "./pages/UseOptimisticPage";
import jsx from "./pages/ExamplePage";
import UseActionStatePage from "./pages/UseActionStatePage";
import UseFormStatusPage from "./pages/UseFormStatusPage";
// import RootRouter from "./RootRouter";
// import UseActionStatePage from "./pages/UseActionStatePage";
import UseOptimisticPage from "./pages/UseOptimisticPage";

const root = createRoot(document.getElementById("root"));

// let MyComponent = () => Promise.resolve();

// MyComponent = () => false;
// root.render(<RootRouter />);
root.render(<UseOptimisticPage />);

console.log(
  "%c React Version  " + React.version,
  "font-size:24px; background:green; color:yellow;"
);
