import React from "react";
import { HorizontalLine } from "../profile/editProfile/style";
import ProfileHeader from "../profile/ProfileHeader";
import { Wrapper } from "./style.js";
import SubscriptionContent from "./SubscriptionContent";
const SubscriptionPlan = (active) => {
  return (
    <Wrapper>
      <ProfileHeader active={active} />
      <HorizontalLine />
      <SubscriptionContent />
    </Wrapper>
  );
};

export default SubscriptionPlan;
