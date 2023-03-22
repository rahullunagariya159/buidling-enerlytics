import React from "react";

const LinkButton = ({
  isLoading,
  isDisable,
  title,
  className,
  onClick,
  id,
}) => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return (
    <a
      className={`${className}`}
      onClick={onClick}
      disabled={isDisable}
      id={id || randomId}
    >
      {isLoading ? (
        <i className="fa fa-spinner fa-spin link-spinner-icon"></i>
      ) : (
        title
      )}
    </a>
  );
};

export default LinkButton;
