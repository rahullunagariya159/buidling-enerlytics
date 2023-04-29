import React, { useContext, useEffect, useState, useMemo } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { hvacTabs } from "../Components/HVAC/hvacConstants";
import {
  getHVACHeatingWarmWater,
  getHVACAuxiliaryEquipment,
  saveHvacData,
  getHvacData,
} from "../Components/Services/HvacSystemService";
import { useAuth } from "../Context/AuthProvider";

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

  const navigation = useNavigate();
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [heatingWarmWaterData, setHeatingWarmWaterData] = useState({});
  const [toggle, setToggle] = useState(false);
  const { userId } = useAuth();

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

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

  const handleSubmitHvacData = async (formValues) => {
    setLoading(true);
    let hvacData = { ...selectedQuestions };

    hvacData.heating.heating_system_transmission_losses =
      formValues?.heating_system_transmission_losses;
    hvacData.heating.heating_system_distribution_losses =
      formValues?.heating_system_distribution_losses;
    hvacData.heating.warm_water_storage_losses =
      formValues?.warm_water_storage_losses;
    hvacData.heating.warm_water_distribution_losses =
      formValues?.warm_water_distribution_losses;
    hvacData.heating.radiator_surface_area = "34";
    hvacData.auxiliary_equipment.load_operating_hours =
      formValues?.load_operating_hours;
    hvacData.auxiliary_equipment.load_non_operating_hours =
      formValues?.load_non_operating_hours;

    console.log("final data", hvacData);
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
      data: hvacData,
    };

    await saveHvacData(hvacPayload)
      .then((response) => {
        console.log({ response });
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setLoading(false);
      });
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

    getHvacData(payloadDetails)
      .then((response) => {
        console.log({ response });
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
  };

  return (
    <HvacSystemContext.Provider value={value}>
      {children}
    </HvacSystemContext.Provider>
  );
}
