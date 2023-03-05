import React from "react";

const Button = ({ isLoading, isDisable, title, className, onClick }) => {
  return (
    <button
      className={`${className}`}
      onClick={onClick}
      disabled={isDisable}
    >
      {isLoading && <i class="fa fa-spinner fa-spin"></i>} {title}
    </button>
  );
};

export default Button;
