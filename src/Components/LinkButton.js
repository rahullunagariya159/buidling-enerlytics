import React from "react";

const LinkButton = ({
  isLoading,
  isDisable,
  title,
  className,
  onClick,
  id,
  icon,
  style = {},
}) => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return (
    <a
      className={`${className}`}
      onClick={onClick}
      disabled={isDisable}
      id={id || randomId}
      style={style}
    >
      {isLoading ? (
        <i className="fa fa-spinner fa-spin link-spinner-icon"></i>
      ) : (
        title
      )}
      {icon && (
        <img
          src="assets/img/profile/upArrowRound.png"
          height={15}
          width={15}
          alt=""
        />
      )}
    </a>
  );
};

export default LinkButton;
