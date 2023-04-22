import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import HeatingWarm from "./HeatingWarm";
import Cooling from "./Cooling";
import Ventilation from "./Ventilation";
import Humidification from "./Humidification";
import AuxiliaryEquipment from "./AuxiliaryEquipment";

const TabBar = () => {
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
