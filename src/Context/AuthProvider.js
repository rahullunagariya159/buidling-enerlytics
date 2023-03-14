import React, { useContext, useEffect, useState, useMemo } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { toast } from "react-toastify";

import { getPlans } from "../Components/Services/UserService";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// =============================================================================
// AUTH PROVIDER FUNCTIONS
// =============================================================================

export function AuthProvider({ children }) {
  const navigation = useNavigate();
  const location = useLocation();
  // =========================================================================
  // STATES
  // =========================================================================
  const [user, setUser] = useState();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  // user detail
  const [userdetails, setUserDetails] = useState(null);
  // error state
  const [errorstate, setErrorState] = useState(false);
  const [customState, setCustomState] = useState(null);
  const [currentPlanDetails, setCurrentPlanDetails] = useState([]);
  const [isOpenChoosePlanPopup, setIsOpenChoosePlanPopup] = useState(false);
  const [searchParams] = useSearchParams();
  const isGuestUser = searchParams.get("skip") || false;
  const [isLoggedIn, setLoggedInStatus] = useState(
    ReactSession.get("is_logged_in"),
  );

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

  const checkPlans = (ID) => {
    if (!ID) {
      return false;
    }
    const payload = {
      type: "VERIFY",
      userId: ID,
    };
    getPlans(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else if (response?.msg?.Count > 0) {
        setCurrentPlanDetails(response?.msg?.Items);
      } else if (response?.msg?.Count === 0) {
        setIsOpenChoosePlanPopup(true);
      }
    });
  };

  const checkAuth = async (ignore = true) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();
      let idToken = currentSession.getIdToken();

      if (user) {
        setUser(user);

        ReactSession.set("building_social_user", user?.attributes?.email);
        ReactSession.set("is_logged_in", "true");
        setLoggedInStatus("true");

        try {
          setUserDetails(user);
          // history.push('/')
        } catch (error) {
          setErrorState(true);
          console.log("ERROR", error);
        }
      } else {
        setLoading(false);
      }

      if (idToken && !userId) {
        let email = idToken.payload.email;
        setUserId(email);
        ReactSession.set("building_social_user", email);
        ReactSession.set("is_logged_in", "true");
        setLoggedInStatus("true");
      }

      setLoggedInStatus(ReactSession.get("is_logged_in"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signintoapp = async () => {
    try {
      await checkAuth(true);
    } catch (error) {
      setErrorState(true);
    }
  };

  useEffect(() => {
    try {
      const unsubscribe = Hub.listen("auth", (data) => {
        const { payload } = data;
        console.log("A new auth event has happened: ", data);
        if (payload.event === "signIn") {
          signintoapp();
        }
        if (payload.event === "signOut") {
          setUser(null);
        }
        if (payload.event === "customOAuthState") {
          setCustomState(payload.data);
        }
      });
      checkAuth();

      return unsubscribe;
    } catch (e) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ReactSession.set("guest_state", location.pathname);
    let IDVal = null;
    if (
      ReactSession.get("amplify-signin-with-hostedUI") == "true" ||
      ReactSession.get("amplify-redirected-from-hosted-ui") == "true"
    ) {
      ReactSession.set("is_logged_in", "true");
      setLoggedInStatus("true");
    }

    if (isGuestUser) {
      IDVal = ReactSession.get("guest_user_id");
      setUserId(IDVal);
    } else {
      IDVal =
        ReactSession.get("building_user") &&
        ReactSession.get("building_user") !== "null"
          ? ReactSession.get("building_user")
          : ReactSession.get("building_social_user");
      setUserId(IDVal);
    }

    if (
      localStorage.getItem("amplify-signin-with-hostedUI") == "true" ||
      localStorage.getItem("amplify-redirected-from-hosted-ui") == "true" ||
      ReactSession.get("user_email_registered") == "true"
    ) {
      ReactSession.set("is_logged_in", "true");
      setLoggedInStatus("true");
    }
  }, [userId]);

  useMemo(() => {
    if (userId) {
      checkPlans(userId);
    }
  }, [userId]);

  const value = {
    user,
    loading,
    userdetails,
    checkAuth,
    customState,
    userId,
    isLoggedIn,
    currentPlanDetails,
    setCurrentPlanDetails,
    isOpenChoosePlanPopup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
