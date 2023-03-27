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
import { useAuth } from "../../../../Context/AuthProvider";

const PersonalDetails = ({ childToParent }) => {
  const { userProfileDetails } = useAuth();

  const handleUpgrdePlan = (e) => {
    e.preventDefault();
    document.getElementById("enablePlans").click();
  };

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>PERSONAL DETAILS</HeaderTitle>
        <EditProfile onClick={() => childToParent()}>
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
          <ValueLabel>
            {" "}
            {(userProfileDetails?.first_name || "-") +
              " " +
              (userProfileDetails?.last_name || "")}
          </ValueLabel>
          <ValueLabel>{userProfileDetails?.website || "-"}</ValueLabel>
          <UpgradeWrp>
            <ValueLabel>{userProfileDetails?.plan || "-"}</ValueLabel>
            <UpgradeButton onClick={(e) => handleUpgrdePlan(e)}>
              <span>Upgrade</span>
              <img src="assets/img/profile/upArrow.svg" alt="" />
            </UpgradeButton>
          </UpgradeWrp>
          <ValueLabel>{userProfileDetails?.company_name || "-"}</ValueLabel>
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
          <ValueLabel>{userProfileDetails?.country || "-"}</ValueLabel>
          <ValueLabel>{userProfileDetails?.address || "-"}</ValueLabel>
          <ValueLabel>{userProfileDetails?.apt || "-"}</ValueLabel>
          <ValueLabel>{userProfileDetails?.city || "-"}</ValueLabel>
          <ValueLabel>{userProfileDetails?.postal_code || "-"}</ValueLabel>
        </ValuesWrp>
      </PersonalInfo>
    </Wrapper>
  );
};

export default PersonalDetails;
