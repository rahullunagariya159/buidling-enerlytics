import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import {
  getBuildingMaterialCountries,
  getBuildingMaterialTypeList,
  getBuildingMaterialConstructionYear,
  getBuildingMaterialAppearance,
} from "../Services/BuildingMaterialService";
import LoadingCover from "../LoadingCover";
import Text from "../Text";
import { somethingWentWrongError } from "../../Constants";
import ShowDetails from "./ShowDetails";
import { useAuth } from "../../Context/AuthProvider";
import "./index.css";
import { Dropdown } from "react-bootstrap";

const BuildingMaterial = () => {
  const [toggle, setToggle] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [countries, setCountries] = useState([]);
  const [materialType, setMaterialType] = useState([]);
  const [constructionYears, setConstructionYears] = useState([]);
  const [buildingAppearance, setBuildingAppearance] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState(null);
  const [selectedConstructionYear, setSelectedConstructionYear] =
    useState(null);
  const [selectedBuAppearance, setSelectedBuAppearance] = useState(null);
  const [selectedBuAppearanceObj, setSelectedBuAppearanceObj] = useState({});
  const [selEnergeOption, setSelEnergeOption] = useState({});
  const [isEnableSteps, setIsEnableSteps] = useState(false);
  const [buildingEnrgOptIndex, setBuildingEnrgOptIndex] = useState(0);
  const [error, setError] = useState("");

  const [toggleCountry, setToggleCountry] = useState(false);
  const [toggleBuildingType, setToggleBuildingType] = useState(false);
  const [toggleConstructionYear, setToggleConstructionYear] = useState(false);
  const [toggleBuildingAppearance, setToggleBuildingAppearance] =
    useState(false);
  const { userId } = useAuth();

  const handleNoBuildingMaterial = async () => {
    setToggle(false);
    setShowLoader(true);
    setIsEnableSteps(true);
    setError("");
    await getBuildingMaterialCountries()
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          setCountries(response?.data?.data);
        }
      })
      .catch((error) => {
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };
  const onCountryChange = async () => {
    setError("");
    setShowLoader(true);
    const countryName = selectedCountry?.name;
    // setSelectedCountry(e?.target?.value);
    await getBuildingMaterialTypeList(countryName)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          setMaterialType(response?.data?.data);
        }
      })
      .catch((error) => {
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };
  useEffect(() => {
    if (selectedCountry) {
      onCountryChange();
    }
  }, [selectedCountry]);

  const onSelectBuildingType = async () => {
    setError("");
    setShowLoader(true);
    // const value = selectedBuildingType?.name;
    // setSelectedBuildingType(value);

    const payload = {
      country: selectedCountry.name,
      buildingType: selectedBuildingType.name,
    };
    await getBuildingMaterialConstructionYear(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          setConstructionYears(response?.data?.data);
        }
      })
      .catch((error) => {
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };
  useEffect(() => {
    if (selectedBuildingType) {
      onSelectBuildingType();
    }
  }, selectedBuildingType);

  const onChangeConstructionYear = async () => {
    setShowLoader(true);
    setError("");
    // const value = selectedConstructionYear?.name;
    // setSelectedConstructionYear(value);

    const payload = {
      country: selectedCountry?.name,
      buildingType: selectedBuildingType?.name,
      constructionYear: selectedConstructionYear?.name,
    };
    await getBuildingMaterialAppearance(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.length > 0) {
          setBuildingAppearance(response?.data?.data);
        }
      })
      .catch((error) => {
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };
  useEffect(() => {
    if (selectedConstructionYear) {
      onChangeConstructionYear();
    }
  }, selectedConstructionYear);

  const onChangeBuildingAppearance = async () => {
    setError("");
    const buildMerApprnc = buildingAppearance.find(
      (buiApprnce) => buiApprnce?.name === selectedBuAppearance?.name,
    );
    setSelectedBuAppearanceObj(buildMerApprnc);
  };
  useEffect(() => {
    if (selectedBuAppearance) {
      onChangeBuildingAppearance();
    }
  }, selectedBuAppearance);
  const handleSaveBuildingMaterialData = (values) => {
    setShowLoader(true);
    console.log({ values });

    const materialPayload = {
      userId: userId,
      projectId: ReactSession.get("project_id"),
      configurationId: "9498f286-b2d6-4980-ab8a-aa9e6a455338",
      data: {
        knowledge: true,
        country: "Denmark",
        countryUrl:
          "https://building-enerlytics-config.s3.eu-central-1.amazonaws.com/images/original/DE.png",
        buildingType: "Single Family House",
        buildingTypeUrl:
          "https://building-enerlytics-config.s3.eu-central-1.amazonaws.com/images/original/SFH.png",
        constructionYear: "1850",
        buildingAppearance: "Plastered Walls",
        buildingAppearanceUrl:
          "https://building-enerlytics-config.s3.eu-central-1.amazonaws.com/images/original/PW.png",
        energyConsumption: "no",
        energyConsumptionUrl:
          "https://building-enerlytics-config.s3.eu-central-1.amazonaws.com/images/original/PW.png",
        air_tightness_infilteration_rate_dropdown: "Custom",
        air_tightness_infilteration_rate: "0.1",
        building_density_absorptivity_dropdown: values.buildingDensity,
        building_density_absorptivity: "200",
        energy_bridges_u_value_dropdown: "Custom",
        energy_bridges_u_value: "5",
        walls_color_absorption_coefficient_dropdown: "Custom",
        walls_color_absorption_coefficient: "0.6",
        walls_thermal_conductivity_u_value_dropdown: "Custom",
        walls_thermal_conductivity_u_value: "5",
        floor_thermal_conductivity_u_value_dropdown: "Custom",
        floor_thermal_conductivity_u_value: "5",
        roof_color_absorption_coefficient_dropdown: "Custom",
        roof_color_absorption_coefficient: "0.1",
        roof_thermal_conductivity_u_value_dropdown: "Custom",
        roof_thermal_conductivity_u_value: "0.3",
        windows_glazing_thermal_conductivity_u_value_dropdown: "Custom",
        windows_glazing_thermal_conductivity_u_value: "0.4",
        windows_energy_transmissivity_coefficient_dropdown: "Custom",
        windows_energy_transmissivity_coefficient: "0.4",
        windows_light_transmissivity_coefficient_dropdown: "Custom",
        windows_light_transmissivity_coefficient: "0.4",
        windows_frames_share_value_dropdown: "Custom",
        windows_frames_share_value: "0.5",
        windows_frames_thermal_conductivity_u_value_dropdown: "Custom",
        windows_frames_thermal_conductivity_u_value: "0.4",
        windows_frames_joint_frame_value_dropdown: "Custom",
        windows_frames_joint_frame_value: "0.4",
      },
    };

    setShowLoader(false);
  };

  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="main-building">
              <div className="left-side-bar-container">
                <LeftSidebar module="BM" />
              </div>
              <div className="building-content ">
                <div className="left-wrp">
                  <div className="main-table">
                    <div className="one-boex ">
                      <div className="stepce border-l">Step 1</div>
                      <div className="table-pading">
                        <h1>
                          Do you have details knowledge about your Building
                          Materials?
                        </h1>
                        <div className="forn-flex">
                          <div
                            className="form-one"
                            onClick={() => {
                              setIsEnableSteps(false);
                              setToggle(true);
                            }}
                          >
                            <input
                              type="radio"
                              className="inst"
                              id="buildingKnowledge0"
                              name="buildingKnowledge"
                            />
                            <label
                              className="insted no-1 tow"
                              htmlFor="buildingKnowledge0"
                            >
                              Yes, I do
                            </label>
                          </div>
                          <div
                            className="form-one"
                            onClick={() => handleNoBuildingMaterial()}
                          >
                            <input
                              type="radio"
                              className="inst"
                              id="buildingKnowledge1"
                              name="buildingKnowledge"
                            />
                            <label
                              className="insted no-1 tow"
                              htmlFor="buildingKnowledge1"
                            >
                              No, I don't have details available
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="one-boex top-brdr ">
                      <div
                        className={`stepce ${
                          !isEnableSteps ? "btn-disable-step" : ""
                        }`}
                      >
                        Step 2
                      </div>
                      <div
                        className={`mt ${
                          !isEnableSteps ? "disable-step-container" : ""
                        }`}
                      >
                        <div className="secondStep">
                          <Dropdown
                            className={` ${
                              toggleCountry ? "dropdownBox brd" : ""
                            }`}
                            onToggle={() => setToggleCountry(!toggleCountry)}
                          >
                            <Dropdown.Toggle
                              variant=""
                              id="dropdown-icon"
                              className={`${
                                !!toggleCountry ? "dropdown-open" : ""
                              }`}
                            >
                              {selectedCountry ? (
                                <div className="country-items">
                                  <img
                                    src={selectedCountry?.url}
                                    alt={selectedCountry?.name}
                                  />
                                  <span>{selectedCountry?.name}</span>
                                </div>
                              ) : (
                                "Country"
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu onChange={onCountryChange}>
                              {countries?.length > 0 &&
                                countries.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() => setSelectedCountry(item)}
                                  >
                                    <div className="items">
                                      <img src={item?.url} alt="url" />
                                      <span>{item?.name}</span>
                                    </div>
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          <div className="vertical-line"></div>
                          <Dropdown
                            className={` ${
                              !selectedCountry ? "disable-step-container" : ""
                            } ${toggleBuildingType ? "dropdownBox brd" : ""}`}
                            onToggle={() =>
                              setToggleBuildingType(!toggleBuildingType)
                            }
                          >
                            <Dropdown.Toggle
                              variant=""
                              id="materialType"
                              name="materialType"
                              className={`${
                                !!toggleBuildingType ? "dropdown-open" : ""
                              }`}
                            >
                              {selectedBuildingType ? (
                                <div className="country-items">
                                  <img
                                    src={selectedBuildingType?.url}
                                    alt={selectedBuildingType?.name}
                                  />
                                  <span>{selectedBuildingType?.name}</span>
                                </div>
                              ) : (
                                "Building Type"
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu onChange={onSelectBuildingType}>
                              {materialType?.length > 0 &&
                                materialType.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedBuildingType(item)
                                    }
                                  >
                                    <div className="items">
                                      <img src={item?.url} alt="url" />
                                      <span>{item?.name}</span>
                                    </div>
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <div className="secondStep">
                          <Dropdown
                            className={` ${
                              !selectedBuildingType
                                ? "disable-step-container"
                                : ""
                            } ${
                              toggleConstructionYear ? "dropdownBox brd" : ""
                            }`}
                            onToggle={() =>
                              setToggleConstructionYear(!toggleConstructionYear)
                            }
                          >
                            <Dropdown.Toggle
                              variant=""
                              id="constructionYear"
                              name="constructionYear"
                              className={`${
                                !!toggleConstructionYear ? "dropdown-open" : ""
                              }`}
                            >
                              {selectedConstructionYear ? (
                                <div className="country-items">
                                  <span>{selectedConstructionYear?.name}</span>
                                </div>
                              ) : (
                                "Construction Year"
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu onChange={onChangeConstructionYear}>
                              {constructionYears?.length > 0 &&
                                constructionYears.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedConstructionYear(item)
                                    }
                                  >
                                    <div className="items">
                                      <span>{item?.name}</span>
                                    </div>
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          <div className="vertical-line"></div>
                          <Dropdown
                            className={` ${
                              !selectedConstructionYear
                                ? "disable-step-container"
                                : ""
                            } ${
                              toggleBuildingAppearance ? "dropdownBox brd" : ""
                            }`}
                            onToggle={() =>
                              setToggleBuildingAppearance(
                                !toggleBuildingAppearance,
                              )
                            }
                          >
                            <Dropdown.Toggle
                              variant=""
                              id="buildingAppearance"
                              name="buildingAppearance"
                              className={`${
                                !!toggleBuildingAppearance
                                  ? "dropdown-open"
                                  : ""
                              }`}
                            >
                              {selectedBuAppearance ? (
                                <div className="country-items">
                                  <img
                                    src={selectedBuAppearance?.url}
                                    alt={selectedBuAppearance?.name}
                                  />
                                  <span> {selectedBuAppearance?.name}</span>
                                </div>
                              ) : (
                                "Building Appearance"
                              )}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              onChange={onChangeBuildingAppearance}
                            >
                              {buildingAppearance?.length > 0 &&
                                buildingAppearance.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedBuAppearance(item)
                                    }
                                  >
                                    <div className="items">
                                      <img src={item?.url} alt="url" />
                                      <span>{item?.name}</span>
                                    </div>
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    <div className="one-boex top-brdr">
                      <div
                        className={`stepce ${
                          !isEnableSteps || !selectedBuAppearance
                            ? "btn-disable-step"
                            : ""
                        }`}
                      >
                        Step 3
                      </div>
                      <div
                        className={`table-pading ${
                          !isEnableSteps || !selectedBuAppearance
                            ? "disable-step-container"
                            : ""
                        }`}
                      >
                        <h1>
                          Did your Building ever undergo Energy Efficient
                          Refurbishment?
                        </h1>
                        <div className="forn-flex">
                          {console.log(selectedBuAppearanceObj)}
                          {selectedBuAppearanceObj?.data?.length > 0 &&
                            selectedBuAppearanceObj?.data?.map(
                              (buAppData, index) => {
                                return (
                                  <div
                                    className="form-one"
                                    key={index}
                                    onClick={() => {
                                      setSelEnergeOption(buAppData);
                                      setBuildingEnrgOptIndex(index);
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      className="inst"
                                      id={buAppData?.name}
                                      name="gender"
                                    />
                                    <label
                                      className="insted no-1 build-eng-efficient"
                                      htmlFor={buAppData?.name}
                                    >
                                      {buAppData?.name}
                                    </label>
                                  </div>
                                );
                              },
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {selEnergeOption?.url &&
                    isEnableSteps &&
                    selectedBuAppearance && (
                      <div
                        className="bui-materail-img-container"
                        // style={{ backgroundImage: `url(${selEnergeOption?.url})` }}
                      >
                        <div className="materail-data-icon-container">
                          <span
                            className={`${
                              buildingEnrgOptIndex === 0
                                ? "active-materail-data-icon"
                                : ""
                            }`}
                          >
                            <img
                              src={"assets/img/Existing-Projects/greentech.png"}
                              alt=""
                            />
                          </span>
                          <span
                            className={`mid-icon  ${
                              buildingEnrgOptIndex === 1
                                ? "active-materail-data-icon"
                                : ""
                            }`}
                          >
                            <img
                              src={
                                "assets/img/Existing-Projects/greentech-2.png"
                              }
                              alt=""
                            />
                          </span>
                          <span
                            className={`${
                              buildingEnrgOptIndex === 2
                                ? "active-materail-data-icon"
                                : ""
                            }`}
                          >
                            <img
                              src={
                                "assets/img/Existing-Projects/greentech-3.png"
                              }
                              alt=""
                            />
                          </span>
                        </div>
                        <div>
                          <img
                            src={
                              selEnergeOption?.url
                                ? selEnergeOption?.url
                                : "assets/img/Existing-Projects/home.png"
                            }
                            alt=""
                            className="bui-materail-bg-img"
                          />
                        </div>
                      </div>
                    )}

                  <Text text={error} type="error" />
                </div>
                <ShowDetails
                  setToggle={setToggle}
                  toggle={toggle}
                  handleSaveBuildingMaterialData={
                    handleSaveBuildingMaterialData
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <LoadingCover show={showLoader} />
    </div>
  );
};
export default BuildingMaterial;
