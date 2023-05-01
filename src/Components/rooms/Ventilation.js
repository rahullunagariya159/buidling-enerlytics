import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const Ventilation = () => {
  return (
    <Container className="p-3 d-flex flex-column gap-3">
      <Container className="indoorClimateSettingWrp">
        <Row className="px-3 py-4 borderBottom">
          <Col className="rooms">
            <div className="questionWrp ventilation">
              <div className="question-header">How is the room ventilated?</div>
              <div className="radio-items">
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q1"
                    value="1"
                    id="q11"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q11"
                  >
                    Mechanically ventilated
                  </label>
                </div>
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q1"
                    value="1"
                    id="q12"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q12"
                  >
                    Window ventilated
                  </label>
                </div>
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q1"
                    value="1"
                    id="q13"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q13"
                  >
                    No ventilation
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="px-3 py-4 borderBottom">
          <Col className="rooms">
            <div className="questionWrp ventilation">
              <div className="question-header">
                How would you like to enter the ventilation volume?
              </div>
              <div className="radio-items">
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q2"
                    value="1"
                    id="q21"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q21"
                  >
                    Air exchange rate
                  </label>
                </div>
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q2"
                    value="1"
                    id="q22"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q22"
                  >
                    Air flow volume
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="px-3 py-4 borderBottom">
          <Col className="rooms">
            <Form.Label>
              What is the air exchange rate during operating hours?
              <span className="orangeText"> operating hours?</span>
            </Form.Label>
            <span className="inputBox-rooms indoorClimate">
              <input
                min="1"
                step="1"
                type="number"
                aria-label="Number input"
                className="small-input"
              />
              <span className="labelYellow">(1/h)</span>
            </span>
          </Col>
          <Col className="rooms">
            <Form.Label>
              What is the air exchange rate during
              <span className="orangeText"> non-operating hours?</span>
            </Form.Label>
            <span className="inputBox-rooms indoorClimate">
              <input
                min="1"
                step="1"
                type="number"
                aria-label="Number input"
                className="small-input"
              />
              <span className="labelYellow">(1/h)</span>
            </span>
          </Col>
        </Row>

        <Row className="px-3 py-4 borderBottom">
          <Col className="rooms">
            <div className="questionWrp ventilation">
              <div className="question-header">
                How many times a day and for how long do you usually open the
                windows?
              </div>
              <div className="radio-items">
                <div className="form-one">
                  <input
                    className="ventilation-input"
                    type="input"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label className="inputLabel">Times a day</label>
                </div>
                <div className="form-one">
                  <input
                    className="ventilation-input"
                    type="input"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label className="inputLabel">Minutes each time</label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="px-3 py-4 ">
          <Col className="rooms">
            <div className="questionWrp ventilation">
              <div className="question-header">
                How do you open the windows?
              </div>
              <div className="radio-items">
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q2"
                    value="1"
                    id="q21"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q21"
                  >
                    Fully opened
                  </label>
                </div>
                <div className="form-one">
                  <input
                    type={"radio"}
                    className="inst"
                    name="q2"
                    value="1"
                    id="q22"
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  <label
                    className="no-1 build-eng-efficient  insted"
                    htmlFor="q22"
                  >
                    Partly opened
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Row className="mt-4 ps-4">
        <div className="relative nextBtn">
          <button type="submit" className="Pay-btn add">
            Add
          </button>
        </div>
      </Row>
    </Container>
  );
};

export default Ventilation;
