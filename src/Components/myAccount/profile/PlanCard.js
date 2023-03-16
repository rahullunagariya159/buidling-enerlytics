import React from "react";
import { useState } from "react";
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
const PlanCard = () => {
  const [plan, setPlan] = useState(true);
  return (
    <PlanInfo>
      <PlanVerticalLine />
      <ActiveCard plan={plan}>
        <ActivePlanContent>
          <YellowLabel plan={plan}>Active plan</YellowLabel>
          <YellowLargeLabel plan={plan}>
            {plan ? "Trial" : "Home"}
          </YellowLargeLabel>
          <UnderlineText onClick={() => setPlan(!plan)}>
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
