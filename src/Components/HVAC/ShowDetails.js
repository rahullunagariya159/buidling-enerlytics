import React from "react";

const ShowDetails = ({ setToggle, toggle }) => {
  return (
    <div className="right-wrp hvac-rotet">
      <p className="rotet cursor-pointer" onClick={() => setToggle(!toggle)}>
        {!toggle ? "SHOW" : "HIDE"} DETAILS
        <img
          src={
            !toggle
              ? "assets/img/Home-Page/homeFinal/Path 66.svg"
              : "assets/img/Home-Page/homeFinal/Path 67.svg"
          }
          className="porte"
          alt=""
        />
      </p>
      {toggle && <div className="showDetailsWrp">yagnesh</div>}
    </div>
  );
};

export default ShowDetails;
