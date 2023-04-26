import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";

const HeatingWarm = () => {
  let question1 = {
    question:
      "Is space heating and/or warm water available in any of the rooms in the building?",
    type: "radio",
    name: "heating_warm_water_available",
    questionType: "heating",
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

  let question2 = {
    question:
      "Is your heating / warm water system in an unheated space (e.g. in an unheated basement)?",
    type: "radio",
    name: "question2",
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

  let question3 = {
    question: "Is the system (connections, pipes) well insulated?",
    type: "radio",
    name: "question3",
    option: [
      {
        label: "Yes, very well",
        value: "Yes, very well",
      },
      {
        label: "Quite okay",
        value: "Quite okay",
      },
      {
        label: "Rather poorly",
        value: "Rather poorly",
      },
    ],
  };

  let question4 = {
    question: "How is the heating energy transmitted into the rooms?",
    type: "checkbox",
    name: "question4",
    option: [
      {
        label: "In-floor heating",
        value: "In-floor heating",
      },
      {
        label: "Radiators",
        value: "Radiators",
      },
      {
        label: "Ventilation system",
        value: "Ventilation system",
      },
    ],
  };

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns item={question1} key={1} />
        <div className="horizontalLine"></div>
      </>

      <>
        <>
          <QuestionAns item={question2} key={2} />
          <div className="horizontalLine"></div>
        </>

        <>
          <QuestionAns item={question3} key={3} />
          <div className="horizontalLine"></div>
        </>

        <>
          <QuestionAns item={question4} key={4} />
        </>
      </>
      {/* {data.map((item, index) => (
        <>
          <QuestionAns item={item} key={index} />
          {index !== data?.length - 1 && <div className="horizontalLine"></div>}
        </>
      ))} */}
    </Container>
  );
};

export default HeatingWarm;
