import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import OperatingInterval from "./OperatingInterval";

const OperatingHours = () => {
  return (
    <Container className="OperatingHoursWrp">
      <Row>
        <Col className="rooms">
          <Form.Label>
            How many people are in the room during
            <div className="orangeText">operating hours?</div>
          </Form.Label>
          <span className="inputBox-rooms">
            <input min="1" step="1" type="number" aria-label="Number input" />
          </span>
        </Col>
        <Col className="rooms">
          <Form.Label>
            How many people are in the room during
            <div className="orangeText">non-operating hours? </div>
          </Form.Label>
          <span className="inputBox-rooms">
            <input min="1" step="1" type="number" aria-label="Number input" />
          </span>
        </Col>
      </Row>
      <Row className="mt-58">
        <Col className="rooms">
          <Form.Label>
            How many usage intervals would you like to enter?
          </Form.Label>
          <span className="inputBox-rooms">
            <input min="1" step="1" type="number" aria-label="Number input" />
          </span>
        </Col>
      </Row>
      <Row className="gap-4">
        <OperatingInterval />
        <OperatingInterval />
      </Row>
      <Row>
        <div className="relative nextBtn">
          <button type="submit" className="Pay-btn add">
            Add
          </button>
        </div>
      </Row>
    </Container>
  );
};

export default OperatingHours;
