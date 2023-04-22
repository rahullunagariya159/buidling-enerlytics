import React, { useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";

const Ventilation = () => {
  const [toggleVentilation, setToggleVentilation] = useState(false);
  const [selectedVentilation, setSelectedVentilation] = useState(null);
  const Ventilation = [
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
            Do you have a mechanical ventilation system in the building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="ventilation1"
                value={"yes"}
                checked
                id="v1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="v2"
                name="ventilation1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v2">
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
            What is the supply temperature of the heating water?
          </div>
          <div className="secondStep hvac-Drop-down ventilation">
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
                {Ventilation?.length > 0 &&
                  Ventilation.map((item, index) => (
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
          <div className="horizontalLine"></div>
        </Col>
      </Row>
      <Row className="heatingWrp">
        <Col className="questionWrp">
          <div className="question-header">
            Do you have a mechanical ventilation system in the building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="ventilation2"
                value={"yes"}
                checked
                id="v3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v3">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="v4"
                name="ventilation2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v4">
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
            Do you have a mechanical ventilation system in the building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="ventilation3"
                value={"yes"}
                checked
                id="v5"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v5">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="v6"
                name="ventilation3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v6">
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
            Do you have a mechanical ventilation system in the building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="ventilation4"
                value={"yes"}
                checked
                id="v7"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v7">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="v8"
                name="ventilation4"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="v8">
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
            What is the supply temperature of the heating water?
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
                {Ventilation?.length > 0 &&
                  Ventilation.map((item, index) => (
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

export default Ventilation;
