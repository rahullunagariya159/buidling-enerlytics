import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { yesValue } from "./hvacConstants";

const Ventilation = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const { selectedQuestions } = useHvacSystem();

  let ventilationAvailableQ = {
    question: "Do you have a mechanical ventilation system in the building?",
    type: "radio",
    name: "ventilation_available",
    questionType: "ventilation",
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

  let fanEfficiencyQ = {
    question: "Please select the ventilation fan efficiency",
    type: "dropdown",
    name: "fan_efficiency",
    questionType: "ventilation",
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
    inputBox: [{ name: "fan_efficiency_input", placeholder: "", value: "" }],
  };

  let engineElectricityQ = {
    question:
      "Is the ventilation engine’s electricity provided from your building?",
    type: "radio",
    name: "engine_electricity",
    questionType: "ventilation",
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

  let engineHeatEmissionQ = {
    question: "Is the ventilation engine’s heat emitted into the building?",
    type: "radio",
    name: "engine_heat_emission",
    questionType: "ventilation",
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

  let heatRecoveryUnitQ = {
    question: "Does your ventilation system have a heat recovery unit?",
    type: "radio",
    name: "heat_recovery_unit",
    questionType: "ventilation",
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

  let heatRecoveryEfficiencyQ = {
    question: "Please select the heat recovery system efficiency",
    type: "dropdown",
    name: "heat_recovery_efficiency",
    questionType: "ventilation",
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
    inputBox: [
      { name: "heat_recovery_efficiency ", placeholder: "", value: "" },
    ],
  };

  useEffect(() => {
    if (selectedQuestions?.ventilation?.fan_efficiency?.selection) {
      fanEfficiencyQ.inputBox[0].value =
        selectedQuestions?.ventilation?.fan_efficiency?.value;
    }
  }, [selectedQuestions?.ventilation?.fan_efficiency?.selection]);

  useEffect(() => {
    if (selectedQuestions?.ventilation?.heat_recovery_efficiency?.selection) {
      heatRecoveryEfficiencyQ.inputBox[0].value =
        selectedQuestions?.ventilation?.heat_recovery_efficiency?.value;
    }
  }, [selectedQuestions?.ventilation?.heat_recovery_efficiency?.selection]);

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns item={ventilationAvailableQ} key={1} />
      </>
      {selectedQuestions?.ventilation?.ventilation_available === yesValue && (
        <>
          <>
            <div className="horizontalLine"></div>
            <QuestionAns
              item={fanEfficiencyQ}
              key={2}
              toggleDropdown={toggleDropdown}
              setToggleDropdown={setToggleDropdown}
            />
            <div className="horizontalLine"></div>
          </>

          <>
            <QuestionAns item={engineElectricityQ} key={3} />
            <div className="horizontalLine"></div>
          </>

          <>
            <QuestionAns item={engineHeatEmissionQ} key={4} />
            <div className="horizontalLine"></div>
          </>

          <>
            <QuestionAns item={heatRecoveryUnitQ} key={5} />
          </>

          {selectedQuestions?.ventilation?.heat_recovery_unit === yesValue && (
            <>
              <div className="horizontalLine"></div>
              <QuestionAns
                item={heatRecoveryEfficiencyQ}
                key={6}
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

export default Ventilation;
