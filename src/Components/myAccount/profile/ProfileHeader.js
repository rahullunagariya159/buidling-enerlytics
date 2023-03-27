import React from "react";
import PlanCard from "./PlanCard.js";
import { HeaderWrapper } from "./style.js";
import UserInfo from "./UserInfo.js";
const ProfileHeader = (active) => {
  return (
    <HeaderWrapper>
      <UserInfo active={active} />
      <PlanCard />
    </HeaderWrapper>
  );
};

export default ProfileHeader;
