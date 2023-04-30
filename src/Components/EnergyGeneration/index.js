import React from "react";
import LeftSidebar from "../LeftSidebar";
import Navbar from "../Navbar";

const EnergyGeneration = () => {
  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="main-building">
              <div className="left-side-bar-container">
                <LeftSidebar module="EG" />
              </div>
              <div className="building-content">
                <div className="left-wrp-main">
                  <h1>ENERGY GENERATION & CONVERSION</h1>
                  <h3>Under construction</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnergyGeneration;
