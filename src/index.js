import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import LoadingCover from "./Components/LoadingCover";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";

const App = React.lazy(() => import("./App"));

const loadingMarkup = <LoadingCover show={true} />;

ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
