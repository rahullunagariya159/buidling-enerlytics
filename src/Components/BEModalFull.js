import React, { useEffect, useState, useRef } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate, useSearchParams } from "react-router-dom";
import { set3dJSONData, get3dJSONData } from "./Services/UserService";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { Auth } from "aws-amplify";
import BuildingApp from "../BuildingApp";

function BEModalFull() {
  const threeDRef = useRef();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [b3Data, setB3Data] = useState(null);
  const [userID, setUserId] = useState("");
  const [projectStatus, setProjectStatus] = useState(null);
  const projectName = searchParams.get("name") ? searchParams.get("name") : "";
  const isGuestUser = searchParams.get("skip") || false;
  const projectData = ReactSession.get("bp3dJson");

  const handleNextClick = () => {
    threeDRef.current.handleSaveJson();

    if (!b3Data && projectData && projectData !== "null") {
      setB3Data(projectData);
    }

    if (isGuestUser) {
      setTimeout(
        navigate({
          pathname: "/create-project",
          search: "?name=" + projectName + "&&skip=true",
          state: b3Data,
        }),
        2000,
      );
    } else {
      setTimeout(
        navigate(`/create-project?name=${projectName}`, {
          state: { b3Data, isFromBeFullScreen: true },
        }),
        // navigate({
        //   pathname: "/create-project",
        //   search: "?name=" + projectName,
        //   state: { b3Data, isFromBeFullScreen: true },
        // }),
        2000,
      );
    }
  };

  const handleGet3dJSONData = async (ID) => {
    const configurationID = await ReactSession.get("configuration_id");
    const payload = {
      configurationId: configurationID,
      userId: ID,
    };

    get3dJSONData(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        console.log(response);
        if (response?.data?.data?.S) {
          setB3Data(response?.data?.data?.S);
          ReactSession.set("bp3dJson", response?.data?.data?.S);
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
    // handleGet3dJSONData(IDVal);

    Auth.currentSession()
      .then((data) => {
        ReactSession.set("is_logged_in", "true");
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-parant-11">
        <section className="sec-1">
          <div className="container-be BEmodal-container">
            <div className="row">
              <div className="col-lg-12 be-full-container">
                {/* //BE-Modal here */}
                <div className="be-model-main">
                  <BuildingApp
                    parentCallback={handleCallback}
                    loadCalled={projectStatus}
                    ref={threeDRef}
                  />
                </div>
                <div className="modal-next-container-full">
                  <img
                    src="assets/img/BeModel/layout_22@2x.png"
                    alt="Submit and Exit Drawing Mode"
                    className="clickable"
                    onClick={handleNextClick}
                  />
                  {/* <a className="btn next-btnes drawing-mode" onClick={handleNextClick}>SUBMIT & EXIT DRAWING MODE</a> */}
                  {/* disabled={!projectStatus} */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BEModalFull;
