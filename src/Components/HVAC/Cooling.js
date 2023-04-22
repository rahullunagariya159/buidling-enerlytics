import React, { useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";

const Cooling = () => {
  const [toggleCooling, setToggleCooling] = useState(false);
  const [selectedCooling, setSelectedCooling] = useState(null);
  const Cooling = [
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
            Is Active cooling available in any of the rooms in the building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="cooling1"
                value={"yes"}
                checked
                id="c1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="c1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="c2"
                name="cooling1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="c2">
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
            Are the cooling devices connected to the building Electricity
            Supply(rather than getting cold water from another building)?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="cooling2"
                value={"yes"}
                checked
                id="c3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="c3">
                Yes, Electric Connection
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="c4"
                name="cooling2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="c4">
                No, Cold Water Connection
              </label>
            </div>
          </div>
          <div className="horizontalLine"></div>
        </Col>
      </Row>
      <Row className="heatingWrp">
        <Col className="questionWrp">
          <div className="question-header">
            Please select the efficiency rating ("Coefficient of performance
            -COP") of cooling device?
          </div>
          <div className="secondStep hvac-Drop-down">
            <Dropdown
              className={` ${toggleCooling ? "dropdownBox brd" : ""}`}
              onToggle={() => setToggleCooling(!toggleCooling)}
            >
              <Dropdown.Toggle
                variant=""
                id="dropdown-icon"
                className={`${!!toggleCooling ? "dropdown-open" : ""}`}
              >
                {selectedCooling ? (
                  <div className="country-items">
                    <span>{selectedCooling?.name}</span>
                  </div>
                ) : (
                  "User Selection"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className={`${!!toggleCooling ? "border-t" : ""}`}></div>
                {Cooling?.length > 0 &&
                  Cooling.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setSelectedCooling(item);
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

export default Cooling;
