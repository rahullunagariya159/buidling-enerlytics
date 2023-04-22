import React from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";

const AuxiliaryEquipment = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const data = [
    {
      question:
        "Is there an elevator in your building that is part of your direct electricity bill (NOT part of your utilities statement)?",
      type: "radio",
      name: "auxiliaryEquipment1",
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
        "Please select the assumed efficiency of your auxiliary equipment (i.e. water pumps, power converters etc.).",
      type: "dropdown",
      name: "auxiliaryEquipment2",
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

export default AuxiliaryEquipment;
