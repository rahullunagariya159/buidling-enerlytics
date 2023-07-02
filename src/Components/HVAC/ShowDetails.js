import React, { useEffect, useRef } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { ReactSession } from "react-client-session";
import ReactTooltip from "react-tooltip";
import { useHvacSystem } from "../../Context/HvacSystemProvider";
import { useAuth } from "../../Context/AuthProvider";
import { hvacTabs } from "./hvacConstants";

const ShowDetails = () => {
  const {
    setToggle,
    toggle,
    heatingWarmWaterData,
    handleSubmitHvacData,
    selectedQuestions,
    setHvacFormValues,
    handleFormConfig,
    setLoading,
    key,
  } = useHvacSystem();
  const { userId } = useAuth();
  const hvacFormikRef = useRef(null);
  const isEdit = ReactSession.get("isedit_project_config");

  const initialValues = {
    radiator_surface_area: "",
    heating_system_transmission_losses: "",
    heating_system_distribution_losses: "",
    warm_water_storage_losses: "",
    warm_water_distribution_losses: "",
    load_operating_hours: "",
    load_non_operating_hours: "",
  };

  const validationSchema = Yup.object().shape({
    radiator_surface_area: Yup.number()
      .min(1, "Value must be greater than or equal to 1")
      .max(50, "Value must be less than or equal to 10")
      .required("Radiator surface is required"),
    heating_system_transmission_losses: Yup.number()
      .min(1, "Value must be greater than or equal to 1")
      .max(50, "Value must be less than or equal to 10")
      .required("Heat transmission is required"),
    heating_system_distribution_losses: Yup.number()
      .min(1, "Value must be greater than or equal to 1")
      .max(50, "Value must be less than or equal to 10")
      .required("Heat distribution is required"),
    warm_water_storage_losses: Yup.number()
      .min(1, "Value must be greater than or equal to 1")
      .max(50, "Value must be less than or equal to 10")
      .required("Heat distribution is required"),
    warm_water_distribution_losses: Yup.number()
      .min(1, "Value must be greater than or equal to 1")
      .max(50, "Value must be less than or equal to 10")
      .required("Heat distribution is required"),
  });

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
    if (!userId) {
      return false;
    }
    setLoading(true);
    setHvacFormValues(values);
    setTimeout(async () => {
      if (isEdit) {
        handleFormConfig(values);
      } else {
        await handleSubmitHvacData(values);
      }
    }, 500);
  };

  useEffect(() => {
    if ((heatingWarmWaterData || selectedQuestions) && hvacFormikRef?.current) {
      hvacFormikRef?.current?.setFieldValue(
        "radiator_surface_area",
        heatingWarmWaterData?.radiator_surface_area ??
          selectedQuestions?.heating?.radiator_surface_area ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "heating_system_transmission_losses",
        heatingWarmWaterData?.heating_system_transmission_losses ??
          selectedQuestions?.heating?.heating_system_transmission_losses ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "heating_system_distribution_losses",
        heatingWarmWaterData?.heating_system_distribution_losses ??
          selectedQuestions?.heating?.heating_system_transmission_losses ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "warm_water_storage_losses",
        heatingWarmWaterData?.warm_water_storage_losses ??
          selectedQuestions?.heating?.warm_water_storage_losses ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "warm_water_distribution_losses",
        heatingWarmWaterData?.warm_water_distribution_losses ??
          selectedQuestions?.heating?.warm_water_distribution_losses ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "load_operating_hours",
        heatingWarmWaterData?.load_operating_hours ??
          selectedQuestions?.auxiliary_equipment?.load_operating_hours ??
          "",
      );
      hvacFormikRef?.current?.setFieldValue(
        "load_non_operating_hours",
        heatingWarmWaterData?.load_non_operating_hours ??
          selectedQuestions?.auxiliary_equipment?.load_non_operating_hours ??
          "",
      );
    }
  }, [heatingWarmWaterData, hvacFormikRef?.current, selectedQuestions]);

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
          validateOnSubmit={true}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="showDetailsWrp ">
                <div className="main-table">
                  {key === hvacTabs.heating && (
                    <>
                      <div className="main-title">Warm water system losses</div>
                      <div className="sub-title">Heating system dimension</div>
                      <div className="itemsData">
                        <div className="items-row">
                          <div className="sub-items">
                            <div className="items">
                              <p>Radiator surface area / room surface area</p>
                              <Field
                                as="select"
                                name="radiator_surface_area_dropdown"
                                onChange={(e) =>
                                  onSelectOption(
                                    e,
                                    "radiator_surface_area",
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
                                name="radiator_surface_area"
                              />
                              {errors.radiator_surface_area &&
                              touched.radiator_surface_area ? (
                                <div className="building-material-form-err">
                                  {errors.radiator_surface_area}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="horizontalLine"></div>

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
                              {errors.heating_system_transmission_losses &&
                              touched.heating_system_transmission_losses ? (
                                <div className="building-material-form-err">
                                  {errors.heating_system_transmission_losses}
                                </div>
                              ) : null}
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
                              {errors.warm_water_storage_losses &&
                              touched.warm_water_storage_losses ? (
                                <div className="building-material-form-err">
                                  {errors.warm_water_storage_losses}
                                </div>
                              ) : null}
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
                              {errors.warm_water_distribution_losses &&
                              touched.warm_water_distribution_losses ? (
                                <div className="building-material-form-err">
                                  {errors.warm_water_distribution_losses}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="horizontalLine"></div> */}
                    </>
                  )}

                  {key === hvacTabs.auxiliary_equipment && (
                    <>
                      <div className="sub-title">Auxiliary equipment</div>
                      <div className="itemsData">
                        <div className="items-row">
                          <div className="diff-items">
                            <div className="title">
                              Load during operating hours
                            </div>
                            <Field
                              type="number"
                              placeholder=""
                              name="load_operating_hours"
                            />
                            {errors.load_operating_hours &&
                            touched.load_operating_hours ? (
                              <div className="building-material-form-err">
                                {errors.load_operating_hours}
                              </div>
                            ) : null}
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
                            {errors.load_non_operating_hours &&
                            touched.load_non_operating_hours ? (
                              <div className="building-material-form-err">
                                {errors.load_non_operating_hours}
                              </div>
                            ) : null}
                            <span>W/m²</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
