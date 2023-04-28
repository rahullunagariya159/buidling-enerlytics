import React, { useState } from "react";
import { Col, Dropdown, Row, Form } from "react-bootstrap";
import { useHvacSystem } from "../../Context/HvacSystemProvider";

const QuestionAns = ({ item, toggleDropdown, setToggleDropdown }) => {
  const { onSelectQuestion } = useHvacSystem();
  const [selectedItems, setSelectedItems] = useState();

  return (
    <Row>
      <Col className="mainQuestionWrp">
        <img src="assets/img/hvac/cooling-dark.svg" alt="question-logo" />
        <div className="questionWrp">
          <div className="question-header">{item.question}</div>
          {item.type !== "dropdown" && (
            <div className="radio-items">
              {item.option.map((val, index) => (
                <div className="form-one" key={index}>
                  <input
                    type={item.type}
                    className={`${
                      item.type === "checkbox" ? "checkboxWrp" : "inst"
                    }`}
                    name={item.name}
                    value={val.value}
                    id={val.label + item.name}
                    onChange={(a) =>
                      onSelectQuestion(
                        item?.questionType,
                        item?.name,
                        val?.value,
                        item?.type,
                      )
                    }
                  />
                  <label
                    className={`no-1 build-eng-efficient ${
                      item.type === "checkbox" ? "instedCheckbox" : "insted"
                    }`}
                    htmlFor={val.label + item.name}
                  >
                    {val.label}
                  </label>
                </div>
              ))}
            </div>
          )}
          {item.type === "dropdown" && (
            <div className="secondStep hvac-Drop-down">
              <Dropdown
                className={` ${toggleDropdown ? "dropdownBox brd" : ""}`}
                onToggle={() => setToggleDropdown(!toggleDropdown)}
              >
                <Dropdown.Toggle
                  variant=""
                  id="dropdown-icon"
                  className={`${!!toggleDropdown ? "dropdown-open" : ""}`}
                >
                  {selectedItems ? (
                    <div className="country-items">
                      <span>{selectedItems?.name}</span>
                    </div>
                  ) : (
                    item.default ?? "Custom"
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div
                    className={`${!!toggleDropdown ? "border-t" : ""}`}
                  ></div>
                  {item?.option?.length > 0 &&
                    item.option.map((val, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          setSelectedItems(val);
                          // onSelectQuestion();
                          !item?.inputBox &&
                            onSelectQuestion(
                              item?.questionType,
                              item?.name,
                              val?.value,
                              "radio",
                            );
                        }}
                      >
                        <div className="items">
                          <div className="sub-items">
                            <span>{val?.name}</span>
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
                {/* <Form.Control defaultValue="High" style={{ display: "none" }} /> */}
              </Dropdown>
              {item?.inputBox?.length > 0 && (
                <div className="hvac-input">
                  <div className="temp">
                    {item.inputBox.map((values, index) => (
                      <input
                        key={index}
                        type="text"
                        name={values.name}
                        placeholder={values.placeholder}
                        defaultValue={values.value}
                        value={values.value}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default QuestionAns;
