import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";

const Humidification = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const data = [
    {
      question: "Does your ventilation system provide humidification?",
      type: "radio",
      name: "humidification1",
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
      question: "Does your ventilation system provide de-humidification?",
      type: "radio",
      name: "humidification2",
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
      question: "Does your ventilation system recover moisture?",
      type: "radio",
      name: "humidification3",
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
      question: "Please select the moisture recovery efficiency",
      type: "dropdown",
      name: "humidification4",
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
    },
  ];
  return (
    <Container fluid className="main-container-hvac">
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

export default Humidification;
