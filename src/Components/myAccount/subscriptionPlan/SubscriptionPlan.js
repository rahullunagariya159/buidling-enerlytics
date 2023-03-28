import React from "react";
import { HorizontalLine } from "../profile/editProfile/style";
import ProfileHeader from "../profile/ProfileHeader";
import { Wrapper } from "./style.js";
import SubscriptionContent from "./SubscriptionContent";
const SubscriptionPlan = () => {
  return (
    <Wrapper>
      <ProfileHeader />
      <HorizontalLine />
      <SubscriptionContent />
    </Wrapper>
  );
};

export default SubscriptionPlan;
