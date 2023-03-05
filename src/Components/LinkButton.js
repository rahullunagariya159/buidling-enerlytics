import React from "react";

const LinkButton = ({ isLoading, isDisable, title, className, onClick }) => {
  return (
    <a
      className={`${className}`}
      onClick={onClick}
      disabled={isDisable}
    >
      {isLoading && <i class="fa fa-spinner fa-spin link-spinner-icon"></i>} {title}
    </a>
  );
};

export default LinkButton;
