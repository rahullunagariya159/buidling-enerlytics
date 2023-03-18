import React from "react";
import "../assets/styles/login.css";

const Text = ({ type, text }) => {
  return (
    <div className={type === "error" ? "error-text" : "success-text"}>
      {text}
    </div>
  );
};

export default Text;
