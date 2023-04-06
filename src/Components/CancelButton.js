import React from "react";

const CancelButton = ({ isDisable, title, className, onClick, id }) => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return (
    <button
      className={className ? className : "cancel-btn"}
      onClick={onClick}
      disabled={isDisable}
      id={id || randomId}
    >
      {title}
    </button>
  );
};

export default CancelButton;
