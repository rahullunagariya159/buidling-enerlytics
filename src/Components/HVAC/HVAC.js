import React, { useState } from "react";
import Navbar from "../Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LeftSidebar from "../LeftSidebar";
import "./index.css";
import HeatingWarm from "./HeatingWarm";
import Cooling from "./Cooling";
import Ventilation from "./Ventilation";
import Humidification from "./Humidification";
import AuxiliaryEquipment from "./AuxiliaryEquipment";

const HVAC = () => {
  const HeatingWarmWaterTabTitle = () => {
    return (
      <div className="tabTitle">
        <img src="assets/img/hvac/heating-dark.svg" alt="tab-icon" />
        <span>HEATING & WARM WATER</span>
      </div>
    );
  };
  const CoolingTabTitle = () => {
    return (
      <div className="tabTitle">
        <img src="assets/img/hvac/cooling-dark.svg" alt="tab-icon" />
        <span>COOLING</span>
      </div>
    );
  };
  const VentilationTabTitle = () => {
    return (
      <div className="tabTitle">
        <img src="assets/img/hvac/ventilator-dark.svg" alt="tab-icon" />
        <span>VENTILATION</span>
      </div>
    );
  };
  const HumidificationTabTitle = () => {
    return (
      <div className="tabTitle">
        <img src="assets/img/hvac/humidification-dark.svg" alt="tab-icon" />
        <span>HUMIDIFICATION</span>
      </div>
    );
  };
  const AuxiliaryEquipmentTabTitle = () => {
    return (
      <div className="tabTitle">
        <img src="assets/img/hvac/motor-dark.svg" alt="tab-icon" />
        <span>AUXILIARY EQUIPMENT</span>
      </div>
    );
  };
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
                    <Tabs
                      defaultActiveKey="HeatingWarmWater"
                      transition={false}
                      id="noanim-tab-example"
                      fill
                    >
                      <Tab
                        transition={false}
                        eventKey="HeatingWarmWater"
                        title={<HeatingWarmWaterTabTitle />}
                      >
                        <HeatingWarm />
                      </Tab>
                      <Tab
                        transition={false}
                        eventKey="Cooling"
                        title={<CoolingTabTitle />}
                      >
                        <Cooling />
                      </Tab>
                      <Tab
                        transition={false}
                        eventKey="Ventilation"
                        title={<VentilationTabTitle />}
                      >
                        <Ventilation />
                      </Tab>
                      <Tab
                        transition={false}
                        eventKey="Humidification"
                        title={<HumidificationTabTitle />}
                      >
                        <Humidification />
                      </Tab>
                      <Tab
                        transition={false}
                        eventKey="AuxiliaryEquipment"
                        title={<AuxiliaryEquipmentTabTitle />}
                      >
                        <AuxiliaryEquipment />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default HVAC;
