import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { yesValue } from "./hvacConstants";

const Cooling = () => {
  const { selectedQuestions } = useHvacSystem();

  let coolingQuestion1 = {
    question:
      "Is active cooling available in any of the rooms in the building?",
    type: "radio",
    name: "cooling_available",
    questionType: "cooling",
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

  let coolingQuestion2 = {
    question:
      "Are the cooling devices connected to the building’s electricity supply (rather than getting cold water from another building)?",
    type: "radio",
    name: "devices_connected_via",
    questionType: "cooling",
    option: [
      {
        label: "Yes, electrical connection",
        value: "Yes, electrical connection",
      },
      {
        label: "No, cold water connection",
        value: "No, cold water connection",
      },
    ],
  };

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns item={coolingQuestion1} key={1} />
      </>

      {selectedQuestions?.cooling?.cooling_available === yesValue && (
        <>
          <div className="horizontalLine"></div>
          <QuestionAns item={coolingQuestion2} key={2} />
        </>
      )}
    </Container>
  );
};

export default Cooling;
