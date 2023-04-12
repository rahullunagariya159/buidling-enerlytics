import React, { useState } from "react";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";

import "./index.css";

const HVAC = () => {
  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="main-building">
              <div className="left-side-bar-container">
                <LeftSidebar module="HV" />
              </div>
              <div className="building-content ">HVAC</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default HVAC;
