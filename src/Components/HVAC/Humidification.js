import React, { useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";

const Humidification = () => {
  const [toggleVentilation, setToggleVentilation] = useState(false);
  const [selectedVentilation, setSelectedVentilation] = useState(null);
  const HumidificationData = [
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
            Does your ventilation system provide humidification?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="humidification1"
                value={"yes"}
                checked
                id="hu1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="hu2"
                name="humidification1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu2">
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
            Does your ventilation system provide de-humidification?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="humidification2"
                value={"yes"}
                checked
                id="hu3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu3">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="hu4"
                name="humidification2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu4">
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
            Does your ventilation system recover moisture?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="humidification3"
                value={"yes"}
                checked
                id="hu5"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu5">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="hu6"
                name="humidification3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="hu6">
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
            Please select the moisture recovery efficiency.
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
                {HumidificationData?.length > 0 &&
                  HumidificationData.map((item, index) => (
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

export default Humidification;
