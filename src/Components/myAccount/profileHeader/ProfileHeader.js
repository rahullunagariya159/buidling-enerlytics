import React from "react";
import PlanCard from "./PlanCard.js";
import "./style.js";
import { Wrapper } from "./style.js";
import UserInfo from "./UserInfo.js";

const ProfileHeader = () => {
  return (
    <Wrapper>
      <UserInfo />
      <PlanCard />
    </Wrapper>
  );
};

export default ProfileHeader;
