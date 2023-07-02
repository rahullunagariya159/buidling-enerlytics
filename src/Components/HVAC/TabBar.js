import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import HeatingWarm from "./HeatingWarm";
import Cooling from "./Cooling";
import Ventilation from "./Ventilation";
import Humidification from "./Humidification";
import AuxiliaryEquipment from "./AuxiliaryEquipment";
import { hvacTabs } from "./hvacConstants";
import { useHvacSystem } from "../../Context/HvacSystemProvider";

const TabBar = () => {
  const {
    key,
    setKey,
    isCompleteHeating,
    isCompleteCooling,
    isCompleteVentilation,
    isCompleteHumidification,
    isCompleteAuxi,
  } = useHvacSystem();

  const HeatingWarmWaterTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          {isCompleteHeating && (
            <img src="assets/img/hvac/checked-verified.svg" alt="" />
          )}
        </div>
        <img
          src={
            key === hvacTabs.heating
              ? "assets/img/hvac/heating.svg"
              : "assets/img/hvac/heating-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === hvacTabs.heating ? "selectedTab" : ""}`}>
          HEATING & WARM WATER
        </span>
      </div>
    );
  };
  const CoolingTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          {isCompleteCooling && (
            <img src="assets/img/hvac/checked-verified.svg" alt="" />
          )}
        </div>
        <img
          src={
            key === hvacTabs.cooling
              ? "assets/img/hvac/cooling.svg"
              : "assets/img/hvac/cooling-dark.svg"
          }
          alt="tab-icon"
        />
        <span className={`${key === hvacTabs.cooling ? "selectedTab" : ""}`}>
          COOLING
        </span>
      </div>
    );
  };
  const VentilationTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          {isCompleteVentilation && (
            <img src="assets/img/hvac/checked-verified.svg" alt="" />
          )}
        </div>
        <img
          src={
            key === hvacTabs.ventilation
              ? "assets/img/hvac/ventilator.svg"
              : "assets/img/hvac/ventilator-dark.svg"
          }
          alt="tab-icon"
        />
        <span
          className={`${key === hvacTabs.ventilation ? "selectedTab" : ""}`}
        >
          VENTILATION
        </span>
      </div>
    );
  };
  const HumidificationTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          {isCompleteHumidification && (
            <img src="assets/img/hvac/checked-verified.svg" alt="" />
          )}
        </div>
        <img
          src={
            key === hvacTabs.humidification
              ? "assets/img/hvac/humidification.svg"
              : "assets/img/hvac/humidification-dark.svg"
          }
          alt="tab-icon"
        />
        <span
          className={`${key === hvacTabs.humidification ? "selectedTab" : ""}`}
        >
          HUMIDIFICATION
        </span>
      </div>
    );
  };
  const AuxiliaryEquipmentTabTitle = () => {
    return (
      <div className="tabTitle">
        <div className="verified-tab">
          {isCompleteAuxi && (
            <img src="assets/img/hvac/checked-verified.svg" alt="" />
          )}
        </div>
        <img
          src={
            key === hvacTabs.auxiliary_equipment
              ? "assets/img/hvac/motor.svg"
              : "assets/img/hvac/motor-dark.svg"
          }
          alt="tab-icon"
        />
        <span
          className={`${
            key === hvacTabs.auxiliary_equipment ? "selectedTab" : ""
          }`}
        >
          AUXILIARY EQUIPMENT
        </span>
      </div>
    );
  };
  return (
    <Tabs
      defaultActiveKey={hvacTabs.heating}
      transition={false}
      id="noanim-tab-example"
      fill
      onSelect={(k) => setKey(k)}
    >
      <Tab
        transition={false}
        eventKey={hvacTabs.heating}
        title={<HeatingWarmWaterTabTitle />}
      >
        <HeatingWarm />
      </Tab>
      <Tab
        transition={false}
        eventKey={hvacTabs.cooling}
        title={<CoolingTabTitle />}
      >
        <Cooling />
      </Tab>
      <Tab
        transition={false}
        eventKey={hvacTabs.ventilation}
        title={<VentilationTabTitle />}
      >
        <Ventilation />
      </Tab>
      <Tab
        transition={false}
        eventKey={hvacTabs.humidification}
        title={<HumidificationTabTitle />}
      >
        <Humidification />
      </Tab>
      <Tab
        transition={false}
        eventKey={hvacTabs.auxiliary_equipment}
        title={<AuxiliaryEquipmentTabTitle />}
      >
        <AuxiliaryEquipment />
      </Tab>
    </Tabs>
  );
};

export default TabBar;
