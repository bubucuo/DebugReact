import React from "react";
import {useState, useEffect} from "react";
import UseMemoPage from "./pages/UseMemoPage";
import CommentListPage from "./pages/CommentListPage";
import PureComponentPage from "./pages/PureComponentPage";
import ReactMemoPage from "./pages/ReactMemoPage";
import UseCallbackPage from "./pages/UseCallbackPage";
import ExamplePage from "./pages/ExamplePage";
import ContextPage from "./pages/ContextPage";
import SetStatePage from "./pages/SetStatePage";
import RefPage from "./pages/RefPage";
import SuspensePage from "./pages/SuspensePage";

export default function App(props) {
  return (
    <div className="app">
      {/* <CommentListPage /> */}
      {/* <PureComponentPage /> */}
      {/* <ReactMemoPage /> */}
      {/* <UseCallbackPage /> */}
      {/* <UseMemoPage /> */}
      {/* <ExamplePage /> */}
      {/* <ContextPage /> */}
      <SetStatePage />
      {/* <RefPage /> */}
      {/* <SuspensePage /> */}
    </div>
  );
}
