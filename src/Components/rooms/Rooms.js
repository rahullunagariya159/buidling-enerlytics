import React from "react";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import "./index.css";
import TabBar from "./TabBar";
import RoomsConfirmation from "./RoomsConfirmation";
import OperatingHours from "./OperatingHours";
import IndoorClimateSettings from "./IndoorClimateSettings";
import Ventilation from "./Ventilation";
import WarmWater from "./WarmWater";
import Lighting from "./Lighting";
import ElectricAppliances from "./ElectricAppliances";
import SunlightProtection from "./SunlightProtection";
import { useState } from "react";

const Rooms = () => {
  const [tab, setTab] = useState("operatingHours");
  console.log("=>", tab);
  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="main-building">
              <div className="left-side-bar-container">
                <LeftSidebar module="RM" />
              </div>
              <div className="rooms-content">
                <div className="rooms-header">
                  <div className="roomTitle">Form Filled</div>
                  <div className="roomsTab-wrapper">
                    <TabBar setTab={setTab} />
                  </div>
                </div>
                <div className="roomTabContent">
                  <div className="roomTabContentInfo">
                    {tab === "operatingHours" && <OperatingHours />}
                    {tab === "indoorClimateSettings" && (
                      <IndoorClimateSettings />
                    )}
                    {tab === "ventilation" && <Ventilation />}
                    {tab === "warmWater" && <WarmWater />}
                    {tab === "lighting" && <Lighting />}
                    {tab === "electricAppliances" && <ElectricAppliances />}
                    {tab === "sunlightProtection" && <SunlightProtection />}
                  </div>
                  <RoomsConfirmation />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Rooms;
