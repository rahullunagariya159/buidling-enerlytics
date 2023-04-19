import React, { useEffect, useState, useRef } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { set3dJSONData, get3dJSONData } from "./Services/UserService";
import { addProjectConfiguration } from "./Services/ProjectServices";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import ReactTooltip from "react-tooltip";
import { Auth } from "aws-amplify";
import LeftSidebar from "./LeftSidebar";
import BuildingApp from "../BuildingApp";
import { useAuth } from "../Context/AuthProvider";
import SaveProjectConfirmationPopup from "./SaveProjectConfirmationPopup";
import LoadingCover from "./LoadingCover";
import CreateConfigurationPopup from "./CreateConfigurationPopup";

function BEModal() {
  const threeDRef = useRef();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [b3Data, setB3Data] = useState(null);
  const [b3APIData, setb3APIB3Data] = useState(null);
  const [btnClicked, setBtnClicked] = useState(false);
  const [projectStatus, setProjectStatus] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const projectName = searchParams.get("name") ? searchParams.get("name") : "";
  const isGuestUser = searchParams.get("skip") || false;
  const projectData = ReactSession.get("bp3dJson");
  const [userID, setUserId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isShowCreateConfig, setIsCreateShowConfig] = useState(false);
  const location = useLocation();
  const isEdit = ReactSession.get("isedit_project_config");
  const isView = ReactSession.get("isview_project_config");
  const { userId } = useAuth();

  const handleNextClick = async () => {
    setShowConfirmModal(false);
    let canvasElm = document.querySelector("#canvas3D canvas");
    let image = canvasElm.toDataURL("image/jpeg");

    threeDRef.current.handleSaveJson();

    if (!b3Data && projectData && projectData !== "null") {
      setB3Data(projectData);
    }

    const configurationID = await ReactSession.get("configuration_id");

    if (b3Data || (projectData && projectData !== "null")) {
      const payload = {
        configurationId: configurationID,
        userId: userID,
        data: projectData,
        image: image,
      };
      setShowLoader(true);

      set3dJSONData(payload)
        .then((response) => {
          if (response.error) {
            toast.error(response.error);
          } else {
            if (isGuestUser) {
              setTimeout(
                navigate({
                  pathname: "/building-material",
                  search: "?name=" + projectName + "&&skip=true",
                  state: b3Data,
                }),
                2000,
              );
            } else {
              setTimeout(
                navigate({
                  pathname: "/building-material",
                  search: "?name=" + projectName,
                  state: b3Data,
                }),
                2000,
              );
            }
          }
        })
        .catch((error) => {
          console.log({ error });
        })
        .finally(() => {
          // setBtnClicked(false);
          setShowLoader(false);
        });
    }
  };

  const onCloseConfigModalHandler = () => {
    setIsCreateShowConfig(false);
  };

  const onCreateNewConfigModalHandler = async () => {
    await handleNextClick();
  };

  const handleAddNewConfig = async () => {
    setShowConfirmModal(false);
    setIsCreateShowConfig(true);
  };

  const handleProccedBEModal = async () => {
    if (isEdit) {
      const localAPIStringifyData = await ReactSession.get("APIbp3dJson");
      const newLocalStringifyData = await ReactSession.get("bp3dJson");
      const newStringfyData = newLocalStringifyData.toString();
      const apiStringifyData = localAPIStringifyData.toString();
      const isDifferent = newStringfyData.localeCompare(apiStringifyData);

      if (isEdit && isDifferent === -1) {
        setShowConfirmModal(true);
      } else if (isEdit && isDifferent === 0) {
        if (isGuestUser) {
          setTimeout(
            navigate({
              pathname: "/building-material",
              search: "?name=" + projectName + "&&skip=true",
              state: b3Data,
            }),
            2000,
          );
        } else {
          setTimeout(
            navigate({
              pathname: "/building-material",
              search: "?name=" + projectName,
              state: b3Data,
            }),
            2000,
          );
        }
      }
    } else {
      handleNextClick();
    }
  };

  const handleGet3dJSONData = async (ID) => {
    const configurationID = await ReactSession.get("configuration_id");

    if (!configurationID) {
      return false;
    }
    const payload = {
      configurationId: configurationID,
      userId: ID,
    };

    get3dJSONData(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        // console.log(response);
        if (response?.data?.data?.S) {
          setB3Data(response?.data?.data?.S);
          ReactSession.set("bp3dJson", response?.data?.data?.S);
          ReactSession.set("APIbp3dJson", response?.data?.data?.S);
          setb3APIB3Data(response?.data?.data?.S);
          setTimeout(setProjectStatus(true), 1000);
        }
      }
    });
  };

  const handleCallback = (childData) => {
    if (childData) {
      setB3Data(childData);
      setProjectStatus(true);
    }
  };

  const returnToModelFullScreen = () => {
    threeDRef.current.handleSaveJson();

    if (!b3Data && projectData && projectData !== "null") {
      setB3Data(projectData);
    }

    if (isGuestUser) {
      setTimeout(
        navigate({
          pathname: "/be-model",
          search: "?name=" + projectName + "&&skip=true",
          state: b3Data,
        }),
        2000,
      );
    } else {
      setTimeout(
        navigate({
          pathname: "/be-model",
          search: "?name=" + projectName,
          state: b3Data,
        }),
        2000,
      );
    }
  };

  useEffect(() => {
    let IDVal;
    if (isGuestUser) {
      IDVal = ReactSession.get("guest_user_id");
      setUserId(IDVal);
    } else {
      IDVal =
        ReactSession.get("building_user") &&
        ReactSession.get("building_user") !== "null"
          ? ReactSession.get("building_user")
          : ReactSession.get("building_social_user");
      setUserId(IDVal);
    }

    setProjectStatus(
      (projectData && projectData !== "null" && projectData.length) || false,
    );

    if (!location?.state?.isFromBeFullScreen) {
      handleGet3dJSONData(IDVal);
    }

    Auth.currentSession()
      .then((data) => {
        ReactSession.set("is_logged_in", "true");
      })
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="main-parant-11">
        <section className="sec-1">
          <div className="container-be ">
            <div className="">
              <div className="left-side-bar-container">
                <LeftSidebar module="BE" />
              </div>
              <div className="be-modal">
                {/* //BE-Modal here */}
                <ReactTooltip id="registerTip" place="top" effect="solid">
                  Enter drawing mode
                </ReactTooltip>
                <div
                  data-tip
                  data-for="registerTip"
                  className="edit-model-btn clickable cursor-pointer"
                  onClick={returnToModelFullScreen}
                >
                  {/* <img src="assets/img/Home-Page/homeFinal/edit.svg" alt="" />ENTER DRAWING MODE */}
                  <img
                    src="assets/img/BeModel/layout_21@2x.png"
                    alt="Submit and Exit Drawing Mode"
                    className="clickable"
                  />
                </div>
                <div className="be-model-containter be-min">
                  <BuildingApp
                    parentCallback={handleCallback}
                    hideLeftToolBar="true"
                    loadCalled={projectStatus}
                    ref={threeDRef}
                  />
                </div>
                {/* <div className='image-canvas'>
                  <img src={canvasImage}></img>
                </div> */}
                <div className="modal-next-container container-min">
                  {!isView && (
                    <a
                      className="btn next-btnes"
                      onClick={handleProccedBEModal}
                    >
                      Proceed
                    </a>
                  )}

                  {/* {btnClicked && (
                    <a className="btn next-btnes btn-disabled">
                      <i className="fa fa-spinner fa-spin"></i> Please Wait ...
                    </a>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {showConfirmModal && (
        <SaveProjectConfirmationPopup
          isShow={showConfirmModal}
          onCloseModalHandler={() => setShowConfirmModal(false)}
          handleSaveConfig={handleNextClick}
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
      <LoadingCover show={showLoader} />
    </div>
  );
}

export default BEModal;
