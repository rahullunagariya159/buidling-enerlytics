import React, { useState } from "react";
import Navbar from "../Navbar";
import ProfileHeader from "./profileHeader/ProfileHeader";
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

const MyAccount = () => {
  const [active, setActive] = useState(0);
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
        <RightContent>{active === 0 && <ProfileHeader />}</RightContent>
      </ContentWrapper>
    </div>
  );
};

export default MyAccount;
