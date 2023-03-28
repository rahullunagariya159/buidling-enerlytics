import React from "react";
import PlanCard from "./PlanCard.js";
import { HeaderWrapper } from "./style.js";
import UserInfo from "./UserInfo.js";
const ProfileHeader = () => {
  return (
    <HeaderWrapper>
      <UserInfo />
      <PlanCard />
    </HeaderWrapper>
  );
};

export default ProfileHeader;
