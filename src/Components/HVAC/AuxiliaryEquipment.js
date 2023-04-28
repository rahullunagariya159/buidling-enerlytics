import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import QuestionAns from "./QuestionAns";
import { useState } from "react";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { yesValue } from "./hvacConstants";

const AuxiliaryEquipment = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const { selectedQuestions, handleGetHVACAuxiliaryEquipment } =
    useHvacSystem();

  let elevatorElectricityBillQ = {
    question:
      "Is there an elevator in your building that is part of your direct electricity bill (NOT part of your utilities statement)?",
    type: "radio",
    name: "elevator_electricity_bill",
    questionType: "auxiliary_equipment",
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

  let assumedEfficiencyQ = {
    question:
      "Please select the assumed efficiency of your auxiliary equipment (i.e. water pumps, power converters etc.).",
    type: "dropdown",
    name: "assumed_efficiency",
    questionType: "auxiliary_equipment",
    option: [
      {
        name: "Neglect consumptions",
        value: "Neglect consumptions",
      },
      {
        name: "High efficiencies",
        value: "High efficiency",
      },
      {
        name: "Medium efficiencies",
        value: "Medium efficiency",
      },
      {
        name: "Low efficiencies",
        value: "Low efficiency",
      },
    ],
  };

  useEffect(() => {
    if (
      selectedQuestions?.auxiliary_equipment?.elevator_electricity_bill ===
        yesValue &&
      selectedQuestions?.auxiliary_equipment?.assumed_efficiency
    ) {
      handleGetHVACAuxiliaryEquipment();
    }
  }, [
    selectedQuestions?.auxiliary_equipment?.elevator_electricity_bill,
    selectedQuestions?.auxiliary_equipment?.assumed_efficiency,
  ]);

  return (
    <Container fluid className="main-container-hvac">
      <>
        <QuestionAns
          item={elevatorElectricityBillQ}
          key={1}
          toggleDropdown={toggleDropdown}
          setToggleDropdown={setToggleDropdown}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </>

      {selectedQuestions?.auxiliary_equipment?.elevator_electricity_bill ===
        yesValue && (
        <>
          <div className="horizontalLine"></div>
          <QuestionAns
            item={assumedEfficiencyQ}
            key={2}
            toggleDropdown={toggleDropdown}
            setToggleDropdown={setToggleDropdown}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          <div className="horizontalLine"></div>
        </>
      )}
    </Container>
  );
};

export default AuxiliaryEquipment;
