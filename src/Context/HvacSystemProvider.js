import React, { useContext, useEffect, useState, useMemo } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const HvacSystemContext = React.createContext();

export function useHvacSystem() {
  return useContext(HvacSystemContext);
}

// =============================================================================
// HVAC SYSTEM PROVIDER FUNCTIONS
// =============================================================================

export function HvacSystemProvider({ children }) {
  const navigation = useNavigate();
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState({});
  // =========================================================================
  // STATES
  // =========================================================================

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

  const onSelectQuestion = (type, key, value) => {
    console.log({ type });
    console.log({ key });
    console.log({ value });
  };

  const value = { onSelectQuestion };

  return (
    <HvacSystemContext.Provider value={value}>
      {children}
    </HvacSystemContext.Provider>
  );
}
