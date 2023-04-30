import React from "react";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import "./index.css";
import TabBar from "./TabBar";
import ShowDetails from "./ShowDetails";
import LoadingCover from "../LoadingCover";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import SaveProjectConfirmationPopup from "../SaveProjectConfirmationPopup";
import CreateConfigurationPopup from "../CreateConfigurationPopup";
import { hvacTabs } from "./hvacConstants";

const HVAC = () => {
  const {
    loading,
    showConfirmModal,
    setShowConfirmModal,
    handleAddNewConfig,
    onCloseConfigModalHandler,
    onCreateNewConfigModalHandler,
    isShowCreateConfig,
    handleSubmitHvacData,
    key,
  } = useHvacSystem();

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
                {(key === hvacTabs.heating ||
                  key === hvacTabs.auxiliary_equipment) && <ShowDetails />}
              </div>
            </div>
          </div>
        </section>
      </div>
      {showConfirmModal && (
        <SaveProjectConfirmationPopup
          isShow={showConfirmModal}
          onCloseModalHandler={() => setShowConfirmModal(false)}
          handleSaveConfig={() => handleSubmitHvacData()}
          handleAddNewConfig={handleAddNewConfig}
        />
      )}
      {isShowCreateConfig && (
        <CreateConfigurationPopup
          isShow={isShowCreateConfig}
          onCloseModalHandler={onCloseConfigModalHandler}
          onCreateNewConfigModalHandler={onCreateNewConfigModalHandler}
        />
      )}
      <LoadingCover show={loading} />
    </div>
  );
};
export default HVAC;
