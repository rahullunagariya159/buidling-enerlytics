import React from "react";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import { ReactSession } from "react-client-session";

import "./App.css";
import { Account } from "./Components/Account";
import Login from "./Components/Login";
import Status from "./Components/Status";
import Dashboard from "./Components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Amplify } from "aws-amplify";
import LoadProject from "./Components/LoadProject";
import BEModal from "./Components/BEModal";
import BEModalFull from "./Components/BEModalFull";
import BuildingMaterial from "./Components/buildingMaterial/BuildingMaterial";
import ContactUs from "./Components/ContactUs";
import Pricing from "./Components/Pricing";
import AboutUs from "./Components/AboutUs";
import { AuthProvider } from "./Context/AuthProvider";
import { BuildingMaterialProvider } from "./Context/BuildingMaterialProvider";
import MyAccount from "./Components/myAccount/MyAccount";
import PrivateRoute from "./Layout/PrivateRoute";
import { Routes as appRoutes } from "./navigation/Routes";
import HVAC from "./Components/HVAC/HVAC";

Amplify.configure({
  // Auth: {
  //   region: 'ap-south-1',
  //   userPoolId: 'ap-south-1_S42m5ed3P',
  //   userPoolWebClientId: 'jeila6q7hfeksf3uq2e8jhdfb',
  //   mandatorySignIn: false,
  //   oauth: {
  //     domain: 'building-social-pool.auth.ap-south-1.amazoncognito.com',
  //     scope: ['openid', 'aws.cognito.signin.user.admin'],
  //     // redirectSignIn: 'http://localhost:3000/dashboard',
  //     // redirectSignOut: 'http://localhost:3000/',
  //     redirectSignIn: 'https://dev.buildingenerlytics.com/dashboard',
  //     redirectSignOut: 'https://dev.buildingenerlytics.com/',
  //     responseType: 'code'
  //   }
  // }
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_Gbm4J4Kio",
    userPoolWebClientId: "5ea5mmhts3s8if5o3ti05m5o9b",
    mandatorySignIn: false,
    oauth: {
      domain: "building-user-pool.auth.eu-central-1.amazoncognito.com",
      scope: ["openid", "aws.cognito.signin.user.admin"],
      // redirectSignIn: "http://localhost:3000/dashboard",
      // redirectSignOut: "http://localhost:3000/",
      redirectSignIn: "https://dev.buildingenerlytics.com/dashboard",
      redirectSignOut: "https://dev.buildingenerlytics.com/",
      responseType: "code",
    },
  },
});

function App() {
  ReactSession.setStoreType("localStorage");

  return (
    <Account>
      <Status />
      <ToastContainer />
      <BrowserRouter>
        <AuthProvider>
          <BuildingMaterialProvider>
            <Routes>
              <Route path={appRoutes.home} element={<Login />} />
              <Route path={appRoutes.dashboard} element={<Dashboard />} />
              <Route path={appRoutes.loadProject} element={<LoadProject />} />
              <Route path={appRoutes.createProject} element={<BEModal />} />
              <Route path={appRoutes.beModel} element={<BEModalFull />} />
              <Route
                path={appRoutes.buildingMaterial}
                element={<BuildingMaterial />}
              />
              <Route path={appRoutes.hvac} element={<HVAC />} />
              <Route path={appRoutes.contactUs} element={<ContactUs />} />
              <Route path={appRoutes.pricing} element={<Pricing />} />
              <Route path={appRoutes.aboutUs} element={<AboutUs />} />
              <Route exact path={appRoutes.home} element={<PrivateRoute />}>
                <Route path={appRoutes.profile} element={<MyAccount />} />
              </Route>
            </Routes>
          </BuildingMaterialProvider>
        </AuthProvider>
      </BrowserRouter>
    </Account>
  );
}

export default App;
