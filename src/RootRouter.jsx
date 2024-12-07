import { BrowserRouter, Link, Routes, Route } from "react-router";
import jsx from "./pages/ExamplePage";
import ActionPage from "./pages/ActionPage";
import UseOptimisticPage from "./pages/UseOptimisticPage";

export default function RootRouter(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/example" element={jsx} />
        <Route path="/action" element={<ActionPage />} />
        <Route path="/use-optimistic" element={<UseOptimisticPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function Nav(props) {
  return (
    <nav>
      <Link to="/example">Example</Link>
      <Link to="/action">Action</Link>
      <Link to="/use-optimistic">UseOptimistic</Link>
    </nav>
  );
}
