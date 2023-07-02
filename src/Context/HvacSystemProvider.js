import React, { useContext, useEffect, useState, useMemo } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { isEqual } from "lodash";
import { hvacTabs, noValue } from "../Components/HVAC/hvacConstants";
import {
  getHVACHeatingWarmWater,
  getHVACAuxiliaryEquipment,
  saveHvacData,
  getHvacData,
} from "../Components/Services/HvacSystemService";
import { useAuth } from "../Context/AuthProvider";
import { Routes } from "../navigation/Routes";

const HvacSystemContext = React.createContext();

export function useHvacSystem() {
  return useContext(HvacSystemContext);
}

// =============================================================================
// HVAC SYSTEM PROVIDER FUNCTIONS
// =============================================================================

export function HvacSystemProvider({ children }) {
  // =========================================================================
  // STATES
  // =========================================================================

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [copySelectedQuestions, setCopySelectedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [heatingWarmWaterData, setHeatingWarmWaterData] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isShowCreateConfig, setIsCreateShowConfig] = useState(false);
  const [hvacFormValues, setHvacFormValues] = useState({});
  const [isCompleteHeating, setIsCompleteHeating] = useState(false);
  const [isCompleteCooling, setIsCompleteCooling] = useState(false);
  const [isCompleteVentilation, setIsCompleteVentilation] = useState(false);
  const [isCompleteHumidification, setIsCompleteHumidification] =
    useState(false);
  const [isCompleteAuxi, setIsCompleteAuxi] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [key, setKey] = useState(hvacTabs.heating);

  const { userId } = useAuth();
  const [searchParams] = useSearchParams();

  const projectName = searchParams.get("name") ? searchParams.get("name") : "";

  // ========================================================================
  // FUNCTIONS
  // =========================================================================
  // console.log("---->>", Object.keys(selectedQuestions?.heating)?.length);
  useEffect(() => {
    if (
      selectedQuestions &&
      selectedQuestions?.heating &&
      (selectedQuestions?.heating?.heating_warm_water_available === noValue ||
        Object.keys(selectedQuestions?.heating)?.length >= 4)
    ) {
      setIsCompleteHeating(true);
    } else {
      setIsCompleteHeating(false);
    }

    if (
      selectedQuestions &&
      selectedQuestions?.cooling &&
      (selectedQuestions?.cooling?.cooling_available === noValue ||
        Object.keys(selectedQuestions?.cooling)?.length === 2)
    ) {
      setIsCompleteCooling(true);
    } else {
      setIsCompleteCooling(false);
    }

    if (
      selectedQuestions &&
      selectedQuestions?.ventilation &&
      (selectedQuestions?.ventilation?.ventilation_available === noValue ||
        Object.keys(selectedQuestions?.ventilation)?.length > 5)
    ) {
      setIsCompleteVentilation(true);
    } else {
      setIsCompleteVentilation(false);
    }

    if (
      selectedQuestions &&
      selectedQuestions?.humidification &&
      (selectedQuestions?.humidification?.humidification_available ===
        noValue ||
        Object.keys(selectedQuestions?.humidification)?.length >= 4)
    ) {
      setIsCompleteHumidification(true);
    } else {
      setIsCompleteHumidification(false);
    }

    if (
      selectedQuestions &&
      selectedQuestions?.auxiliary_equipment &&
      (selectedQuestions?.auxiliary_equipment?.elevator_electricity_bill ===
        noValue ||
        Object.keys(selectedQuestions?.auxiliary_equipment)?.length >= 2)
    ) {
      setIsCompleteAuxi(true);
    } else {
      setIsCompleteAuxi(false);
    }
  }, [selectedQuestions]);

  const onCloseConfigModalHandler = () => {
    setIsCreateShowConfig(false);
  };

  const handleAddNewConfig = async () => {
    // setShowLoader(true);
    setShowConfirmModal(false);
    setIsCreateShowConfig(true);
  };

  const onSelectQuestion = (questionType, key, value, inputType) => {
    let selQuestions = { ...selectedQuestions };

    if (inputType === "checkbox") {
      selQuestions[questionType] = {
        ...selQuestions[questionType],
        [key]:
          selQuestions[questionType][key]?.length > 0
            ? [...selQuestions[questionType][key], value]
            : [value],
      };
    } else if (inputType === "dropdown") {
      selQuestions[questionType] = {
        ...selQuestions[questionType],
        [key]:
          selQuestions[questionType][key]?.length > 0
            ? [
                ...selQuestions[questionType][key],
                { selection: value?.name, value: value?.value },
              ]
            : { selection: value?.name, value: value?.value },
      };
    } else if (inputType === "inputBox") {
    } else {
      selQuestions[questionType] = {
        ...selQuestions[questionType],
        [key]: value,
      };
    }

    setSelectedQuestions(selQuestions);
  };

  const handleGetHVACHeatingWarmWater = async () => {
    const requestPayload = {
      unheated_space: selectedQuestions?.heating?.unheated_space,
      well_insulated: selectedQuestions?.heating?.well_insulated,
      heating_energy_transmitted:
        selectedQuestions?.heating?.heating_energy_transmitted,
    };
    setLoading(true);
    await getHVACHeatingWarmWater(requestPayload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data) {
          setHeatingWarmWaterData(response?.data?.data);
          setToggle(true);
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetHVACAuxiliaryEquipment = async () => {
    const requestPayload = {
      assumed_efficiency:
        selectedQuestions?.auxiliary_equipment?.assumed_efficiency,
    };
    setLoading(true);
    await getHVACAuxiliaryEquipment(requestPayload)
      .then((response) => {
        if (
          response?.status === 200 &&
          Object.keys(response?.data?.data).length > 0
        ) {
          const hWarmWaterData = {
            ...heatingWarmWaterData,
            ...response.data.data,
          };
          setHeatingWarmWaterData(hWarmWaterData);
          setToggle(true);
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitHvacData = async (formValue) => {
    setLoading(true);
    let hvacData = { ...selectedQuestions };
    let formValues = formValue ?? hvacFormValues;
    hvacData.heating.heating_system_transmission_losses =
      formValues?.heating_system_transmission_losses;
    hvacData.heating.heating_system_distribution_losses =
      formValues?.heating_system_distribution_losses;
    hvacData.heating.warm_water_storage_losses =
      formValues?.warm_water_storage_losses;
    hvacData.heating.warm_water_distribution_losses =
      formValues?.warm_water_distribution_losses;
    hvacData.heating.radiator_surface_area = formValues?.radiator_surface_area;
    hvacData.auxiliary_equipment.load_operating_hours =
      formValues?.load_operating_hours ?? "";
    hvacData.auxiliary_equipment.load_non_operating_hours =
      formValues?.load_non_operating_hours;

    const projectID = await ReactSession.get("project_id");
    const configurationID = await ReactSession.get("configuration_id");
    if (!userId || !projectID || !configurationID) {
      setLoading(false);
      return false;
    }

    const hvacPayload = {
      userId: userId,
      projectId: projectID,
      configurationId: configurationID,
      data: JSON.stringify(hvacData),
    };

    await saveHvacData(hvacPayload)
      .then((response) => {
        console.log({ response });
        if (response?.status === 200) {
          setShowConfirmModal(false);
          navigate({
            pathname: `${Routes.energyGeneration}`,
            search: "?name=" + projectName,
          });
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFormConfig = async (formValues) => {
    let hvacFrmData = { ...selectedQuestions };

    hvacFrmData.heating.heating_system_transmission_losses =
      formValues?.heating_system_transmission_losses;
    hvacFrmData.heating.heating_system_distribution_losses =
      formValues?.heating_system_distribution_losses;
    hvacFrmData.heating.warm_water_storage_losses =
      formValues?.warm_water_storage_losses;
    hvacFrmData.heating.warm_water_distribution_losses =
      formValues?.warm_water_distribution_losses;
    hvacFrmData.heating.radiator_surface_area =
      formValues?.radiator_surface_area;
    hvacFrmData.auxiliary_equipment.load_operating_hours =
      formValues?.load_operating_hours ?? "";
    hvacFrmData.auxiliary_equipment.load_non_operating_hours =
      formValues?.load_non_operating_hours;

    const isValueEqual = isEqual(hvacFrmData, copySelectedQuestions);
    if (!isValueEqual) {
      setShowConfirmModal(true);
      setLoading(false);
    } else {
      navigate({
        pathname: `${Routes.energyGeneration}`,
        search: "?name=" + projectName,
      });
      setLoading(false);
    }
  };

  const onCreateNewConfigModalHandler = async () => {
    await handleSubmitHvacData();
  };

  const handleGetHvacData = async () => {
    const configurationID = await ReactSession.get("configuration_id");

    if (!userId || !configurationID) {
      return false;
    }

    const payloadDetails = {
      userId: userId,
      configurationId: configurationID,
    };
    setLoading(true);

    await getHvacData(payloadDetails)
      .then((response) => {
        if (response.status === 200 && response?.data?.data?.data?.S) {
          const hvacParseData = JSON.parse(response?.data?.data?.data?.S);
          setSelectedQuestions(hvacParseData);
          setCopySelectedQuestions(hvacParseData);
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      handleGetHvacData();
    }
  }, [userId]);

  const value = {
    onSelectQuestion,
    selectedQuestions,
    loading,
    setLoading,
    handleGetHVACHeatingWarmWater,
    handleGetHVACAuxiliaryEquipment,
    heatingWarmWaterData,
    setToggle,
    toggle,
    handleSubmitHvacData,
    onCloseConfigModalHandler,
    handleAddNewConfig,
    showConfirmModal,
    setShowConfirmModal,
    isShowCreateConfig,
    setIsCreateShowConfig,
    onCreateNewConfigModalHandler,
    setHvacFormValues,
    handleFormConfig,
    setKey,
    key,
    isCompleteHeating,
    isCompleteCooling,
    isCompleteVentilation,
    isCompleteHumidification,
    isCompleteAuxi,
  };

  return (
    <HvacSystemContext.Provider value={value}>
      {children}
    </HvacSystemContext.Provider>
  );
}
