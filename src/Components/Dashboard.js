import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProject,
  listProjects,
  updateGuestLogin,
} from "./Services/UserService";
import { validateInput } from "../config";
import Navbar from "./Navbar";
import { useAuth } from "../Context/AuthProvider";
import Text from "./Text";
import { somethingWentWrongError } from "../Constants";
import LinkButton from "./LinkButton";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectList, setProjectList] = useState([]);
  const [createProjectClicked, setCreateProjectClicked] = useState(false);
  const [createProjectError, setCreateProjectError] = useState("");
  const [checkProjectListLoading, setCheckProjectListLoading] = useState(true);

  const isGuestUser = searchParams.get("skip") || false;

  const { userId: userID } = useAuth();

  const handleCreateProjectForGuest = () => {
    setCreateProjectError("");
    let guestUserId = `${Math.floor(Date.now() / 1000)}`;
    ReactSession.set("guest_user_id", guestUserId);
    setCreateProjectClicked(true);

    const guestProjectName = "guest" + new Date().getTime();
    const payload = {
      name: guestProjectName,
      userId: guestUserId,
    };

    createProject(payload)
      .then((response) => {
        setCreateProjectClicked(false);
        if (response.error) {
          setCreateProjectError(response.error);
        } else {
          if (response && response.msg) {
            ReactSession.set("project_id", response.msg[0].id);
            if (isGuestUser) {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" + guestProjectName + "&&skip=true"),
                2000,
              );
            } else {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" + guestProjectName),
                2000,
              );
            }
          }
        }
      })
      .catch((err) => {
        setCreateProjectClicked(false);
        setCreateProjectError(somethingWentWrongError);
      });
  };

  const handleCreateProject = () => {
    setCreateProjectError("");
    let projectNameElm = document.getElementById("projectName");
    let checkPName = validateInput(projectNameElm);

    if (checkPName) {
      const payload = {
        name: projectNameElm.value,
        userId: userID,
      };

      createProject(payload)
        .then((response) => {
          if (response.error) {
            setCreateProjectError(response.error);
          } else {
            if (response && response.msg) {
              ReactSession.set("project_id", response.msg[0].id);
              if (isGuestUser) {
                setTimeout(
                  (window.location.href =
                    "/create-project?name=" +
                    projectNameElm.value +
                    "&&skip=true"),
                  2000,
                );
              } else {
                setTimeout(
                  (window.location.href =
                    "/create-project?name=" + projectNameElm.value),
                  2000,
                );
              }
            }
          }
        })
        .catch((error) => {
          setCreateProjectError(error || somethingWentWrongError);
        });
    } else {
      setCreateProjectError("Please enter a project name.");
    }
  };

  const handleListProjects = (ID) => {
    const payload = {
      userId: ID,
    };
    setCheckProjectListLoading(true);
    listProjects(payload)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          // data comes here..
          setProjectList(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setCheckProjectListLoading(false);
      });
  };

  const handleUpdateGuestLogin = () => {
    const payload = {
      id: ReactSession.get("project_id"),
      userId: userID,
    };
    updateGuestLogin(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        ReactSession.set("guest_user_id", null);

        const path = ReactSession.get("guest_state");
        navigate(path);
      }
    });
  };

  useEffect(() => {
    ReactSession.set("bp3dJson", null);

    var input = document.getElementById("projectName");
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCreateProject();
      }
    });

    if (ReactSession.get("is_logged_in")) {
      if (ReactSession.get("guest_user_id")) {
        handleUpdateGuestLogin();
      }
    }
  }, []);

  useEffect(() => {
    if (userID) {
      handleListProjects(userID);

      if (
        ReactSession.get("is_logged_in") &&
        ReactSession.get("login_method") === "google" &&
        ReactSession.get("guest_user_id")
      ) {
        handleUpdateGuestLogin();
      }
    }
  }, [userID]);

  return (
    <div>
      <Navbar />

      <div className="main-parant-9">
        <section className="sec-1">
          <div className="breadcrumb-top">
            <p className="top-home pt-3 text-left">
              {"Home > Building Modeler"}
            </p>
          </div>
          <div className="container brdr-bottom">
            <div className="row">
              <div className="col-lg-12">
                {/* <div>
                  <p className="top-home pt-3 text-left">{'Home > Building Modeler'}</p>
                </div> */}
                <div className="cntr-area">
                  <div className="modeler-box">
                    <div className="grid-wlcm">
                      <h1 className="WELCOME-title">
                        WELCOME T<span className="botm-brdr">O THE </span>
                        <span className="cimr">
                          BE Modeler{" "}
                          <sup>
                            <img src="" className="rr2" alt="" />
                          </sup>
                        </span>
                      </h1>
                      <p className="wlcm-pra p-1">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting
                        <span className="block-indus">
                          industry. Lorem Ipsum has been the industry's.
                        </span>
                      </p>
                    </div>
                    <div className="PROJECT-btns">
                      {!isGuestUser && (
                        <a
                          data-bs-toggle="modal"
                          data-bs-target="#STARTPROJECT"
                          className="PROJECT-one"
                        >
                          START NEW PROJECT
                        </a>
                      )}
                      {isGuestUser !== false && !createProjectClicked && (
                        <a
                          className="PROJECT-one"
                          onClick={handleCreateProjectForGuest}
                        >
                          START NEW PROJECT
                        </a>
                      )}
                      {isGuestUser !== false && createProjectClicked && (
                        <a className="PROJECT-one loading-button">
                          <i className="fa fa-spinner fa-spin"></i> START NEW
                          PROJECT
                        </a>
                      )}

                      <LinkButton
                        id="loadProjects"
                        title="LOAD AN EXISTING PROJECT"
                        className="PROJECT-one tow load-existing"
                        onClick={() => navigate("/load-project")}
                        isDisable={
                          isGuestUser ||
                          projectList.length === 0 ||
                          !userID ||
                          checkProjectListLoading
                            ? true
                            : false
                        }
                        isLoading={checkProjectListLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="STARTPROJECT"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog project">
          <div className="modal-content signin START project">
            <div>
              <button
                type="button clickable"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="project-content">
              <div></div>
              <div>
                <div className="modal-header-flex">
                  <h1 className="start-title">
                    <span className="botm-brdr">Create n</span>ew project
                  </h1>
                </div>
                <div className="start-grid">
                  <div>
                    <input
                      type="text"
                      id="projectName"
                      placeholder="Project Name"
                      className="Project-input pop-create"
                      onChange={() => setCreateProjectError("")}
                    />
                  </div>
                  {/* <div className="positionq">
                <input type="text" placeholder="Project Type" className="Project-input" />
                <img src="assets/img/Home-Page/homeFinal/Path 42.svg" className="arrow-ic" alt="" />
              </div> */}
                </div>
                <Text type="error" text={createProjectError} />

                <div className="my-5">
                  <a
                    className="CONTINUE-btn clickable"
                    onClick={() => {
                      !userID && !createProjectClicked
                        ? handleCreateProjectForGuest()
                        : handleCreateProject();
                    }}
                  >
                    CONTINUE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
