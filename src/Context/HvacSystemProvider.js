import React, { useContext, useEffect, useState, useMemo } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { hvacTabs } from "../Components/HVAC/hvacConstants";
import { getHVACHeatingWarmWater } from "../Components/Services/HvacSystemService";

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
    } else {
      selQuestions[questionType] = {
        ...selQuestions[questionType],
        [key]: value,
      };
    }

    setSelectedQuestions(selQuestions);

    // console.log({ questionType });
    // console.log({ key });
    // console.log({ value });
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

  const value = {
    onSelectQuestion,
    selectedQuestions,
    loading,
    setLoading,
    handleGetHVACHeatingWarmWater,
    heatingWarmWaterData,
    setToggle,
    toggle,
  };

  return (
    <HvacSystemContext.Provider value={value}>
      {children}
    </HvacSystemContext.Provider>
  );
}
