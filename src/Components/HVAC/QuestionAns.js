import React, { useState, useEffect } from "react";
import { Col, Dropdown, Row, Form } from "react-bootstrap";
import { useHvacSystem } from "../../Context/HvacSystemProvider";

const QuestionAns = ({ item, toggleDropdown, setToggleDropdown }) => {
  const { onSelectQuestion, selectedQuestions } = useHvacSystem();
  const [selectedItems, setSelectedItems] = useState();
  const [inputVal, setInputVal] = useState({});

  const onChangeHandler = (evt) => {
    const value = evt.target.value;

    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (item?.inputBox?.[0]?.name) {
        setInputVal({
          ...inputVal,
          [item.inputBox[0].name]: item.inputBox[0].value,
        });
      }
    }, 500);
  }, [selectedItems]);

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
                    checked={
                      selectedQuestions?.[item.questionType]?.[item.name] ===
                      val.value
                    }
                    defaultValue={
                      selectedQuestions?.[item.questionType]?.[item.name] ===
                        val.value || ""
                    }
                    id={val.label + item.name}
                    onChange={(e) => {
                      onSelectQuestion(
                        item?.questionType,
                        item?.name,
                        val?.value,
                        item?.type,
                      );
                    }}
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
                    selectedQuestions?.[item.questionType]?.[item.name]
                      ?.selection ??
                    selectedQuestions?.[item.questionType]?.[item.name] ??
                    "Custom"
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
                          !item?.inputBox
                            ? onSelectQuestion(
                                item?.questionType,
                                item?.name,
                                val?.value,
                                "radio",
                              )
                            : onSelectQuestion(
                                item?.questionType,
                                item?.name,
                                val,
                                "dropdown",
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
                        value={inputVal?.[values.name]}
                        onChange={(e) => {
                          onChangeHandler(e);
                          onSelectQuestion(
                            item?.questionType,
                            item?.name,
                            {
                              name: selectedItems?.name,
                              value: e.target.value,
                            },
                            "dropdown",
                          );
                        }}
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
