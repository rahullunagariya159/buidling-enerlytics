import React from "react";
import "../assets/styles/login.css";

const Text = ({ type = "", text = "", className = "" }) => {
  return (
    <div
      className={`${
        type === "error" ? "error-text" : "success-text"
      } ${className}`}
    >
      {text}
    </div>
  );
};

export default Text;
