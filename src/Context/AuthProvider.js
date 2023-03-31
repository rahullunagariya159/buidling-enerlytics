import React, { useContext, useEffect, useState, useMemo } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { toast } from "react-toastify";

import { getPlans } from "../Components/Services/UserService";
import {
  getUserDetails,
  getCreditCardsList,
} from "../Components/Services/UserProfileService";

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
  const [userProfileDetails, setUserProfileDetails] = useState({});

  // error state
  const [errorstate, setErrorState] = useState(false);
  const [customState, setCustomState] = useState(null);
  const [currentPlanDetails, setCurrentPlanDetails] = useState([]);
  const [isOpenChoosePlanPopup, setIsOpenChoosePlanPopup] = useState(false);
  const [creditCardList, setCreditCardList] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  // const [authIdentity, setAuthIdentity] = useState();
  const [searchParams] = useSearchParams();
  const isGuestUser = searchParams.get("skip") || false;
  const [isLoggedIn, setLoggedInStatus] = useState(
    ReactSession.get("is_logged_in"),
  );

  // console.log({ authIdentity });

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

  const getCreditCards = async (userId) => {
    await getCreditCardsList(userId).then((response) => {
      if (response?.error) {
        toast.error(response?.error || "Something went wrong");
      }
      if (response?.status === 200 && response?.data?.data) {
        setCreditCardList(response?.data?.data);
      }
    });
  };

  const getUserInfo = async (userId) => {
    await getUserDetails(userId).then((response) => {
      if (response?.error) {
        toast.error(response?.error || "Something went wrong");
      }
      if (response?.status === 200 && response?.data?.data) {
        setUserProfileDetails(response?.data?.data);
        if (
          !response?.data?.data?.plan &&
          Number(response?.data?.data?.credits) === 0
        ) {
          setIsOpenChoosePlanPopup(true);
        }
      }
    });
  };

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

      console.log({ currentSession });
      // setAuthIdentity(idToken?.payload?.identities?.[0]?.providerName);
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
        // console.log("check auth provider",data?.payload?.da)
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
      getUserInfo(userId);
      getCreditCards(userId);
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
    userProfileDetails,
    creditCardList,
    isAddingCard,
    setIsAddingCard,
    getCreditCards,
    getUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
