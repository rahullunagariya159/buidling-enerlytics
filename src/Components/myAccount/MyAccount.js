import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Profile from "./profile/Profile";
import PromoCode from "./promoCode/PromoCode";
import "./style.js";
import {
  ContentWrapper,
  HeaderWrapper,
  MenuItems,
  PathTitle,
  RightContent,
  SettingTitle,
  SidebarMenu,
  TextWrp,
  Title,
} from "./style.js";
import SubscriptionPlan from "./subscriptionPlan/SubscriptionPlan";
import { useAuth } from "../../Context/AuthProvider";
import { Routes } from "../../navigation/Routes";

const MyAccount = () => {
  const [active, setActive] = useState(0);
  const { userId } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <HeaderWrapper>
        <PathTitle>{"Home > BE Modeler"}</PathTitle>
        <Title>MY ACCOUNT</Title>
      </HeaderWrapper>
      <ContentWrapper>
        <SidebarMenu>
          <SettingTitle>
            <TextWrp>Settings</TextWrp>
          </SettingTitle>
          <MenuItems
            active={active === 0 ? "active" : ""}
            onClick={() => setActive(0)}
          >
            Profile
          </MenuItems>
          <MenuItems
            active={active === 1 ? "active" : ""}
            onClick={() => setActive(1)}
          >
            My subscription plan
          </MenuItems>
          <MenuItems
            active={active === 2 ? "active" : ""}
            onClick={() => setActive(2)}
          >
            Promo Code
          </MenuItems>
        </SidebarMenu>
        <RightContent>
          {active === 0 && <Profile />}
          {active === 1 && <SubscriptionPlan active={1} />}
          {active === 2 && <PromoCode />}
        </RightContent>
      </ContentWrapper>
    </div>
  );
};

export default MyAccount;
