import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";

const Cooling = () => {
  const data = [
    {
      question:
        "Is active cooling available in any of the rooms in the building?",
      type: "radio",
      name: "cooling1",
      option: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    },
    {
      question:
        "Are the cooling devices connected to the building’s electricity supply (rather than getting cold water from another building)?",
      type: "radio",
      name: "cooling2",
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
    },
  ];
  return (
    <Container fluid className="main-container">
      {data.map((item, index) => (
        <>
          <QuestionAns item={item} key={index} />
          {index !== data?.length - 1 && <div className="horizontalLine"></div>}
        </>
      ))}
    </Container>
  );
};

export default Cooling;
