import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./index.css";

const ShowDetails = ({
  setToggle,
  toggle,
  handleSaveBuildingMaterialData,
  selEnergeOptionData,
}) => {
  //   const [inputVal, setInputVal] = useState({});
  const [loading, setLoading] = useState(false);
  const formikRef = useRef();

  const initialValues = {
    gInfilRates: "",
    gAbsorptivity: "",
    gUValue: "",
    oAbsorption: "",
    oUValue: "",
    fUValue: "",
    rAbsorption: "",
    rUValue: "",
    wGUValue: "",
    wGCoefficient: "",
    wGLightCoefficient: "",
    fShareValue: "",
    fUValue: "",
    fJointValue: "",
  };

  const validationSchema = Yup.object().shape({
    gInfilRates: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(2.0, "Value must be less than or equal to 2.0")
      .required("Infiltration is required"),
    gAbsorptivity: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(500.0, "Value must be less than or equal to 500.0")
      .required("Absorptivity is required"),
    gUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    oAbsorption: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(1.0, "Value must be less than or equal to 1.0")
      .required("Absorption coefficient is required"),
    oUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    fUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    rAbsorption: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(1.0, "Value must be less than or equal to 1.0")
      .required("Absorption coefficient is required"),
    rUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    wGUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    wGCoefficient: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(1.0, "Value must be less than or equal to 1.0")
      .required("Coefficient is required"),
    wGLightCoefficient: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(1.0, "Value must be less than or equal to 1.0")
      .required("Coefficient is required"),
    fShareValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(1.0, "Value must be less than or equal to 1.0")
      .required("Share value is required"),
    fUValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(10.0, "Value must be less than or equal to 10.0")
      .required("U-value is required"),
    fJointValue: Yup.number()
      .min(0, "Value must be greater than or equal to 0")
      .max(5.0, "Value must be less than or equal to 5.0")
      .required("F-value is required"),
  });

  const onSelectOption = (event, inputFieldName, setFieldValue) => {
    const name = event?.target?.name;
    const value = event?.target?.value;
    const selectedOption = event?.target?.options[event?.target?.selectedIndex];
    const extraData = selectedOption?.dataset?.extra;
    setFieldValue(inputFieldName, extraData);
    setFieldValue(name, value);
  };

  useEffect(() => {
    if (selEnergeOptionData && formikRef?.current) {
      formikRef.current.setFieldValue(
        "gInfilRates",
        selEnergeOptionData?.air_tightness_infilteration_rate,
      );
      formikRef.current.setFieldValue(
        "gAbsorptivity",
        selEnergeOptionData?.building_density_absorptivity,
      );
      formikRef.current.setFieldValue(
        "gUValue",
        selEnergeOptionData?.energy_bridges_u_value,
      );

      formikRef.current.setFieldValue(
        "oAbsorption",
        selEnergeOptionData?.walls_color_absorption_coefficient,
      );
      formikRef.current.setFieldValue(
        "oUValue",
        selEnergeOptionData?.walls_thermal_conductivity_u_value,
      );

      formikRef.current.setFieldValue(
        "fUValue",
        selEnergeOptionData?.floor_thermal_conductivity_u_value,
      );

      formikRef.current.setFieldValue(
        "rAbsorption",
        selEnergeOptionData?.roof_color_absorption_coefficient,
      );
      formikRef.current.setFieldValue(
        "rUValue",
        selEnergeOptionData?.roof_thermal_conductivity_u_value,
      );

      formikRef.current.setFieldValue(
        "wGUValue",
        selEnergeOptionData?.windows_glazing_thermal_conductivity_u_value,
      );
      formikRef.current.setFieldValue(
        "wGCoefficient",
        selEnergeOptionData?.windows_energy_transmissivity_coefficient,
      );
      formikRef.current.setFieldValue(
        "wGLightCoefficient",
        selEnergeOptionData?.windows_light_transmissivity_coefficient,
      );

      formikRef.current.setFieldValue(
        "fShareValue",
        selEnergeOptionData?.windows_frames_share_value,
      );
      formikRef.current.setFieldValue(
        "fUValue",
        selEnergeOptionData?.windows_frames_thermal_conductivity_u_value,
      );
      formikRef.current.setFieldValue(
        "fJointValue",
        selEnergeOptionData?.windows_frames_joint_frame_value,
      );
    }
  }, [selEnergeOptionData, formikRef?.current]);

  return (
    <div className="right-wrp">
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
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnSubmit={true}
          onSubmit={(values) => handleSaveBuildingMaterialData(values)}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="rightContent">
                <div className="main-table">
                  <div className="main-title">General</div>
                  <div className="items-row">
                    <div className="items">
                      {/* <p>Heat tramission</p> */}
                      <p>Air tightness</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="gAirTightness"
                            onChange={(e) =>
                              onSelectOption(e, "gInfilRates", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="2.0" value="High" data-extra="2.0">
                              High
                            </option>
                            <option key="1.0" value="Medium" data-extra="1.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Infiltration rates [1/h]</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        id="gInfilRates"
                        name="gInfilRates"
                      />
                      {errors.gInfilRates && touched.gInfilRates ? (
                        <div className="building-material-form-err">
                          {errors.gInfilRates}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Building density</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="buildingDensity"
                            onChange={(e) =>
                              onSelectOption(e, "gAbsorptivity", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="500.0" value="High" data-extra="500.0">
                              High
                            </option>
                            <option
                              key="250.0"
                              value="Medium"
                              data-extra="250.0"
                            >
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        Absorptivity [Wh/m<sup>2</sup>k]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="gAbsorptivity"
                        id="gAbsorptivity"
                      />
                      {errors.gAbsorptivity && touched.gAbsorptivity ? (
                        <div className="building-material-form-err">
                          {errors.gAbsorptivity}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Energy bridges</p>

                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="energyBridges"
                            onChange={(e) =>
                              onSelectOption(e, "gUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="gUValue"
                        id="gUValue"
                      />
                      {errors.gUValue && touched.gUValue ? (
                        <div className="building-material-form-err">
                          {errors.gUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="main-table">
                  <div className="main-title">Opaque surfaces</div>
                  <div className="sub-title">Walls</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="items">
                      <p>Color</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wColor"
                            onChange={(e) =>
                              onSelectOption(e, "oAbsorption", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="1.0" value="High" data-extra="1.0">
                              High
                            </option>
                            <option key="0.5" value="Medium" data-extra="0.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Absorption coefficient</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="oAbsorption"
                        id="oAbsorption"
                      />
                      {errors.oAbsorption && touched.oAbsorption ? (
                        <div className="building-material-form-err">
                          {errors.oAbsorption}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Thermal conductivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wThermal"
                            onChange={(e) =>
                              onSelectOption(e, "oUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="oUValue"
                        id="oUValue"
                      />
                      {errors.oUValue && touched.oUValue ? (
                        <div className="building-material-form-err">
                          {errors.oUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="sub-title">Floor</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="items">
                      <p>Thermal conductivity</p>

                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="fThermal"
                            onChange={(e) =>
                              onSelectOption(e, "fUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="fUValue"
                        id="fUValue"
                      />
                      {errors.fUValue && touched.fUValue ? (
                        <div className="building-material-form-err">
                          {errors.fUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="sub-title">Roof</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="items">
                      <p>Color</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="roofColor"
                            onChange={(e) =>
                              onSelectOption(e, "rAbsorption", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="1.0" value="High" data-extra="1.0">
                              High
                            </option>
                            <option key="0.5" value="Medium" data-extra="0.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Absorption coefficient</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="rAbsorption"
                        id="rAbsorption"
                      />
                      {errors.rAbsorption && touched.rAbsorption ? (
                        <div className="building-material-form-err">
                          {errors.rAbsorption}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Thermal conductivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="thermalConductivity"
                            onChange={(e) =>
                              onSelectOption(e, "rUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="rUValue"
                        id="rUValue"
                      />
                      {errors.rUValue && touched.rUValue ? (
                        <div className="building-material-form-err">
                          {errors.rUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="main-table">
                  <div className="main-title">Windows</div>
                  <div className="sub-title">Glazing</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="items">
                      <p>Thermal conductivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wThermal"
                            onChange={(e) =>
                              onSelectOption(e, "wGUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="wGUValue"
                        id="wGUValue"
                      />
                      {errors.wGUValue && touched.wGUValue ? (
                        <div className="building-material-form-err">
                          {errors.wGUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Energy transmissivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wEnergy"
                            onChange={(e) =>
                              onSelectOption(e, "wGCoefficient", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="1.0" value="High" data-extra="1.0">
                              High
                            </option>
                            <option key="0.5" value="Medium" data-extra="0.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Coefficient</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="wGCoefficient"
                        id="wGCoefficient"
                      />
                      {errors.wGCoefficient && touched.wGCoefficient ? (
                        <div className="building-material-form-err">
                          {errors.wGCoefficient}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Light transmissivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wLight"
                            onChange={(e) =>
                              onSelectOption(
                                e,
                                "wGLightCoefficient",
                                setFieldValue,
                              )
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="1.0" value="High" data-extra="1.0">
                              High
                            </option>
                            <option key="0.5" value="Medium" data-extra="0.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Coefficient</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="wGLightCoefficient"
                        id="wGLightCoefficient"
                      />
                      {errors.wGLightCoefficient &&
                      touched.wGLightCoefficient ? (
                        <div className="building-material-form-err">
                          {errors.wGLightCoefficient}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="sub-title">Frames</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="items">
                      <p>Frame share</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="wFrame"
                            onChange={(e) =>
                              onSelectOption(e, "fShareValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="1.0" value="High" data-extra="1.0">
                              High
                            </option>
                            <option key="0.5" value="Medium" data-extra="0.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>Share value</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="fShareValue"
                        id="fShareValue"
                      />
                      {errors.fShareValue && touched.fShareValue ? (
                        <div className="building-material-form-err">
                          {errors.fShareValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Thermal conductivity</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="fThermal"
                            onChange={(e) =>
                              onSelectOption(e, "fUValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="10.0" value="High" data-extra="10.0">
                              High
                            </option>
                            <option key="5.0" value="Medium" data-extra="5.0">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>
                        U-value [W/(m<sup>2</sup>K)]
                      </p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="fUValue"
                        id="fUValue"
                      />
                      {errors.fUValue && touched.fUValue ? (
                        <div className="building-material-form-err">
                          {errors.fUValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="items-row">
                    <div className="items">
                      <p>Joint frame value</p>
                      <Field name="dropdown">
                        {({ field, form }) => (
                          <select
                            {...field}
                            name="fJointFrame"
                            onChange={(e) =>
                              onSelectOption(e, "fJointValue", setFieldValue)
                            }
                          >
                            <option key="" value="" data-extra="">
                              Custom
                            </option>
                            <option key="5.0" value="High" data-extra="5.0">
                              High
                            </option>
                            <option key="2.5" value="Medium" data-extra="2.5">
                              Medium
                            </option>
                            <option key="0.0" value="Low" data-extra="0.0">
                              Low
                            </option>
                          </select>
                        )}
                      </Field>
                    </div>
                    <div className="items">
                      <p>F-value [W/(mK)]</p>
                      <Field
                        type="number"
                        placeholder="Custom"
                        name="fJointValue"
                        id="fJointValue"
                      />
                      {errors.fJointValue && touched.fJointValue ? (
                        <div className="building-material-form-err">
                          {errors.fJointValue}
                        </div>
                      ) : null}
                    </div>
                  </div>
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
