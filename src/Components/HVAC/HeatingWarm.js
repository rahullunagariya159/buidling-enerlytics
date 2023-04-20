import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const HeatingWarm = () => {
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
                name="qq1"
                value={"yes"}
                checked
                id="q1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q1">
                Yes
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="q2"
                name="qq1"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q2">
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
                name="qq2"
                value={"yes"}
                checked
                id="q3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q3">
                Yes, very well
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="q4"
                name="qq2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q4">
                Quite okay
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="q5"
                name="qq2"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q5">
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
                type="radio"
                className="inst"
                name="qq3"
                value={"yes"}
                checked
                id="q3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q3">
                In-floor heating
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="q4"
                name="qq3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q4">
                Radiators
              </label>
            </div>
            <div className="form-one">
              <input
                type="radio"
                className="inst"
                value={"no"}
                id="q5"
                name="qq3"
              />
              <label className="insted no-1 build-eng-efficient" htmlFor="q5">
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
        </Col>
      </Row>
    </Container>
  );
};

export default HeatingWarm;
