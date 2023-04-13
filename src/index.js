import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import LoadingCover from "./Components/LoadingCover";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";

const App = React.lazy(() => import("./App"));

const loadingMarkup = (
  <LoadingCover show={true} />
  // <div className="loader-container">
  //   <div className="loader-wrapper">
  //     <div className="loader">
  //       <span className="pip-0"></span>
  //       <span className="pip-1"></span>
  //       <span className="pip-2"></span>
  //       <span className="pip-3"></span>
  //       <span className="pip-4"></span>
  //       <span className="pip-5"></span>
  //     </div>
  //     <h1>Loading...</h1>
  //   </div>
  // </div>
);

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
