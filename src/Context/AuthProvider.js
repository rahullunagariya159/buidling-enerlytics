import React, { useContext, useEffect, useState } from "react";
import { Auth, Hub } from "aws-amplify";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  // user detail
  const [userdetails, setUserDetails] = useState(null);
  // error state
  const [errorstate, setErrorState] = useState(false);

  // ========================================================================
  // FUNCTIONS
  // =========================================================================

  const checkAuth = async (ignore = true) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();

      if (user) {
        setUser(user);

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
      Hub.listen("auth", (data) => {
        const { payload } = data;
        console.log("A new auth event has happened: ", data);
        if (payload.event === "signIn") {
          console.log("a user has signed in!");
          signintoapp();
        }
        if (payload.event === "signOut") {
          console.log("a user has signed out!");
          setUser(null);
        }
      });
      //   checkAuth();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    userdetails,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
