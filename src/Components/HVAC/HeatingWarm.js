import React, { useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";

const HeatingWarm = () => {
  const [toggleWater, setToggleWater] = useState(false);
  const [selectedHeatingWater, setSelectedHeatingWater] = useState(null);
  const heatingWater = [
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
            Is heating / warm water available in any of the rooms in the
            building?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="heating1"
                value={"yes"}
                checked
                id="h1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="h1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="h2"
                name="heating1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="h2">
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
            Is the system(Connection Pipes) well insulated?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                name="heating2"
                value={"yes"}
                id="h3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="h3">
                Yes, very well
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="h4"
                name="heating2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="h4">
                Quite okay
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="h5"
                name="heating2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="h5">
                Rather poorly
              </label>
            </div>
          </div>
          <div className="horizontalLine"></div>
        </Col>
      </Row>
      <Row className="heatingWrp">
        <Col className="questionWrp">
          <div className="question-header">
            How is the heating energy transmitted into the rooms?
          </div>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="checkbox"
                className="checkboxWrp"
                name="heating3"
                value={"yes"}
                id="h6"
              />
              <label
                className="instedCheckbox no-1 build-eng-efficient"
                htmlFor="h6"
              >
                In-floor heating
              </label>
            </div>
            <div className="form-one">
              <input
                type="checkbox"
                className="checkboxWrp"
                value={"no"}
                id="h7"
                name="heating3"
              />
              <label
                className="instedCheckbox no-1 build-eng-efficient"
                htmlFor="h7"
              >
                Radiators
              </label>
            </div>
            <div className="form-one">
              <input
                type="checkbox"
                className="checkboxWrp"
                value={"no"}
                id="h8"
                name="heating3"
              />
              <label
                className="instedCheckbox no-1 build-eng-efficient"
                htmlFor="h8"
              >
                Ventilation system
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
              className={` ${toggleWater ? "dropdownBox brd" : ""}`}
              onToggle={() => setToggleWater(!toggleWater)}
            >
              <Dropdown.Toggle
                variant=""
                id="dropdown-icon"
                className={`${!!toggleWater ? "dropdown-open" : ""}`}
              >
                {selectedHeatingWater ? (
                  <div className="country-items">
                    <span>{selectedHeatingWater?.name}</span>
                  </div>
                ) : (
                  "User Selection"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className={`${!!toggleWater ? "border-t" : ""}`}></div>
                {heatingWater?.length > 0 &&
                  heatingWater.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => {
                        setSelectedHeatingWater(item);
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
                <div className="cel">°C</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HeatingWarm;
