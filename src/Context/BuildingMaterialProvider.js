import React, { useContext, useEffect, useState, useMemo } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const BuildingMaterialContext = React.createContext();

export function useBuildingMaterial() {
  return useContext(BuildingMaterialContext);
}

// =============================================================================
// BUILDING MATERIAL PROVIDER FUNCTIONS
// =============================================================================

export function BuildingMaterialProvider({ children }) {
  const navigation = useNavigate();
  const location = useLocation();
  // =========================================================================
  // STATES
  // =========================================================================

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

  const value = {};

  return (
    <BuildingMaterialContext.Provider value={value}>
      {children}
    </BuildingMaterialContext.Provider>
  );
}
