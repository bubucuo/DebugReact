import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// basic
import jsx from "./pages/ExamplePage";

// action | form
import ActionPage from "./pages/ActionPage";
import UseActionStatePage from "./pages/UseActionStatePage";
import UseFormStatusPage from "./pages/UseFormStatusPage";

// 乐观
import UseOptimisticPage from "./pages/UseOptimisticPage";
import UseOptimisticPage2 from "./pages/UseOptimisticPage2";

// use
import UsePage from "./pages/UsePage";

// improvements of 19
import RefPage19 from "./pages/RefPage19";
// other
import UseDeferredValuePage from "./pages/UseDeferredValuePage";

const root = createRoot(document.getElementById("root"));

// let MyComponent = () => Promise.resolve();

// MyComponent = () => false;
// root.render(<RootRouter />);
root.render(<UseDeferredValuePage />);

console.log(
  "%c React Version  " + React.version,
  "font-size:24px; background:green; color:yellow;"
);
