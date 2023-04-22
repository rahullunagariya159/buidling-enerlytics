import React from "react";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import "./index.css";
import TabBar from "./TabBar";
import ShowDetails from "./ShowDetails";
import { useState } from "react";

const HVAC = () => {
  const [toggle, setToggle] = useState(false);
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
              <div className="building-content">
                <div className="left-wrp-main">
                  <h1>HVAC(HEATING, A/C, VENTILATION) SYSTEM</h1>
                  <p>Fill all the details if you have them</p>
                  <div className="tab-wrapper">
                    <TabBar />
                  </div>
                </div>
                <ShowDetails setToggle={setToggle} toggle={toggle} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default HVAC;
