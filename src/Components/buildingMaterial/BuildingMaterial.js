import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";
import {
  getBuildingMaterialCountries,
  getBuildingMaterialTypeList,
  getBuildingMaterialConstructionYear,
  getBuildingMaterialAppearance,
  saveBuildingMaterialData,
  getBuildingMaterialData,
} from "../Services/BuildingMaterialService";
import { addProjectConfiguration } from "../Services/ProjectServices";
import LoadingCover from "../LoadingCover";
import Text from "../Text";
import { somethingWentWrongError } from "../../Constants";
import ShowDetails from "./ShowDetails";
import { useAuth } from "../../Context/AuthProvider";
import "./index.css";
import { Dropdown } from "react-bootstrap";
import SaveProjectConfirmationPopup from "../SaveProjectConfirmationPopup";
import { Routes } from "../../navigation/Routes";

const BuildingMaterial = () => {
  const navigate = useNavigate();

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bMformValues, setBMFormValues] = useState({});
  const [isEditValue, setIsEditValue] = useState(false);
  const [apiCopyData, setAPICopyData] = useState({});

  const { userId } = useAuth();
  const [searchParams] = useSearchParams();

  const projectName = searchParams.get("name") ? searchParams.get("name") : "";
  const isEdit = ReactSession.get("isedit_project_config");

  let stringifyData = {};
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
  }, [selectedBuildingType]);

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
  }, [selectedConstructionYear, selectedBuAppearance]);

  const onChangeBuildingAppearance = async () => {
    setError("");

    const buildMerApprnc = buildingAppearance.find(
      (buiApprnce) => buiApprnce?.name === selectedBuAppearance?.name,
    );
    setSelectedBuAppearanceObj(buildMerApprnc);
  };

  useEffect(() => {
    if (selectedBuAppearance?.name && buildingAppearance?.length > 0) {
      onChangeBuildingAppearance();
    }
  }, [selectedBuAppearance, buildingAppearance]);

  const handleSaveBuildingMaterialData = async (fValues) => {
    setShowConfirmModal(false);
    setShowLoader(true);
    const values = fValues ?? bMformValues;
    const configurationID = await ReactSession.get("configuration_id");
    const projectID = await ReactSession.get("project_id");

    stringifyData = JSON.stringify({
      knowledge: isEnableSteps,
      country: selectedCountry?.name,
      countryUrl: selectedCountry?.url,
      buildingType: selectedBuildingType?.name,
      buildingTypeUrl: selectedBuildingType?.url,
      constructionYear: selectedConstructionYear?.name,
      buildingAppearance: selectedBuAppearance?.name,
      buildingAppearanceUrl: selectedBuAppearance?.url,
      energyConsumption: selEnergeOption?.name,
      energyConsumptionUrl: selEnergeOption?.url,
      air_tightness_infilteration_rate_dropdown: values?.gAirTightness,
      air_tightness_infilteration_rate: values?.gInfilRates,
      building_density_absorptivity_dropdown: values?.buildingDensity,
      building_density_absorptivity: values?.gAbsorptivity,
      energy_bridges_u_value_dropdown: values?.energyBridges,
      energy_bridges_u_value: values?.gUValue,
      walls_color_absorption_coefficient_dropdown: values?.wColor,
      walls_color_absorption_coefficient: values?.oAbsorption,
      walls_thermal_conductivity_u_value_dropdown: values?.wThermal,
      walls_thermal_conductivity_u_value: values?.oUValue,
      floor_thermal_conductivity_u_value_dropdown: values?.fThermal,
      floor_thermal_conductivity_u_value: values?.fUValue,
      roof_color_absorption_coefficient_dropdown: values?.roofColor,
      roof_color_absorption_coefficient: values?.rAbsorption,
      roof_thermal_conductivity_u_value_dropdown: values?.thermalConductivity,
      roof_thermal_conductivity_u_value: values?.rUValue,
      windows_glazing_thermal_conductivity_u_value_dropdown: values?.wThermal,
      windows_glazing_thermal_conductivity_u_value: values?.wGUValue,
      windows_energy_transmissivity_coefficient_dropdown: values?.wEnergy,
      windows_energy_transmissivity_coefficient: values?.wGCoefficient,
      windows_light_transmissivity_coefficient_dropdown: values?.wLight,
      windows_light_transmissivity_coefficient: values?.wGLightCoefficient,
      windows_frames_share_value_dropdown: values?.wFrame,
      windows_frames_share_value: values?.fShareValue,
      windows_frames_thermal_conductivity_u_value_dropdown: values?.fThermal,
      windows_frames_thermal_conductivity_u_value: values?.fUValue,
      windows_frames_joint_frame_value_dropdown: values?.fJointFrame,
      windows_frames_joint_frame_value: values?.fJointValue,
    });

    const materialPayload = {
      userId: userId,
      projectId: projectID,
      configurationId: configurationID,
      data: stringifyData,
    };

    await saveBuildingMaterialData(materialPayload)
      .then((response) => {
        if (response?.status === 200 && response.data.msg) {
          toast.success("Building Material Data Updated successfully");
          navigate({
            pathname: `${Routes.hvac}`,
            search: "?name=" + projectName,
          });
        }
      })
      .catch((error) => {
        console.log({ error });
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  const handleAddNewConfig = async () => {
    setShowLoader(true);
    const projectID = await ReactSession.get("project_id");

    const newConfigPayload = {
      userId: userId,
      projectId: projectID,
      configurationName: projectName,
    };

    await addProjectConfiguration(newConfigPayload)
      .then(async (response) => {
        if (response?.status === 200 && response?.data?.msg) {
          await ReactSession.set(
            "configuration_id",
            response?.data?.configurationId,
          );
          await handleSaveBuildingMaterialData();
        }
      })
      .catch((error) => {
        console.log({ error });
        setShowLoader(false);
      });
  };

  const handleSubmitForm = async (values) => {
    const convertNewData = {
      knowledge: isEnableSteps,
      country: selectedCountry?.name,
      countryUrl: selectedCountry?.url,
      buildingType: selectedBuildingType?.name,
      buildingTypeUrl: selectedBuildingType?.url,
      constructionYear: selectedConstructionYear?.name,
      buildingAppearance: selectedBuAppearance?.name,
      buildingAppearanceUrl: selectedBuAppearance?.url,
      energyConsumption: selEnergeOption?.name,
      energyConsumptionUrl: selEnergeOption?.url,
      air_tightness_infilteration_rate_dropdown: values?.gAirTightness,
      air_tightness_infilteration_rate: values?.gInfilRates,
      building_density_absorptivity_dropdown: values?.buildingDensity,
      building_density_absorptivity: values?.gAbsorptivity,
      energy_bridges_u_value_dropdown: values?.energyBridges,
      energy_bridges_u_value: values?.gUValue,
      walls_color_absorption_coefficient_dropdown: values?.wColor,
      walls_color_absorption_coefficient: values?.oAbsorption,
      walls_thermal_conductivity_u_value_dropdown: values?.wThermal,
      walls_thermal_conductivity_u_value: values?.oUValue,
      floor_thermal_conductivity_u_value_dropdown: values?.fThermal,
      floor_thermal_conductivity_u_value: values?.fUValue,
      roof_color_absorption_coefficient_dropdown: values?.roofColor,
      roof_color_absorption_coefficient: values?.rAbsorption,
      roof_thermal_conductivity_u_value_dropdown: values?.thermalConductivity,
      roof_thermal_conductivity_u_value: values?.rUValue,
      windows_glazing_thermal_conductivity_u_value_dropdown: values?.wThermal,
      windows_glazing_thermal_conductivity_u_value: values?.wGUValue,
      windows_energy_transmissivity_coefficient_dropdown: values?.wEnergy,
      windows_energy_transmissivity_coefficient: values?.wGCoefficient,
      windows_light_transmissivity_coefficient_dropdown: values?.wLight,
      windows_light_transmissivity_coefficient: values?.wGLightCoefficient,
      windows_frames_share_value_dropdown: values?.wFrame,
      windows_frames_share_value: values?.fShareValue,
      windows_frames_thermal_conductivity_u_value_dropdown: values?.fThermal,
      windows_frames_thermal_conductivity_u_value: values?.fUValue,
      windows_frames_joint_frame_value_dropdown: values?.fJointFrame,
      windows_frames_joint_frame_value: values?.fJointValue,
    };

    const fValues = { ...values };

    setBMFormValues({ ...fValues });

    // console.log({ convertNewData });
    // console.log({ apiCopyData });
    // const newStringifyData = convertNewData.toString();
    // const oldStringifyAPiData = apiCopyData.toString();

    // console.log("newStringifyData", newStringifyData);
    // console.log("oldStringifyAPiData", oldStringifyAPiData);

    // console.log({ isEditValue });
    // console.log({ isValueEqual });
    // console.log("is equal -- >> ", isEqual(convertNewData, apiCopyData));
    if (isEdit) {
      const isValueEqual = isEqual(convertNewData, apiCopyData);

      if ((isEdit && !isValueEqual) || (isEdit && isEditValue)) {
        setShowConfirmModal(true);
      } else if (isEdit && isValueEqual && !isEditValue) {
        navigate({
          pathname: `${Routes.hvac}`,
          search: "?name=" + projectName,
        });
      }
    } else {
      await handleSaveBuildingMaterialData(values);
    }
    // selEnergeOption

    // if (isEqual(selEnergeOption, stringifyData)) {
    //   console.log("is equal");
    // } else {
    //   console.log("is different");
    // }

    // const values = bMformValues;
  };

  const onYesBuildingMaterial = () => {
    setIsEnableSteps(false);
    setToggle(true);
    setSelEnergeOption({});
  };

  const onGetBuildingMaterialData = async () => {
    setShowLoader(true);
    const configurationID = await ReactSession.get("configuration_id");

    const payloadDetail = {
      userId: userId,
      configurationId: configurationID,
    };

    await getBuildingMaterialData(payloadDetail)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data?.data?.S) {
          const buMaterialData = JSON.parse(response.data.data.data.S);
          setAPICopyData(buMaterialData);
          if (Object.keys(buMaterialData)?.length === 0) {
            return false;
          }
          setIsEnableSteps(buMaterialData?.knowledge);
          setSelectedCountry({
            url: buMaterialData?.countryUrl,
            name: buMaterialData?.country,
          });
          setSelectedBuildingType({
            name: buMaterialData?.buildingType,
            url: buMaterialData?.buildingTypeUrl,
          });

          setSelectedConstructionYear({
            name: buMaterialData?.constructionYear,
          });

          setSelectedBuAppearance({
            name: buMaterialData?.buildingAppearance,
            url: buMaterialData?.buildingAppearanceUrl,
          });

          const formDetailConfiguration = {
            roof_color_absorption_coefficient:
              buMaterialData?.roof_color_absorption_coefficient,
            roof_thermal_conductivity_u_value:
              buMaterialData?.roof_thermal_conductivity_u_value,
            walls_color_absorption_coefficient:
              buMaterialData?.walls_color_absorption_coefficient,
            walls_thermal_conductivity_u_value:
              buMaterialData?.walls_thermal_conductivity_u_value,
            windows_energy_transmissivity_coefficient:
              buMaterialData?.windows_energy_transmissivity_coefficient,
            windows_frames_joint_frame_value:
              buMaterialData?.windows_frames_joint_frame_value,
            windows_frames_share_value:
              buMaterialData?.windows_frames_share_value,
            windows_frames_thermal_conductivity_u_value:
              buMaterialData?.windows_frames_thermal_conductivity_u_value,
            windows_glazing_thermal_conductivity_u_value:
              buMaterialData?.windows_glazing_thermal_conductivity_u_value,
            windows_light_transmissivity_coefficient:
              buMaterialData?.windows_light_transmissivity_coefficient,
            floor_thermal_conductivity_u_value:
              buMaterialData?.floor_thermal_conductivity_u_value,
            building_density_absorptivity:
              buMaterialData?.building_density_absorptivity,
            air_tightness_infilteration_rate:
              buMaterialData?.air_tightness_infilteration_rate,
            energy_bridges_u_value: buMaterialData?.energy_bridges_u_value,
            building_density_absorptivity_dropdown:
              buMaterialData?.building_density_absorptivity_dropdown,
            name: buMaterialData?.energyConsumption,
            url: buMaterialData?.energyConsumptionUrl,
            air_tightness_infilteration_rate_dropdown:
              buMaterialData?.air_tightness_infilteration_rate_dropdown,
            energy_bridges_u_value_dropdown:
              buMaterialData?.energy_bridges_u_value_dropdown,
            walls_color_absorption_coefficient_dropdown:
              buMaterialData?.walls_color_absorption_coefficient_dropdown,
            walls_thermal_conductivity_u_value_dropdown:
              buMaterialData?.walls_thermal_conductivity_u_value_dropdown,
            floor_thermal_conductivity_u_value_dropdown:
              buMaterialData?.floor_thermal_conductivity_u_value_dropdown,
            windows_glazing_thermal_conductivity_u_value_dropdown:
              buMaterialData?.windows_glazing_thermal_conductivity_u_value_dropdown,
            windows_frames_thermal_conductivity_u_value_dropdown:
              buMaterialData?.windows_frames_thermal_conductivity_u_value_dropdown,
            windows_light_transmissivity_coefficient_dropdown:
              buMaterialData?.windows_light_transmissivity_coefficient_dropdown,
            roof_color_absorption_coefficient_dropdown:
              buMaterialData?.roof_color_absorption_coefficient_dropdown,
            roof_thermal_conductivity_u_value_dropdown:
              buMaterialData?.roof_thermal_conductivity_u_value_dropdown,
            windows_energy_transmissivity_coefficient_dropdown:
              buMaterialData?.windows_energy_transmissivity_coefficient_dropdown,
            windows_frames_share_value_dropdown:
              buMaterialData?.windows_frames_share_value_dropdown,
            windows_frames_joint_frame_value_dropdown:
              buMaterialData?.windows_frames_joint_frame_value_dropdown,
          };

          setSelEnergeOption(formDetailConfiguration);
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
    if (userId) {
      onGetBuildingMaterialData();
    }
  }, [userId]);

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
                            onClick={() => onYesBuildingMaterial()}
                          >
                            <input
                              type="radio"
                              className="inst"
                              id="buildingKnowledge0"
                              name="buildingKnowledge"
                              defaultChecked={!isEnableSteps}
                              checked={!isEnableSteps}
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
                              defaultChecked={isEnableSteps}
                              checked={isEnableSteps}
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
                              <div
                                className={`${
                                  !!toggleCountry ? "border-t" : ""
                                }`}
                              ></div>
                              {countries?.length > 0 &&
                                countries.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() => setSelectedCountry(item)}
                                  >
                                    <div className="items">
                                      <div className="sub-items">
                                        <img src={item?.url} alt="url" />
                                        <span>{item?.name}</span>
                                      </div>
                                      {selectedCountry?.name === item?.name && (
                                        <img
                                          src="assets/img/Home-Page/tick_green.png"
                                          alt=""
                                          className="selected-items"
                                        />
                                      )}
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
                              className={`secondBox ${
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
                            <Dropdown.Menu
                              className="secondBoxItems"
                              onChange={onSelectBuildingType}
                            >
                              <div
                                className={`${
                                  !!toggleBuildingType ? "border-t" : ""
                                }`}
                              ></div>
                              {materialType?.length > 0 &&
                                materialType.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedBuildingType(item)
                                    }
                                  >
                                    <div className="items">
                                      <div className="sub-items">
                                        <img src={item?.url} alt="url" />
                                        <span>{item?.name}</span>
                                      </div>
                                      {selectedBuildingType?.name ===
                                        item?.name && (
                                        <img
                                          src="assets/img/Home-Page/tick_green.png"
                                          alt=""
                                          className="selected-items"
                                        />
                                      )}
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
                              <div
                                className={`${
                                  !!toggleConstructionYear ? "border-t" : ""
                                }`}
                              ></div>
                              {constructionYears?.length > 0 &&
                                constructionYears.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedConstructionYear(item)
                                    }
                                  >
                                    <div className="items ">
                                      <div className="sub-items">
                                        <span>{item?.name}</span>
                                      </div>
                                      {selectedConstructionYear?.name ===
                                        item?.name && (
                                        <img
                                          src="assets/img/Home-Page/tick_green.png"
                                          alt=""
                                          className="selected-items"
                                        />
                                      )}
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
                              className={`secondBox ${
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
                              className="secondBoxItems"
                              onChange={onChangeBuildingAppearance}
                            >
                              <div
                                className={`${
                                  !!toggleBuildingAppearance ? "border-t" : ""
                                }`}
                              ></div>
                              {buildingAppearance?.length > 0 &&
                                buildingAppearance.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      setSelectedBuAppearance(item)
                                    }
                                  >
                                    <div className="items buildApp">
                                      <div className="sub-items">
                                        <img src={item?.url} alt="url" />
                                        <span>{item?.name}</span>
                                      </div>
                                      {selectedBuAppearance?.name ===
                                        item?.name && (
                                        <img
                                          src="assets/img/Home-Page/tick_green.png"
                                          alt=""
                                          className="selected-items"
                                        />
                                      )}
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
                                      setToggle(true);
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      className="inst"
                                      id={buAppData?.name}
                                      name="gender"
                                      checked={
                                        buAppData.name === selEnergeOption?.name
                                      }
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
                  selEnergeOptionData={selEnergeOption}
                  isEnableSteps={isEnableSteps}
                  handleSubmitForm={handleSubmitForm}
                  setIsEditValue={setIsEditValue}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      {showConfirmModal && (
        <SaveProjectConfirmationPopup
          isShow={showConfirmModal}
          onCloseModalHandler={() => setShowConfirmModal(false)}
          handleSaveConfig={handleSaveBuildingMaterialData}
          handleAddNewConfig={handleAddNewConfig}
        />
      )}
      <LoadingCover show={showLoader} />
    </div>
  );
};
export default BuildingMaterial;
