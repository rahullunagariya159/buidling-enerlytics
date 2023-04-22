import React, { useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";

const AuxiliaryEquipment = () => {
  const [toggleVentilation, setToggleVentilation] = useState(false);
  const [selectedVentilation, setSelectedVentilation] = useState(null);
  const AuxiliaryEquipmentData = [
    {
      name: "Neglect consumption",
    },
    {
      name: "High efficiency",
    },
    {
      name: "Medium efficiency",
    },
  ];

  return (
    <Container fluid className="main-container">
      <Row className="heatingWrp">
        <Col className="questionWrp">
          <div className="question-header">
            Is there an elevator in your building that is part of your direct
            electricity bill?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="auxiliaryEquipment"
                value={"yes"}
                checked
                id="au1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="au1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="au2"
                name="auxiliaryEquipment"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="au2">
                No
              </label>
            </div>
          </div>
          <div className="horizontalLine"></div>
        </Col>
      </Row>
      <Row className="heatingWrp">
        <Col className="questionWrp">
          <div className="question-header">
            Please select the assumed efficiency of your auxiliary equipment
            (i.e. water pumps, power converters etc)?
          </div>
          <div className="secondStep hvac-Drop-down">
            <Dropdown
              className={` ${toggleVentilation ? "dropdownBox brd" : ""}`}
              onToggle={() => setToggleVentilation(!toggleVentilation)}
            >
              <Dropdown.Toggle
                variant=""
                id="dropdown-icon"
                className={`${!!toggleVentilation ? "dropdown-open" : ""}`}
              >
                {selectedVentilation ? (
                  <div className="country-items">
                    <span>{selectedVentilation?.name}</span>
                  </div>
                ) : (
                  "User Selection"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div
                  className={`${!!toggleVentilation ? "border-t" : ""}`}
                ></div>
                {AuxiliaryEquipmentData?.length > 0 &&
                  AuxiliaryEquipmentData.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setSelectedVentilation(item);
                      }}
                    >
                      <div className="items">
                        <div className="sub-items">
                          <span>{item?.name}</span>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="hvac-input">
              <div className="temp">
                <input type="text" name="heatingWaterTem" placeholder="0.25" />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuxiliaryEquipment;
