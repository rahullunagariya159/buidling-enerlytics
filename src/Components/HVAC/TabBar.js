import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import HeatingWarm from "./HeatingWarm";
import Cooling from "./Cooling";
import Ventilation from "./Ventilation";
import Humidification from "./Humidification";
import AuxiliaryEquipment from "./AuxiliaryEquipment";
import { useState } from "react";

const TabBar = () => {
  const [key, setKey] = useState("HeatingWarmWater");

  const HeatingWarmWaterTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          <img src="assets/img/hvac/checked-verified.svg" alt="" />
        </div>
        <img
          src={
            key === "HeatingWarmWater"
              ? "assets/img/hvac/heating.svg"
              : "assets/img/hvac/heating-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === "HeatingWarmWater" ? "selectedTab" : ""}`}>
          HEATING & WARM WATER
        </span>
      </div>
    );
  };
  const CoolingTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          <img src="assets/img/hvac/checked-verified.svg" alt="" />
        </div>
        <img
          src={
            key === "Cooling"
              ? "assets/img/hvac/cooling.svg"
              : "assets/img/hvac/cooling-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === "Cooling" ? "selectedTab" : ""}`}>
          COOLING
        </span>
      </div>
    );
  };
  const VentilationTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          <img src="assets/img/hvac/checked-verified.svg" alt="" />
        </div>
        <img
          src={
            key === "Ventilation"
              ? "assets/img/hvac/ventilator.svg"
              : "assets/img/hvac/ventilator-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === "Ventilation" ? "selectedTab" : ""}`}>
          VENTILATION
        </span>
      </div>
    );
  };
  const HumidificationTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          <img src="assets/img/hvac/checked-verified.svg" alt="" />
        </div>
        <img
          src={
            key === "Humidification"
              ? "assets/img/hvac/humidification.svg"
              : "assets/img/hvac/humidification-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === "Humidification" ? "selectedTab" : ""}`}>
          HUMIDIFICATION
        </span>
      </div>
    );
  };
  const AuxiliaryEquipmentTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          <img src="assets/img/hvac/checked-verified.svg" alt="" />
        </div>
        <img
          src={
            key === "AuxiliaryEquipment"
              ? "assets/img/hvac/motor.svg"
              : "assets/img/hvac/motor-dark.svg"
          }
          alt="tab-icon"
        />
        <span
          className={`${key === "AuxiliaryEquipment" ? "selectedTab" : ""}`}
        >
          AUXILIARY EQUIPMENT
        </span>
      </div>
    );
  };
  return (
    <Tabs
      defaultActiveKey="HeatingWarmWater"
      transition={false}
      id="noanim-tab-example"
      fill
      onSelect={(k) => setKey(k)}
    >
      <Tab
        transition={false}
        eventKey="HeatingWarmWater"
        title={<HeatingWarmWaterTabTitle />}
      >
        <HeatingWarm />
      </Tab>
      <Tab transition={false} eventKey="Cooling" title={<CoolingTabTitle />}>
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
  );
};

export default TabBar;
