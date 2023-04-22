import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";

const Ventilation = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const data = [
    {
      question: "Do you have a mechanical ventilation system in the building?",
      type: "radio",
      name: "ventilation1",
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
      question: "Please select the ventilation fan efficiency",
      type: "dropdown",
      name: "ventilation2",
      option: [
        {
          name: "Neglect consumption",
          value: "Neglect consumption",
        },
        {
          name: "High efficiency",
          value: "High efficiency",
        },
        {
          name: "Medium efficiency",
          value: "Medium efficiency",
        },
        {
          name: "Low efficiency",
          value: "Low efficiency",
        },
      ],
      inputBox: [{ name: "ventilation1 ", placeholder: "0.25" }],
    },
    {
      question:
        "Is the ventilation engine’s electricity provided from your building?",
      type: "radio",
      name: "ventilation3",
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
      question: "Is the ventilation engine’s heat emitted into the building?",
      type: "radio",
      name: "ventilation4",
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
      question: "Does your ventilation system have a heat recovery unit?",
      type: "radio",
      name: "ventilation5",
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
      question: "Please select the heat recovery system efficiency",
      type: "dropdown",
      name: "ventilation6",
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
      inputBox: [{ name: "ventilation2 ", placeholder: "0.25" }],
    },
  ];
  return (
    <Container fluid className="main-container">
      {data.map((item, index) => (
        <>
          <QuestionAns
            item={item}
            key={index}
            toggleDropdown={toggleDropdown}
            setToggleDropdown={setToggleDropdown}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          {index !== data?.length - 1 && <div className="horizontalLine"></div>}
        </>
      ))}
    </Container>
  );
};

export default Ventilation;
