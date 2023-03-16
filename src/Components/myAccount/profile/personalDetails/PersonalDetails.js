import React from "react";
import {
  DecorationText,
  EditProfile,
  GrayLabel,
  Header,
  HeaderTitle,
  HorizontalLine,
  ItemsWrp,
  PersonalInfo,
  UpgradeButton,
  UpgradeWrp,
  ValueLabel,
  ValuesWrp,
  Wrapper,
} from "./style.js";
const PersonalDetails = () => {
  return (
    <Wrapper>
      <Header>
        <HeaderTitle>PERSONAL DETAILS</HeaderTitle>
        <EditProfile>
          <img src="assets/img/profile/edit.svg" alt="editProfile" />
          <DecorationText>Edit profile</DecorationText>
        </EditProfile>
      </Header>
      <HorizontalLine />
      <PersonalInfo>
        <ItemsWrp>
          <GrayLabel>Name</GrayLabel>
          <GrayLabel>Website</GrayLabel>
          <GrayLabel>Subscription type</GrayLabel>
          <GrayLabel>Company name</GrayLabel>
        </ItemsWrp>
        <ValuesWrp>
          <ValueLabel>Golden Designs</ValueLabel>
          <ValueLabel>xyz.com</ValueLabel>
          <UpgradeWrp>
            <ValueLabel>Home</ValueLabel>
            <UpgradeButton>
              Upgrade
              <img src="assets/img/profile/upArrow.svg" alt="" />
            </UpgradeButton>
          </UpgradeWrp>
          <ValueLabel>Building Enerlytics</ValueLabel>
        </ValuesWrp>
      </PersonalInfo>
      <HeaderTitle>ADDRESS DETAILS</HeaderTitle>
      <HorizontalLine />
      <PersonalInfo>
        <ItemsWrp>
          <GrayLabel>Country</GrayLabel>
          <GrayLabel>Address</GrayLabel>
          <GrayLabel>Apt, suite, etc (optional)</GrayLabel>
          <GrayLabel>City</GrayLabel>
          <GrayLabel>Postal code</GrayLabel>
        </ItemsWrp>
        <ValuesWrp>
          <ValueLabel>Canada</ValueLabel>
          <ValueLabel>41 light-catcher street</ValueLabel>
          <ValueLabel>Daden oaks</ValueLabel>
          <ValueLabel>Torronto</ValueLabel>
          <ValueLabel>L6P 1N6</ValueLabel>
        </ValuesWrp>
      </PersonalInfo>
    </Wrapper>
  );
};

export default PersonalDetails;
