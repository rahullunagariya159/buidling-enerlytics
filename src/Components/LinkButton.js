import React from "react";

const LinkButton = ({
  isLoading,
  isDisable,
  title,
  className,
  onClick,
  id,
  icon,
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
      {icon && <i className="fa fa-spinner fa-spin link-spinner-icon"></i>}
    </a>
  );
};

export default LinkButton;
