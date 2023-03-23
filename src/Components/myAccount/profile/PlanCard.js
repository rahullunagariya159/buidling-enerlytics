import React, { useState, useEffect } from "react";
import "./style.js";
import {
  PlanInfo,
  PlanVerticalLine,
  ActiveCard,
  PlanLogo,
  ActivePlanContent,
  YellowLabel,
  YellowLargeLabel,
  UnderlineText,
} from "./style.js";
import { useAuth } from "../../../Context/AuthProvider";

const PlanCard = () => {
  const [plan, setPlan] = useState(false);
  const { userProfileDetails } = useAuth();

  const handleUpgrdePlan = (e) => {
    e.preventDefault();
    document.getElementById("enablePlans").click();
  };

  useEffect(() => {
    if (userProfileDetails?.plan !== "Trial") {
      setPlan(true);
    }
  }, [userProfileDetails?.plan]);

  return (
    <PlanInfo>
      <PlanVerticalLine />
      <ActiveCard plan={plan}>
        <ActivePlanContent>
          <YellowLabel plan={plan}>Active plan</YellowLabel>
          <YellowLargeLabel plan={plan}>
            {userProfileDetails?.plan ? userProfileDetails?.plan : "Trial"}
          </YellowLargeLabel>
          <UnderlineText onClick={(e) => handleUpgrdePlan(e)}>
            Upgrade now
          </UnderlineText>
        </ActivePlanContent>
        <PlanLogo>
          <img src="assets/img/profile/premium.png" alt="" />
        </PlanLogo>
      </ActiveCard>
    </PlanInfo>
  );
};

export default PlanCard;
