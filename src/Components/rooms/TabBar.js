import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useState } from "react";

const TabBar = ({ setTab }) => {
  const [key, setKey] = useState("operatingHours");
  const tabData = [
    {
      id: 1,
      eventKeyName: "operatingHours",
      name: "Operating hours",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/operatingHours.svg",
    },
    {
      id: 2,
      eventKeyName: "indoorClimateSettings",
      name: "Indoor Climate Settings",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/indoorClimateSettings.svg",
    },
    {
      id: 3,
      eventKeyName: "ventilation",
      name: "Ventilation",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/ventilation.svg",
    },
    {
      id: 4,
      eventKeyName: "warmWater",
      name: "Warm Water",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/warmWater.svg",
    },
    {
      id: 5,
      eventKeyName: "lighting",
      name: "Lighting",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/lighting.svg",
    },
    {
      id: 6,
      eventKeyName: "electricAppliances",
      name: "Electric Appliances",
      icon: "assets/img/rooms/electricAppliancesDark.svg",
      selectedIcon: "assets/img/rooms/electricAppliances.svg",
    },
    {
      id: 7,
      eventKeyName: "sunlightProtection",
      name: "Sunlight Protection",
      icon: "assets/img/rooms/operatingHoursDark.svg",
      selectedIcon: "assets/img/rooms/lighting.svg",
    },
  ];
  const TabTitle = ({ info }) => {
    return (
      <div className="tabTitle">
        <img
          src={key === info?.eventKeyName ? info.selectedIcon : info.icon}
          alt="tab-icon"
        />
        <span className={`${key === info?.eventKeyName ? "selectedTab" : ""}`}>
          {info?.name}
        </span>
      </div>
    );
  };

  return (
    <>
      <Tabs
        defaultActiveKey={tabData[0].eventKeyName}
        transition={false}
        fill
        onSelect={(k) => {
          setKey(k);
          setTab(k);
        }}
      >
        {tabData.map((items, index) => {
          return (
            <Tab
              key={index}
              transition={false}
              eventKey={items.eventKeyName}
              title={<TabTitle info={items} />}
            ></Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default TabBar;
