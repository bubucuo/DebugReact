import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ActionPage from "./pages/ActionPage";
import UseOptimisticPage from "./pages/UseOptimisticPage";
import jsx from "./pages/ExamplePage";

const root = createRoot(document.getElementById("root"));

root.render(jsx);

console.log("React", React.version); //sy-log
