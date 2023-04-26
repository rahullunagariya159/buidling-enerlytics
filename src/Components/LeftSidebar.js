import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate, useSearchParams } from "react-router-dom";
import { updateProjectName } from "./Services/UserService";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "./Button";
import { Routes } from "../navigation/Routes";

function LeftSidebar(props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectName = searchParams.get("name") ? searchParams.get("name") : "";
  const selectedModule = props.module;
  const modulesList = ["BE", "BM", "HV", "EG", "BT", "RM"];
  const index = modulesList.indexOf(selectedModule);
  modulesList.length = index;
  const isGuestUser = searchParams.get("skip") || false;
  const [enableEditProjectName, setEnableEdit] = useState(false);
  const [projectUpdLoading, setProjectUpdLoading] = useState(false);

  const navigateToDashboard = () => {
    if (isGuestUser) {
      navigate({ pathname: "/", search: "?skip=true" });
    } else {
      navigate(`${Routes.dashboard}`);
    }
  };

  const navigateToProject = () => {
    if (isGuestUser) {
      navigate({
        pathname: `${Routes.createProject}`,
        search: "?name=" + projectName + "&&skip=true",
      });
    } else {
      navigate({
        pathname: `${Routes.createProject}`,
        search: "?name=" + projectName,
      });
    }
  };
  const navigateToBuilding = () => {
    navigate({
      pathname: `${Routes.buildingMaterial}`,
      search: "?name=" + projectName,
    });
  };
  const navigateToHVAC = () => {
    navigate({
      pathname: `${Routes.hvac}`,
      search: "?name=" + projectName,
    });
  };

  const handleUpdateProjectName = () => {
    const elm = document.getElementById("newProjectName");
    if (!elm.value) {
      return false;
    }
    const payload = {
      id: ReactSession.get("project_id"),
      name: elm.value,
    };
    setProjectUpdLoading(true);
    updateProjectName(payload)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          if (isGuestUser) {
            setSearchParams(
              `?${new URLSearchParams({ name: elm.value, skip: true })}`,
            );
          } else {
            setSearchParams(`?${new URLSearchParams({ name: elm.value })}`);
          }

          // toast.success('Project name successfully updated.');
          setEnableEdit(false);
        }
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setProjectUpdLoading(false);
      });
  };

  const handleProjectNameEdit = () => {
    setEnableEdit(true);
  };

  useEffect(() => {
    modulesList.forEach((e) => {
      document.querySelector(`#${e} .be-status`).classList.add("completed");
    });
    document.getElementById(selectedModule).classList.add("active");
  }, []);

  return (
    <div className="side-left">
      <div>
        <p className="top-home text-left nav-left">
          <a className="clickable" onClick={navigateToDashboard}>
            Home
          </a>
          {selectedModule === "BE"
            ? " > Building Model"
            : selectedModule === "BM"
            ? " > Building Material"
            : selectedModule === "HV"
            ? " > HVAC(HEATING, A/C, VENTILATION) SYSTEM"
            : ""}
        </p>
      </div>
      <div className="Project-Name-box">
        <p className="Name-titlew">Project Name</p>
        {enableEditProjectName ? (
          <div>
            <input
              id="newProjectName"
              className="sign-in-input w-100"
              defaultValue={projectName}
            />
            <Button
              className="edit-name-btn"
              title="Submit"
              onClick={handleUpdateProjectName}
              isLoading={projectUpdLoading}
              isDisable={projectUpdLoading}
            />

            <button
              className="edit-name-btn"
              onClick={() => setEnableEdit(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <a className="edit-btn clickable">
            {projectName}
            <img
              src={`assets/img/Home-Page/homeFinal/edit.svg`}
              alt=""
              onClick={handleProjectNameEdit}
            />
          </a>
        )}
        <p className="top-home clr">
          Last Edited {format(new Date(), "d MMM, yy")}
        </p>
      </div>
      <div className="brdrt">
        <div id="BE" className="side-link-flex" onClick={navigateToProject}>
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "BE" ? "home-white.png" : "home.svg"
              }`}
              alt=""
            />
            <a className="MODELw">BUILDING MODEL</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
        <div id="BM" className="side-link-flex" onClick={navigateToBuilding}>
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "BM" ? "wall-white.svg" : "wall.svg"
              }`}
              alt=""
            />
            <a className="MODELw">BUILDING MATERIAL</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
        <div id="HV" className="side-link-flex" onClick={navigateToHVAC}>
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "HV" ? "wind-white.svg" : "wind.svg"
              }`}
              alt=""
            />
            <a className="MODELw">HVAC(HEATING, A/C, VENTILATION) SYSTEM</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
        <div id="EG" className="side-link-flex">
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "EG" ? "energy-white.png" : "energy.svg"
              }`}
              alt=""
            />
            <a className="MODELw">ENERGY GENERATION & CONVERSION</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
        <div id="BT" className="side-link-flex">
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "BT" ? "building-white.png" : "Layer 2.svg"
              }`}
              alt=""
            />
            <a className="MODELw">BUILDING TYPE</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
        <div id="RM" className="side-link-flex">
          <div className="flex-side">
            <img
              className="side-icon"
              src={`assets/img/Home-Page/homeFinal/${
                selectedModule === "RM" ? "bed-white.png" : "bed.svg"
              }`}
              alt=""
            />
            <a className="MODELw">ROOMS</a>
          </div>
          <div className="be-status">
            <a>
              <img
                src="assets/img/Home-Page/homeFinal/checked, verified.svg"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>
      <div className="serach">
        <div>
          <div className="side-link-flex">
            <div className="flex-side">
              <img
                src="assets/img/Home-Page/homeFinal/magnifier.svg"
                className="okik"
                alt=""
              />
              <a className="Analysis">Analysis Setup</a>
            </div>
          </div>
          <div className="side-link-flex">
            <div className="flex-side">
              <img
                src="assets/img/Home-Page/homeFinal/bar chart analytic.svg"
                className="okik"
                alt=""
              />
              <a className="Analysis">Result</a>
            </div>
          </div>
        </div>
        {/* <div className="side-link-flex">
          <a className="need-btn">Need Help?</a>
        </div> */}
      </div>
    </div>
  );
}

export default LeftSidebar;
