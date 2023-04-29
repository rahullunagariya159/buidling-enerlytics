import React, { useEffect, useRef } from "react";
import { Form, Formik, Field } from "formik";
import ReactTooltip from "react-tooltip";
import { useHvacSystem } from "../../Context/HvacSystemProvider";

const ShowDetails = () => {
  const { setToggle, toggle, heatingWarmWaterData, handleSubmitHvacData } =
    useHvacSystem();
  const hvacFormikRef = useRef(null);

  const initialValues = {
    heating_system_transmission_losses: "",
    heating_system_distribution_losses: "",
    warm_water_storage_losses: "",
    warm_water_distribution_losses: "",
    load_operating_hours: "",
    load_non_operating_hours: "",
  };

  const onSelectOption = (event, inputFieldName, setFieldValue) => {
    const name = event?.target?.name;
    const value = event?.target?.value;
    const selectedOption = event?.target?.options[event?.target?.selectedIndex];
    const extraData = selectedOption?.dataset?.extra;
    setFieldValue(inputFieldName, extraData);
    setFieldValue(name, value);
    // setIsEditValue(true);
  };

  const onHandleFormSubmit = async (values) => {
    await handleSubmitHvacData(values);
  };

  useEffect(() => {
    if (heatingWarmWaterData && hvacFormikRef?.current) {
      hvacFormikRef?.current?.setFieldValue(
        "heating_system_transmission_losses",
        heatingWarmWaterData?.heating_system_transmission_losses ?? "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "heating_system_distribution_losses",
        heatingWarmWaterData?.heating_system_distribution_losses ?? "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "warm_water_storage_losses",
        heatingWarmWaterData?.warm_water_storage_losses ?? "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "warm_water_distribution_losses",
        heatingWarmWaterData?.warm_water_distribution_losses ?? "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "load_operating_hours",
        heatingWarmWaterData?.load_operating_hours ?? "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "load_non_operating_hours",
        heatingWarmWaterData?.load_non_operating_hours ?? "",
      );
    }
  }, [heatingWarmWaterData, hvacFormikRef?.current]);

  return (
    <div className="right-wrp hvac-rotet">
      <p className="rotet cursor-pointer" onClick={() => setToggle(!toggle)}>
        {!toggle ? "SHOW" : "HIDE"} DETAILS
        <img
          src={
            !toggle
              ? "assets/img/Home-Page/homeFinal/Path 66.svg"
              : "assets/img/Home-Page/homeFinal/Path 67.svg"
          }
          className="porte"
          alt=""
        />
      </p>
      {toggle && (
        <Formik
          initialValues={initialValues}
          innerRef={hvacFormikRef}
          onSubmit={(values) => onHandleFormSubmit(values)}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form onChange={(e) => console.log(e)}>
              <div className="showDetailsWrp ">
                <div className="main-table">
                  <div className="main-title">Warm water system losses</div>
                  <div className="sub-title">Heating</div>
                  <div className="itemsData">
                    <div className="items-row">
                      <div className="sub-items">
                        <div className="items">
                          <p>Heat transmission</p>
                          <Field
                            as="select"
                            name="heating_system_transmission_losses_dropdown"
                            onChange={(e) =>
                              onSelectOption(
                                e,
                                "heating_system_transmission_losses",
                                setFieldValue,
                              )
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10" value="High" data-extra="10">
                              High
                            </option>
                            <option key="5" value="Medium" data-extra="5">
                              Medium
                            </option>
                            <option key="1" value="Low" data-extra="1">
                              Low
                            </option>
                          </Field>
                        </div>
                        <ReactTooltip id="share" place="top" effect="solid">
                          Share
                        </ReactTooltip>
                        <div className="items">
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder=""
                            name="heating_system_transmission_losses"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="items-row">
                      <div className="sub-items">
                        <div className="items">
                          <p>Heat distribution</p>
                          <Field
                            as="select"
                            name="heating_system_distribution_losses_dropdown"
                            onChange={(e) =>
                              onSelectOption(
                                e,
                                "heating_system_distribution_losses",
                                setFieldValue,
                              )
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="" value="High" data-extra="10">
                              High
                            </option>
                            <option key="" value="Medium" data-extra="5">
                              Medium
                            </option>
                            <option key="" value="Low" data-extra="1">
                              Low
                            </option>
                          </Field>
                        </div>
                        <div className="items">
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder=""
                            name="heating_system_distribution_losses"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="horizontalLine"></div>
                  <div className="sub-title">Warm (drinking) water</div>
                  <div className="itemsData">
                    <div className="items-row">
                      <div className="sub-items">
                        <div className="items">
                          <p>Heat distribution</p>
                          <Field
                            as="select"
                            name="warm_water_storage_losses_dropdown"
                            onChange={(e) =>
                              onSelectOption(
                                e,
                                "warm_water_storage_losses",
                                setFieldValue,
                              )
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10" value="High" data-extra="10">
                              High
                            </option>
                            <option key="5" value="Medium" data-extra="5">
                              Medium
                            </option>
                            <option key="1" value="Low" data-extra="1">
                              Low
                            </option>
                          </Field>
                        </div>
                        <div className="items">
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder=""
                            name="warm_water_storage_losses"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="items-row">
                      <div className="sub-items">
                        <div className="items">
                          <p>Heat transmission</p>
                          <Field
                            as="select"
                            name="warm_water_distribution_losses_dropdown"
                            onChange={(e) =>
                              onSelectOption(
                                e,
                                "warm_water_distribution_losses",
                                setFieldValue,
                              )
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10" value="High" data-extra="10">
                              High
                            </option>
                            <option key="5" value="Medium" data-extra="5">
                              Medium
                            </option>
                            <option key="1" value="Low" data-extra="1">
                              Low
                            </option>
                          </Field>
                        </div>
                        <div className="items">
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder=""
                            name="warm_water_distribution_losses"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="horizontalLine"></div>
                  <div className="sub-title">Auxiliary equipment</div>
                  <div className="itemsData">
                    <div className="items-row">
                      <div className="diff-items">
                        <div className="title">Load during operating hours</div>
                        <Field
                          type="number"
                          placeholder=""
                          name="load_operating_hours"
                        />
                        <span>W/m²</span>
                      </div>
                    </div>
                    <div className="items-row">
                      <div className="diff-items">
                        <div className="title">
                          Load during non-operating hours
                        </div>
                        <Field
                          type="number"
                          placeholder=""
                          name="load_non_operating_hours"
                        />
                        <span>W/m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="showDetails-image">
                <img
                  src="assets/img/LoadExisting/project-page.png"
                  alt="showDetails"
                />
                <div className="relative nextBtn">
                  <button type="submit" className="Pay-btn">
                    NEXT
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ShowDetails;
