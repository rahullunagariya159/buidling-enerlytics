import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ReactSession } from 'react-client-session';

import './App.css';
import { Account } from './Components/Account';
import Login from './Components/Login';
import Status from './Components/Status';
import Dashboard from './Components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Amplify } from 'aws-amplify';
import LoadProject from './Components/LoadProject';
import BEModal from './Components/BEModal';
import BEModalFull from './Components/BEModalFull';
import BuildingMaterial from './Components/BuildingMaterial';
import ContactUs from './Components/ContactUs';
import Pricing from './Components/Pricing';
import AboutUs from './Components/AboutUs';

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
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_Gbm4J4Kio',
    userPoolWebClientId: '5ea5mmhts3s8if5o3ti05m5o9b',
    mandatorySignIn: false,
    oauth: {
      domain: 'building-user-pool.auth.eu-central-1.amazoncognito.com',
      scope: ['openid', 'aws.cognito.signin.user.admin'],
      // redirectSignIn: 'http://localhost:3000/dashboard',
      // redirectSignOut: 'http://localhost:3000/',
      redirectSignIn: 'https://dev.buildingenerlytics.com/dashboard',
      redirectSignOut: 'https://dev.buildingenerlytics.com/',
      responseType: 'code'
    }
  }
});

function App() {
  ReactSession.setStoreType("localStorage");

  return (
    <Account>
      <Status />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/load-project" element={<LoadProject />} />
          <Route path="/create-project" element={<BEModal />} />
          <Route path="/be-model" element={<BEModalFull />} />
          <Route path="/building-material" element={<BuildingMaterial />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </Account>
  );
}

export default App;
