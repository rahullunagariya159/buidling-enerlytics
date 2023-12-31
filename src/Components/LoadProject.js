import React, { useEffect, useRef, useState } from "react";
import { ReactSession } from "react-client-session";
import { orderBy } from "lodash";

import { useNavigate } from "react-router-dom";
import {
  listProjects,
  listProjectConfigurations,
  deleteProject,
  deleteProjectConfiguration,
} from "./Services/ProjectServices";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Navbar from "./Navbar";
import { useAuth } from "../Context/AuthProvider";
import { Modal } from "react-bootstrap";
import LinkButton from "./LinkButton";
import CancelButton from "./CancelButton";
import LoadingCover from "./LoadingCover";
import { Routes } from "../navigation/Routes";
import DeleteProjectModal from "./DeleteProjectModal";
import DeleteConfigurationModal from "./DeleteConfigurationModal";
import {
  FilterDropdown,
  HorizontalLineDropdown,
} from "./myAccount/promoCode/style";

function LoadProject() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [copyProjectList, setCopyProjectList] = useState([]);
  const [btnClass, setBtnClass] = useState("btn-disabled");
  const [configSelected, setConfigSelected] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState({});
  const [projectConfiguration, setProjectConfiguration] = useState([]);
  const { userId: userID } = useAuth();
  const [isShow, invokeModal] = useState(false);
  const [isDelete, setDeleteModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isDeleteProject, setIsDeleteProject] = useState(false);
  const [selectedConfiguration, setSelectedConfiguration] = useState([]);
  const [isDeleteConfig, setIsDeleteConfig] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isNameAsc, setIsNameAsc] = useState(false);
  const [isCreatedDateAsc, setIsCreatedDateAsc] = useState(false);
  const [isLastEditedAsc, setIsLastEditedAsc] = useState(false);

  const handleCardClick = async (selectedItem, index) => {
    setShowLoader(true);
    setSelectedProjects(selectedItem);
    setProjectConfiguration([]);
    const elm = document.querySelectorAll(".card-container-selected");
    elm.forEach((element) => {
      element.classList.remove("active");
    });

    await listProjectConfigurations(selectedItem?.id)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          setBtnClass("clickable");
          // setConfigSelected(1);
          setProjectConfiguration(response?.data?.data);
          setSelectedConfiguration([]);
        } else {
          setBtnClass("btn-disabled");
          // setConfigSelected(0);
        }
        document
          .querySelector(`.selected-item-${index}`)
          .classList.add("active");
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setShowLoader(false);
      });
  };
  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (selected && ref.current && !ref.current.contains(e.target)) {
        setSelected(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside, true);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside, true);
    };
  }, [selected]);
  const handleLoadProject = (
    selProjectConfig,
    isEdit = false,
    isView = false,
  ) => {
    if (selProjectConfig?.id) {
      ReactSession.set("project_id", selProjectConfig?.projectId);
      ReactSession.set("configuration_id", selProjectConfig?.id);

      if (isEdit) {
        ReactSession.set("isedit_project_config", true);
        ReactSession.set("isview_project_config", false);
      } else {
        ReactSession.set("isedit_project_config", false);
      }
      if (isView) {
        ReactSession.set("isview_project_config", true);
      }

      ReactSession.set("bp3dJson", null);
      ReactSession.set("APIbp3dJson", null);

      navigate(`${Routes.createProject}?name=` + selectedProjects?.name, {
        state: {
          projectId: selProjectConfig?.projectId,
          configurationId: selProjectConfig?.id,
        },
      });
    }
  };

  const handleConfigSelect = (value, projectConfig) => {
    if (value) {
      setSelectedConfiguration((prevState) => [...prevState, projectConfig]);
      // setConfigSelected(1);
      setBtnClass("clickable");
    } else {
      const unCheckedProjectConfig = selectedConfiguration.filter(
        (item) => item?.id !== projectConfig.id,
      );
      setSelectedConfiguration(unCheckedProjectConfig);
      // setConfigSelected(0);
      if (unCheckedProjectConfig?.length === 0) {
        setBtnClass("btn-disabled");
      }
    }
  };

  const onGetProjectLists = async () => {
    setShowLoader(true);

    await listProjects(userID)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          const orderedProjects = orderBy(
            response?.data?.data,
            ["updated_at"],
            ["desc"],
          );
          setProjectList(orderedProjects);
          setCopyProjectList(orderedProjects);
          // setSelectedProjects(response?.data?.data?.[0]);
          handleCardClick(orderedProjects[0], 0);
          document.querySelector(`.selected-item-0`).classList.add("active");
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  useEffect(() => {
    let IDVal =
      ReactSession.get("building_user") &&
      ReactSession.get("building_user") !== "null"
        ? ReactSession.get("building_user")
        : ReactSession.get("building_social_user");

    if (ReactSession.get("is_logged_in") && userID) {
      onGetProjectLists(userID);
    }

    // setTimeout(() => {
    //   if (!userID) {
    //     navigate("/");
    //   }
    // }, 4000);
  }, [userID]);

  const removeSelConfig = (configId) => {
    setShowLoader(true);
    const unCheckedProjectConfig = selectedConfiguration.filter(
      (item) => item?.id !== configId,
    );
    if (unCheckedProjectConfig?.length === 0) {
      setBtnClass("btn-disabled");
    }
    setSelectedConfiguration(unCheckedProjectConfig);
    setShowLoader(false);
  };

  const handleSearch = (e) => {
    const searchVal = e.target.value;
    if (searchVal) {
      const filterProjects = copyProjectList.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchVal?.toLowerCase()),
      );
      setProjectList(filterProjects);
    } else {
      setProjectList(copyProjectList);
    }
  };

  const handleCloseDeleteProjectModal = () => {
    setIsDeleteProject(false);
  };

  const handleDeleteProject = () => {
    setShowLoader(true);
    const payload = {
      projectId: selectedProjects.id,
    };
    deleteProject(payload)
      .then((response) => {
        if (response?.status === 200) {
          // toast.success("Project removed successfully");
          const remainingProject =
            projectList?.length > 0 &&
            projectList?.filter((proj) => proj.id !== selectedProjects?.id);
          setProjectList(remainingProject || []);
          setSelectedProjects(remainingProject[0]);
          setSelectedConfiguration([]);
          setProjectConfiguration([]);
          handleCloseDeleteProjectModal();
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  const handleDeleteConfig = () => {
    if (selectedConfiguration?.length > 0) {
      setShowLoader(true);
      const configIds = selectedConfiguration?.map(
        (pConfig) => pConfig?.id && pConfig?.name !== "Basic",
      );
      const deletePayloads = {
        projectId: selectedProjects?.id,
        configurationIds: configIds,
      };

      deleteProjectConfiguration(deletePayloads)
        .then((response) => {
          if (response?.status === 200 && response?.data?.msg) {
            const filterRemainingProj = projectConfiguration.filter(
              (val) => !configIds.includes(val.id),
            );
            setProjectConfiguration(filterRemainingProj);
            setSelectedConfiguration([]);
            // toast.success("Project Configuration deleted successfully");
            setIsDeleteConfig(false);
          }
        })
        .catch((error) => {
          console.log({ error });
        })
        .finally(() => {
          setShowLoader(false);
        });
    }
  };

  const handleCloseDeleteConfig = () => {
    setIsDeleteConfig(false);
  };

  const handleSorting = (isAscOrderType, orderFieldName) => {
    setSelectedSortOption(orderFieldName);
    const orderedProjectList = orderBy(
      projectList,
      [orderFieldName],
      [isAscOrderType ? "asc" : "desc"],
    );
    setProjectList(orderedProjectList);
  };

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
                    <div className="EXISTING-left-box" ref={ref}>
                      <div className="Select-flexed">
                        <div className="Search-pos">
                          <input
                            type="text"
                            placeholder="Search project"
                            className="Search-project"
                            name="searchProject"
                            onChange={(e) => handleSearch(e)}
                          />
                          <img
                            src="assets/img/LoadExisting/search.png"
                            className="search-ic"
                            alt=""
                          />
                        </div>
                        <div className="Select-flex">
                          <img
                            onClick={() => setSelected(!selected)}
                            src="assets/img/LoadExisting/filter.svg"
                            alt=""
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      {selected && (
                        <div className="loadProject-filter">
                          <FilterDropdown className="loadProject-filter-items">
                            <button
                              onClick={() => {
                                console.log("first");
                                handleSorting(!isNameAsc, "name");
                                setIsNameAsc(!isNameAsc);
                              }}
                              className={
                                selectedSortOption === "name" && isNameAsc
                                  ? "selected-promocode-sort"
                                  : ""
                              }
                            >
                              Name
                            </button>
                            <HorizontalLineDropdown />
                            <button
                              onClick={() => {
                                handleSorting(!isCreatedDateAsc, "created_at");
                                setIsCreatedDateAsc(!isCreatedDateAsc);
                              }}
                              className={
                                selectedSortOption === "created_at" &&
                                isCreatedDateAsc
                                  ? "selected-promocode-sort"
                                  : ""
                              }
                            >
                              Created date
                            </button>
                            <HorizontalLineDropdown />
                            <button
                              onClick={() => {
                                handleSorting(!isLastEditedAsc, "updated_at");
                                setIsLastEditedAsc(!isLastEditedAsc);
                              }}
                              className={
                                selectedSortOption === "updated_at" &&
                                isLastEditedAsc
                                  ? "selected-promocode-sort"
                                  : ""
                              }
                            >
                              Last edited
                            </button>
                          </FilterDropdown>
                        </div>
                      )}
                    </div>

                    <div className="EXISTING-card-all">
                      {projectList?.length > 0 &&
                        projectList.map((item, index) => (
                          <div
                            className={`first-card1 card-container-selected selected-item-${index}`}
                            key={index}
                            onClick={() => handleCardClick(item, index)}
                          >
                            <div>
                              {/* <img src="assets/img/LoadExisting/3d Project page.png" className="w3d-Project" alt="" /> */}

                              <img
                                src={
                                  "assets/img/LoadExisting/3d Project page.png"
                                }
                                className="w3d-Project"
                                alt=""
                              />
                            </div>
                            <div className="lest-flex">
                              <div className="lest-flex1">
                                <p className="STELLA-titr">{item.name}</p>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteProject(true);
                                  }}
                                  className="dots-11px"
                                  role="button"
                                >
                                  <img
                                    src="assets/img/LoadExisting/Group 431.svg"
                                    alt=""
                                  />
                                </div>
                              </div>

                              <div className="lest-grid">
                                <div className="lestgrid-1">
                                  <p className="lest-pra-9px">Location</p>
                                  <p className="lest-pra-9px">
                                    Simulation time
                                  </p>
                                  <p className="lest-pra-9px">Created</p>
                                  <p className="lest-pra-9px">Last edited</p>
                                  <p className="lest-pra-9px">Configurations</p>
                                </div>
                                <div className="lestgrid-1">
                                  <p className="lest-pra-8px">-</p>
                                  <p className="lest-pra-8px">-</p>
                                  <p className="lest-pra-8px">
                                    {item &&
                                      item.created_at &&
                                      format(
                                        new Date(parseInt(item.created_at)),
                                        "d MMM yy",
                                      )}
                                  </p>
                                  <p className="lest-pra-8px">
                                    {item &&
                                      item?.updated_at &&
                                      format(
                                        new Date(parseInt(item?.updated_at)),
                                        "d MMM yy",
                                      )}
                                  </p>
                                  <p className="lest-pra-8px">
                                    {item?.configurations}
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
                              {selectedConfiguration?.length > 0
                                ? `${
                                    selectedConfiguration?.length ?? 0
                                  } configuration${
                                    selectedConfiguration?.length > 1 ? "s" : ""
                                  }
                              selected`
                                : ""}
                            </p>
                            {selectedConfiguration?.length > 0 && (
                              <div
                                onClick={() =>
                                  selectedConfiguration?.length === 1 &&
                                  selectedConfiguration?.[0]?.name === "Basic"
                                    ? setIsDeleteConfig(false)
                                    : setIsDeleteConfig(true)
                                }
                                className="Permanent-btn"
                              >
                                Permanent delete
                                <img
                                  src="assets/img/LoadExisting/delete.svg"
                                  alt=""
                                />
                              </div>
                            )}
                          </div>

                          <div className="selected-project">
                            {selectedConfiguration?.length > 0 &&
                              selectedConfiguration?.map((item) => {
                                return (
                                  <div className="small-img-box">
                                    <img
                                      src={
                                        "assets/img/LoadExisting/3d Project page.png"
                                      }
                                      className="w3d-small"
                                      alt=""
                                    />
                                    <a className="WALIMP">{item?.name}</a>
                                    <button
                                      onClick={() => removeSelConfig(item?.id)}
                                      className="cancelIcon"
                                    >
                                      X
                                    </button>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="five-flex-smae-btn">
                            {selectedConfiguration?.length < 2 && (
                              <a
                                className={`five-btn-s-width ${btnClass}`}
                                onClick={() =>
                                  handleLoadProject(
                                    selectedConfiguration[0],
                                    false,
                                    true,
                                  )
                                }
                                style={{ pointerEvents: "none", opacity: 0.5 }}
                              >
                                <img
                                  src="assets/img/LoadExisting/view.svg"
                                  alt=""
                                />
                                View
                              </a>
                            )}

                            {selectedConfiguration?.length === 2 && (
                              <a
                                className={`five-btn-s-width ${btnClass}`}
                                onClick={handleLoadProject}
                                style={{ pointerEvents: "none", opacity: 0.5 }}
                              >
                                <img
                                  src="assets/img/LoadExisting/view.svg"
                                  alt=""
                                />
                                Compare
                              </a>
                            )}
                            <a
                              className={`five-btn-s-width borders ${btnClass}`}
                              onClick={() =>
                                handleLoadProject(
                                  selectedConfiguration[0],
                                  true,
                                  false,
                                )
                              }
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
                              {projectConfiguration?.length > 0 &&
                                projectConfiguration?.map((item, index) => (
                                  <tbody>
                                    <tr className="main-tr-row">
                                      <td className="main-td-title bold">
                                        <div className="Basic-flex">
                                          <div className="checkBoxOutline-table ">
                                            <input
                                              name="items"
                                              type="checkbox"
                                              checked={selectedConfiguration?.some(
                                                (selItem) =>
                                                  selItem?.id === item?.id,
                                              )}
                                              id="checkConfig"
                                              onChange={(e) =>
                                                handleConfigSelect(
                                                  e.target.checked,
                                                  item,
                                                )
                                              }
                                            />
                                          </div>
                                          <span>{item?.name ?? "-"}</span>
                                        </div>
                                      </td>
                                      <td className="main-td-title">
                                        {item?.created_at
                                          ? format(
                                              new Date(
                                                parseInt(item.created_at),
                                              ),
                                              "d MMM, yy",
                                            )
                                          : "-"}
                                      </td>
                                      <td className="main-td-title">
                                        {item?.updated_at
                                          ? format(
                                              new Date(
                                                parseInt(item?.updated_at),
                                              ),
                                              "d MMM, yy",
                                            )
                                          : "-"}
                                      </td>
                                      <td className="main-td-title check-disable">
                                        {item?.status ? (
                                          <img
                                            src="assets/img/LoadExisting/checked-verified.svg"
                                            className="padind-rig"
                                            alt=""
                                          />
                                        ) : (
                                          "-"
                                        )}

                                        {/* {item?.status ? "true" : "false"} */}
                                      </td>
                                      <td className="main-td-title">
                                        {item?.results_available ? (
                                          <img
                                            src="assets/img/LoadExisting/checked-verified.svg"
                                            className="padind-rig"
                                            alt=""
                                          />
                                        ) : (
                                          "-"
                                        )}
                                        {/* {item?.results_available ?? "-"} */}
                                      </td>
                                      <td className="main-td-title black">
                                        {item?.energy_cost ?? "-"}
                                      </td>
                                    </tr>
                                  </tbody>
                                ))}
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
      <LoadingCover show={showLoader} />
      <DeleteProjectModal
        isDelete={isDeleteProject}
        handleCloseModal={handleCloseDeleteProjectModal}
        handleDelete={handleDeleteProject}
        projectDetail={selectedProjects}
      />

      <DeleteConfigurationModal
        isDelete={isDeleteConfig}
        handleCloseModal={handleCloseDeleteConfig}
        handleDelete={handleDeleteConfig}
        configurationDetails={selectedConfiguration}
      />
    </div>
  );
}

export default LoadProject;
