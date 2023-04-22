import React from "react";

import Steps, { Step } from "rc-steps";
import "rc-steps/assets/index.css";
import "rc-steps/assets/iconfont.css";

const STATUS_ICON = {
  DEFAULT: "assets/img/hvac/checked-default.svg",
  VERIFIED: "assets/img/hvac/checked-verified.svg",
  QUESTION: "assets/img/hvac/question-mark.svg",
};

const StepsProgress = ({ steps }) => {
  const getIcon = (status) => {
    switch (status) {
      case "process":
        return STATUS_ICON.DEFAULT;
      case "error":
        return STATUS_ICON.QUESTION;
      case "finish":
        return STATUS_ICON.VERIFIED;
      default:
        break;
    }
  };
  return (
    <Steps direction="vertical" current={1} status="error">
      {steps.map(({ title, description, status = "error" }) => (
        <Step
          title={title}
          status={status}
          icon={<img src={getIcon(status)} alt="images" />}
        />
      ))}
    </Steps>
  );
};
export default StepsProgress;
