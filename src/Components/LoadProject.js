import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate } from "react-router-dom";
import { listProjects } from "./Services/UserService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Navbar from "./Navbar";
import { useAuth } from "../Context/AuthProvider";

function LoadProject() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [btnClass, setBtnClass] = useState("btn-disabled");
  const [configSelected, setConfigSelected] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const { userId: userID } = useAuth();

  const handleCardClick = (selectedItem, index) => {
    setSelectedProjects(selectedItem);
    const elm = document.querySelectorAll(".card-container-selected");
    elm.forEach((element) => {
      element.classList.remove("active");
    });

    console.log(selectedItem);

    if (!selectedItem.configurations.length) {
      setBtnClass("btn-disabled");
      setConfigSelected(0);
    } else {
      setBtnClass("clickable");
      setConfigSelected(1);
    }
    document.querySelector(`.selected-item-${index}`).classList.add("active");
  };

  const handleListProjects = (ID) => {
    const payload = {
      userId: ID,
    };
    listProjects(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        if (response?.data?.length > 0) {
          console.log(response);
          setProjectList(response?.data);
          setSelectedProjects(response?.data?.[0]);
          document.querySelector(`.selected-item-0`).classList.add("active");
        }
      }
    });
  };

  const handleLoadProject = () => {
    if (selectedProjects?.id) {
      ReactSession.set("project_id", selectedProjects.id);
      setTimeout(
        (window.location.href = "/be-model?name=" + selectedProjects?.name),
        2000,
      );
    }
  };

  const handleConfigSelect = (value) => {
    console.log(value);
    if (value) {
      setConfigSelected(1);
      setBtnClass("clickable");
    } else {
      setConfigSelected(0);
      setBtnClass("btn-disabled");
    }
  };

  useEffect(() => {
    let IDVal =
      ReactSession.get("building_user") &&
      ReactSession.get("building_user") !== "null"
        ? ReactSession.get("building_user")
        : ReactSession.get("building_social_user");

    if (ReactSession.get("is_logged_in") && userID) {
      handleListProjects(userID);
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-parant-new-1">
        <section className="sec-1">
          <div>
            <p className="top-home pt-3 text-left">
              <a className="clickable" onClick={() => navigate("/dashboard")}>
                Home
              </a>
              {" > Existing Projects"}
            </p>
          </div>
          <div className="container-load brdr-bottom full">
            <div className="row">
              <div className="col-lg-12 p-0">
                <div className="EXISTING-grid">
                  <div className="">
                    <h6 className="EXISTING-title">EXISTING PROJECTS</h6>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-lg-5 p-0">
                    <div className="EXISTING-left-box">
                      <div className="Select-flexed">
                        <div className="Search-pos">
                          <input
                            type="text"
                            placeholder="Search project"
                            className="Search-project"
                          />
                          <img
                            src="assets/img/LoadExisting/search.png"
                            className="search-ic"
                            alt=""
                          />
                        </div>
                        <div className="Select-flex">
                          <a className="Select-12px">Select</a>
                          <img
                            src="assets/img/LoadExisting/filter.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="EXISTING-card-all">
                      {projectList.map((item, index) => (
                        <div
                          className={`first-card1 card-container-selected selected-item-${index}`}
                          key={index}
                          onClick={() => handleCardClick(item, index)}
                        >
                          <div>
                            {/* <img src="assets/img/LoadExisting/3d Project page.png" className="w3d-Project" alt="" /> */}
                            <img
                              src={
                                item &&
                                item.configurations &&
                                item.configurations.length
                                  ? item.configurations[0].image
                                  : "assets/img/LoadExisting/3d Project page.png"
                              }
                              className="w3d-Project"
                              alt=""
                            />
                          </div>
                          <div className="lest-flex">
                            <div className="lest-flex1">
                              <p className="STELLA-titr">{item.name}</p>
                              <img
                                src="assets/img/LoadExisting/Group 431.svg"
                                className="dots-11px"
                                alt=""
                              />
                            </div>
                            <div className="lest-grid">
                              <div className="lestgrid-1">
                                <p className="lest-pra-9px">Location</p>
                                <p className="lest-pra-9px">Simulation time</p>
                                <p className="lest-pra-9px">Created</p>
                                <p className="lest-pra-9px">Last edited</p>
                                <p className="lest-pra-9px">Configurations</p>
                              </div>
                              <div className="lestgrid-1">
                                <p className="lest-pra-8px">-</p>
                                <p className="lest-pra-8px">
                                  {item &&
                                    item.updated_at &&
                                    format(
                                      new Date(parseInt(item.updated_at)),
                                      "d MMM, yy",
                                    )}{" "}
                                  -{" "}
                                  {item &&
                                    item.created_at &&
                                    format(
                                      new Date(parseInt(item.created_at)),
                                      "d MMM, yy",
                                    )}
                                </p>
                                <p className="lest-pra-8px">
                                  {item &&
                                    item.created_at &&
                                    format(
                                      new Date(parseInt(item.created_at)),
                                      "d MMM, yy",
                                    )}
                                </p>
                                <p className="lest-pra-8px">
                                  {item &&
                                    item.updated_at &&
                                    format(
                                      new Date(parseInt(item.updated_at)),
                                      "d MMM, yy",
                                    )}
                                </p>
                                <p className="lest-pra-8px">
                                  {item.configurations.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-7 p-0">
                    <div className="configuration-right-side">
                      <div className="Details-brdr">
                        <p className="Select-12px-var bold">Project Details</p>
                      </div>
                      <div className="configuration-box">
                        <div className="padind-24px">
                          <div className="Permanent-delete-flex">
                            <p className="Select-12px-var selected-config">
                              {configSelected} configuration selected
                            </p>
                            <a className="Permanent-btn">
                              Permanent delete{" "}
                              <img
                                src="assets/img/LoadExisting/delete.svg"
                                alt=""
                              />
                            </a>
                          </div>
                          {btnClass === "clickable" ? (
                            <>
                              <div className="small-img-box">
                                <img
                                  src={
                                    selectedProjects?.configurations?.length > 0
                                      ? selectedProjects?.configurations?.[0]
                                          ?.image
                                      : "assets/img/LoadExisting/3d Project page.png"
                                  }
                                  className="w3d-small"
                                  alt=""
                                />
                                <a className="WALIMP">Basic</a>
                                <button className="cancelIcon">X</button>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="five-flex-smae-btn">
                            <a
                              className={`five-btn-s-width ${btnClass}`}
                              onClick={handleLoadProject}
                            >
                              <img
                                src="assets/img/LoadExisting/view.svg"
                                alt=""
                              />
                              View
                            </a>
                            <a
                              className={`five-btn-s-width borders ${btnClass}`}
                              onClick={handleLoadProject}
                            >
                              <img
                                src="assets/img/LoadExisting/edit.svg"
                                alt=""
                              />
                              Edit
                            </a>
                            <a
                              className={`five-btn-s-width borders ${btnClass}`}
                            >
                              <img
                                src="assets/img/LoadExisting/clone.svg"
                                alt=""
                              />
                              Clone
                            </a>
                            <a
                              className={`five-btn-s-width borders ${btnClass}`}
                            >
                              <img
                                src="assets/img/LoadExisting/rename.svg"
                                alt=""
                              />
                              Rename
                            </a>
                          </div>
                        </div>
                        <div className="table-boxew">
                          <div className="grid-8pxs">
                            <p className="STELLA-titr">
                              {selectedProjects?.name}
                            </p>
                            <p className="Select-12px-var">
                              <img
                                src="assets/img/LoadExisting/bulb (1).svg"
                                className="padind-rig"
                                alt=""
                              />{" "}
                              Select up-to two Configurations to Compare
                              Existing Result
                            </p>
                          </div>
                          <div className="main-start-box">
                            <table className="w-100">
                              <thead>
                                <tr className="main-tr-row">
                                  <td className="main-td-head">
                                    CONFIGURATION NAME
                                  </td>
                                  <td className="main-td-head">CREATED</td>
                                  <td className="main-td-head">LAST EDITED</td>
                                  <td className="main-td-head">STATUS</td>
                                  <td className="main-td-head">
                                    RESULTS AVAILABLE
                                  </td>
                                  <td className="main-td-head">ENERGY COST</td>
                                </tr>
                              </thead>
                              {selectedProjects?.configurations?.length > 0 &&
                                selectedProjects?.configurations?.map(
                                  (item, index) => (
                                    <tbody>
                                      <tr className="main-tr-row">
                                        <td className="main-td-title bold">
                                          <div className="Basic-flex">
                                            <input
                                              type="checkbox"
                                              name=""
                                              id="checkConfig"
                                              defaultChecked="true"
                                              onChange={(e) =>
                                                handleConfigSelect(
                                                  e.target.checked,
                                                )
                                              }
                                            />
                                            <span>{item && item.name}</span>
                                          </div>
                                        </td>
                                        <td className="main-td-title">
                                          {item &&
                                            item.created_at &&
                                            format(
                                              new Date(
                                                parseInt(item.created_at),
                                              ),
                                              "d MMM, yy",
                                            )}
                                        </td>
                                        <td className="main-td-title">
                                          {item &&
                                            item.updated_at &&
                                            format(
                                              new Date(
                                                parseInt(item.updated_at),
                                              ),
                                              "d MMM, yy",
                                            )}
                                        </td>
                                        <td className="main-td-title check-disable">
                                          <img
                                            src="assets/img/LoadExisting/checked, verified.svg"
                                            className="padind-rig"
                                            alt=""
                                          />
                                        </td>
                                        <td className="main-td-title">-</td>
                                        <td className="main-td-title black">
                                          -
                                        </td>
                                      </tr>
                                    </tbody>
                                  ),
                                )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoadProject;
