import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { yesValue } from "./hvacConstants";

const Humidification = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const { selectedQuestions } = useHvacSystem();

  let humidificationAvailableQ = {
    question: "Does your ventilation system provide humidification?",
    type: "radio",
    name: "humidification_available",
    questionType: "humidification",
    option: [
      {
        label: "Yes",
        value: "Yes",
      },
      {
        label: "No",
        value: "No",
      },
    ],
  };

  let dehumidificationAvailableQ = {
    question: "Does your ventilation system provide de-humidification?",
    type: "radio",
    name: "dehumidification_available",
    questionType: "humidification",
    option: [
      {
        label: "Yes",
        value: "Yes",
      },
      {
        label: "No",
        value: "No",
      },
    ],
  };

  let recoverMoistureQ = {
    question: "Does your ventilation system recover moisture?",
    type: "radio",
    name: "recover_moisture",
    questionType: "humidification",
    option: [
      {
        label: "Yes",
        value: "Yes",
      },
      {
        label: "No",
        value: "No",
      },
    ],
  };

  let recoveryEfficiencyQ = {
    question: "Please select the moisture recovery efficiency",
    type: "dropdown",
    name: "recovery_efficiency",
    questionType: "humidification",
    option: [
      {
        name: "Custom",
        value: "",
      },
      {
        name: "High",
        value: "10",
      },
      {
        name: "Medium",
        value: "5",
      },
      {
        name: "Low",
        value: "1",
      },
    ],
    inputBox: [{ name: "recovery_efficiency", placeholder: "", value: "" }],
  };

  useEffect(() => {
    if (selectedQuestions?.humidification?.recovery_efficiency?.selection) {
      recoveryEfficiencyQ.inputBox[0].value =
        selectedQuestions?.humidification?.recovery_efficiency?.value;
    }
  }, [selectedQuestions?.humidification?.recovery_efficiency?.selection]);

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns item={humidificationAvailableQ} key={1} />
        <div className="horizontalLine"></div>
      </>

      <>
        <QuestionAns item={dehumidificationAvailableQ} key={2} />
      </>

      {selectedQuestions?.humidification?.humidification_available ===
        yesValue && (
        <>
          <>
            <div className="horizontalLine"></div>
            <QuestionAns item={recoverMoistureQ} key={3} />
          </>

          {selectedQuestions?.humidification?.recover_moisture === yesValue && (
            <>
              <div className="horizontalLine"></div>
              <QuestionAns
                item={recoveryEfficiencyQ}
                key={4}
                toggleDropdown={toggleDropdown}
                setToggleDropdown={setToggleDropdown}
              />
              <div className="horizontalLine"></div>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Humidification;
