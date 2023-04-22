import React from "react";
import { Col, Dropdown, Row } from "react-bootstrap";

const QuestionAns = ({
  item,
  toggleDropdown,
  setToggleDropdown,
  selectedItems,
  setSelectedItems,
}) => {
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
                    onChange={(a) => console.log(a)}
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
                    "User Selection"
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
