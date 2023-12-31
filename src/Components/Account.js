import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import React, { createContext } from "react";
import UserPool from "../UserPool";
import { Auth } from "aws-amplify";
import "../aws-exports";

const AccountContext = createContext();

const Account = (props) => {
  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
    });
  };

  const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool: UserPool,
      });

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log("login success", result);
          resolve(result);
        },
        onFailure: (err) => {
          console.log("login failure", err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log("new password required", data);
          resolve(data);
        },
      });
    });
  };

  const logout = () => {
    const user = UserPool.getCurrentUser();

    if (!user) {
      Auth.signOut();
    } else {
      console.log("else inn");
      user.signOut();
    }

    window.location.href = "/";
  };

  return (
    <AccountContext.Provider value={{ authenticate, getSession, logout }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
