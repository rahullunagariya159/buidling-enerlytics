import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const IndoorClimateSettings = () => {
  return (
    <Container className="p-3 d-flex flex-column gap-3">
      <Container className="indoorClimateSettingWrp">
        <Row className="align-items-center row-cols-auto indoor-wrp">
          <Col className="pe-0">
            <img src="assets/img/hvac/heating-yellow.svg" alt="" />
          </Col>
          <Col>
            <span>HEATING</span>
          </Col>
        </Row>
        <Row className="px-3 py-4">
          <Col className="rooms">
            <Form.Label>
              What <span className="orangeText">minimum</span> temperature
              should the room be heated to during
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
            </span>
          </Col>
          <Col className="rooms">
            <Form.Label>
              What <span className="orangeText">minimum</span> temperature
              should the room be heated to during
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
            </span>
          </Col>
        </Row>
      </Container>
      <Container className="indoorClimateSettingWrp">
        <Row className="align-items-center row-cols-auto indoor-wrp">
          <Col className="pe-0">
            <img src="assets/img/hvac/cooling-yellow.svg" alt="" />
          </Col>
          <Col>
            <span>COOLING</span>
          </Col>
        </Row>
        <Row className="px-3 py-4">
          <Col className="rooms">
            <Form.Label>
              What <span className="orangeText">maximum</span> temperature
              should the room be heated to during
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
            </span>
          </Col>
          <Col className="rooms">
            <Form.Label>
              What temperature should the room be cooled to during
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
            </span>
          </Col>
        </Row>
      </Container>
      <Container className="indoorClimateSettingWrp">
        <Row className="align-items-center row-cols-auto indoor-wrp">
          <Col className="pe-0">
            <img src="assets/img/hvac/humidification-yellow.svg" alt="" />
          </Col>
          <Col>
            <span>HUMIDIFICATION</span>
          </Col>
        </Row>
        <Row className="px-3 py-4">
          <Col className="rooms">
            <Form.Label>
              What minimum relative humidity should the room air possess during
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
            </span>
          </Col>
          <Col className="rooms">
            <Form.Label>
              What minimum relative humidity should the room air possess during
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
            </span>
          </Col>
        </Row>
        <Row className="px-3 pb-4">
          <Col className="rooms">
            <Form.Label>
              What maximum relative humidity should the room air possess during
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
            </span>
          </Col>
          <Col className="rooms">
            <Form.Label>
              What maximum relative humidity should the room air possess during
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
            </span>
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

export default IndoorClimateSettings;
