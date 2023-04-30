import React from "react";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import "./index.css";
import TabBar from "./TabBar";
import RoomsConfirmation from "./RoomsConfirmation";
import OperatingHours from "./OperatingHours";

const Rooms = () => {
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
                    <TabBar />
                  </div>
                </div>
                <div className="roomTabContent">
                  <div className="roomTabContentInfo">
                    <OperatingHours />
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
