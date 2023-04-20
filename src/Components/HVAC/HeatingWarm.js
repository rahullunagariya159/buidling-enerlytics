import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const HeatingWarm = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="question-header">
            Is heating / warm water available in any of the rooms in the
            building?
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HeatingWarm;
