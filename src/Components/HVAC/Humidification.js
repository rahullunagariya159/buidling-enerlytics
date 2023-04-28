import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { yesValue } from "./hvacConstants";

const Humidification = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
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
        name: "Neglect consumptions",
        value: "Neglect consumptions",
      },
      {
        name: "High efficiencies",
        value: "High efficiencies",
      },
      {
        name: "Medium efficiencies",
        value: "Medium efficiencies",
      },
      {
        name: "Low efficiencies",
        value: "Low efficiencies",
      },
    ],
    inputBox: [{ name: "moistureRecovery", placeholder: "" }],
  };

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns item={humidificationAvailableQ} key={1} />
      </>
      {selectedQuestions?.humidification?.humidification_available ===
        yesValue && (
        <>
          <>
            <div className="horizontalLine"></div>

            <QuestionAns item={dehumidificationAvailableQ} key={2} />
            <div className="horizontalLine"></div>
          </>

          <>
            <QuestionAns item={recoverMoistureQ} key={3} />
            <div className="horizontalLine"></div>
          </>

          <>
            <QuestionAns
              item={recoveryEfficiencyQ}
              key={4}
              toggleDropdown={toggleDropdown}
              setToggleDropdown={setToggleDropdown}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
            <div className="horizontalLine"></div>
          </>
        </>
      )}
    </Container>
  );
};

export default Humidification;
