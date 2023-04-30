import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const OperatingInterval = () => {
  return (
    <Container className="OperatingIntervalWrp ">
      <Row>
        <Col className="rooms">
          <Form.Label className="orangeTextSmall">
            Interval 1 - Start
          </Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Col>
        <Col className="rooms">
          <Form.Label className="orangeTextSmall">Interval 1 - End</Form.Label>
          <Form.Select aria-label="Default select example">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="flex-column gap-3">
        <Col className="smallTitle">Days</Col>
        <Row xs="auto ms-0 gap-3">
          <Col className="dayBox">Sun</Col>
          <Col className="dayBox">Mon</Col>
          <Col className="dayBox selectedDay">Tue</Col>
          <Col className="dayBox ">Wed</Col>
          <Col className="dayBox selectedDay">Thu</Col>
          <Col className="dayBox">Fri</Col>
          <Col className="dayBox">Sat</Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <div className="radio-items">
            <div className="form-one">
              <input
                type="checkbox"
                className={"checkboxWrp"}
                name={"sleeping"}
                id={"sleeping"}
                value={1}
                onChange={(a) => console.log(a)}
              />
              <label
                htmlFor="sleeping"
                className={`no-1  instedCheckbox checkboxLabel`}
              >
                Passive occupation (e.g Sleeping)
              </label>
            </div>
          </div>
        </Col>
        <Col className="d-flex justify-content-end">
          <img src="assets/img/rooms/operatingHours.svg" alt="" />
        </Col>
      </Row>
    </Container>
  );
};

export default OperatingInterval;
