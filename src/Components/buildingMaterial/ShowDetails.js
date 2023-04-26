import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ReactSession } from "react-client-session";
import "./index.css";

const ShowDetails = ({
  setToggle,
  toggle,
  handleSaveBuildingMaterialData,
  selEnergeOptionData,
  isEnableSteps,
  handleSubmitForm,
  setIsEditValue,
}) => {
  const isView = ReactSession.get("isview_project_config");
  const [loading, setLoading] = useState(false);
  const [didMount, setDidMount] = useState(false);
  const formikRef = useRef(null);

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
    setIsEditValue(true);
  };

  useEffect(() => {
    if (selEnergeOptionData && formikRef?.current) {
      // console.log({ selEnergeOptionData });
      formikRef?.current?.setFieldValue(
        "gInfilRates",
        selEnergeOptionData?.air_tightness_infilteration_rate ?? "",
      );
      formikRef?.current?.setFieldValue(
        "gAbsorptivity",
        selEnergeOptionData?.building_density_absorptivity ?? "",
      );
      formikRef?.current?.setFieldValue(
        "gUValue",
        selEnergeOptionData?.energy_bridges_u_value ?? "",
      );

      formikRef?.current?.setFieldValue(
        "oAbsorption",
        selEnergeOptionData?.walls_color_absorption_coefficient ?? "",
      );
      formikRef?.current?.setFieldValue(
        "oUValue",
        selEnergeOptionData?.walls_thermal_conductivity_u_value ?? "",
      );

      formikRef?.current?.setFieldValue(
        "fUValue",
        selEnergeOptionData?.floor_thermal_conductivity_u_value ?? "",
      );

      formikRef?.current?.setFieldValue(
        "rAbsorption",
        selEnergeOptionData?.roof_color_absorption_coefficient ?? "",
      );
      formikRef?.current?.setFieldValue(
        "rUValue",
        selEnergeOptionData?.roof_thermal_conductivity_u_value ?? "",
      );

      formikRef?.current?.setFieldValue(
        "wGUValue",
        selEnergeOptionData?.windows_glazing_thermal_conductivity_u_value ?? "",
      );
      formikRef?.current?.setFieldValue(
        "wGCoefficient",
        selEnergeOptionData?.windows_energy_transmissivity_coefficient ?? "",
      );
      formikRef?.current?.setFieldValue(
        "wGLightCoefficient",
        selEnergeOptionData?.windows_light_transmissivity_coefficient ?? "",
      );

      formikRef?.current?.setFieldValue(
        "fShareValue",
        selEnergeOptionData?.windows_frames_share_value ?? "",
      );
      formikRef?.current?.setFieldValue(
        "fUValue",
        selEnergeOptionData?.windows_frames_thermal_conductivity_u_value ?? "",
      );
      formikRef?.current?.setFieldValue(
        "fJointValue",
        selEnergeOptionData?.windows_frames_joint_frame_value ?? "",
      );
      formikRef?.current?.setFieldValue(
        "gAirTightness",
        selEnergeOptionData?.air_tightness_infilteration_rate_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "buildingDensity",
        selEnergeOptionData?.building_density_absorptivity_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "energyBridges",
        selEnergeOptionData?.energy_bridges_u_value_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "wColor",
        selEnergeOptionData?.walls_color_absorption_coefficient_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "wThermal",
        selEnergeOptionData?.walls_thermal_conductivity_u_value_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "fThermal",
        selEnergeOptionData?.floor_thermal_conductivity_u_value_dropdown ?? "",
      );

      formikRef?.current?.setFieldValue(
        "wThermal",
        selEnergeOptionData?.windows_glazing_thermal_conductivity_u_value_dropdown ??
          "",
      );
      formikRef?.current?.setFieldValue(
        "fThermal",
        selEnergeOptionData?.windows_frames_thermal_conductivity_u_value_dropdown ??
          "",
      );
      formikRef?.current?.setFieldValue(
        "wLight",
        selEnergeOptionData?.windows_light_transmissivity_coefficient_dropdown ??
          "",
      );
      formikRef?.current?.setFieldValue(
        "roofColor",
        selEnergeOptionData?.roof_color_absorption_coefficient_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "thermalConductivity",
        selEnergeOptionData?.roof_thermal_conductivity_u_value_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "wEnergy",
        selEnergeOptionData?.windows_energy_transmissivity_coefficient_dropdown ??
          "",
      );
      formikRef?.current?.setFieldValue(
        "wFrame",
        selEnergeOptionData?.windows_frames_share_value_dropdown ?? "",
      );
      formikRef?.current?.setFieldValue(
        "fJointFrame",
        selEnergeOptionData?.windows_frames_joint_frame_value_dropdown ?? "",
      );
    }
  }, [selEnergeOptionData, formikRef?.current, isEnableSteps]);

  useEffect(() => {
    if (!didMount) {
      setTimeout(() => {
        setDidMount(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (!isEnableSteps && formikRef?.current) {
      formikRef.current.resetForm({ values: initialValues });
    }
  }, [isEnableSteps, formikRef?.current]);

  const onHandleSubmitForm = (values) => {
    handleSubmitForm(values);
  };

  // useEffect(() => {
  //   //do your stuff
  //   setIsEditValue(true);
  // }, [formikRef?.current?.values]);

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
          onSubmit={(values) => onHandleSubmitForm(values)}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form onChange={() => setIsEditValue(true)}>
              <div
                className={`rightContent ${
                  selEnergeOptionData?.name ? "scroll-inline" : ""
                } `}
              >
                <div className="main-table">
                  <div className="main-title">General</div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        {/* <p>Heat tramission</p> */}
                        <p>Air tightness</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Infiltration rates [1/h]</p>
                        <Field
                          type="number"
                          placeholder=""
                          id="gInfilRates"
                          name="gInfilRates"
                        />
                      </div>
                    </div>
                    {errors.gInfilRates && touched.gInfilRates ? (
                      <div className="building-material-form-err">
                        {errors.gInfilRates}
                      </div>
                    ) : null}
                  </div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Building density</p>
                        <Field
                          name="buildingDensity"
                          onChange={(e) =>
                            onSelectOption(e, "gAbsorptivity", setFieldValue)
                          }
                          as="select"
                        >
                          <option key="" value="" data-extra="">
                            Custom
                          </option>
                          <option key="500.0" value="High" data-extra="500.0">
                            High
                          </option>
                          <option key="250.0" value="Medium" data-extra="250.0">
                            Medium
                          </option>
                          <option key="0.0" value="Low" data-extra="0.0">
                            Low
                          </option>
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          Absorptivity [Wh/m<sup>2</sup>k]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="gAbsorptivity"
                          id="gAbsorptivity"
                        />
                      </div>
                    </div>
                    {errors.gAbsorptivity && touched.gAbsorptivity ? (
                      <div className="building-material-form-err">
                        {errors.gAbsorptivity}
                      </div>
                    ) : null}
                  </div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Energy bridges</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="gUValue"
                          id="gUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.gUValue && touched.gUValue ? (
                    <div className="building-material-form-err">
                      {errors.gUValue}
                    </div>
                  ) : null}
                </div>
                <div className="main-table">
                  <div className="main-title">Opaque surfaces</div>
                  <div className="sub-title">Walls</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Color</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Absorption coefficient</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="oAbsorption"
                          id="oAbsorption"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.oAbsorption && touched.oAbsorption ? (
                    <div className="building-material-form-err">
                      {errors.oAbsorption}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Thermal conductivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="oUValue"
                          id="oUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.oUValue && touched.oUValue ? (
                    <div className="building-material-form-err">
                      {errors.oUValue}
                    </div>
                  ) : null}
                  <div className="sub-title">Floor</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Thermal conductivity</p>

                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="fUValue"
                          id="fUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.fUValue && touched.fUValue ? (
                    <div className="building-material-form-err">
                      {errors.fUValue}
                    </div>
                  ) : null}
                  <div className="sub-title">Roof</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Color</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Absorption coefficient</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="rAbsorption"
                          id="rAbsorption"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.rAbsorption && touched.rAbsorption ? (
                    <div className="building-material-form-err">
                      {errors.rAbsorption}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Thermal conductivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="rUValue"
                          id="rUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.rUValue && touched.rUValue ? (
                    <div className="building-material-form-err">
                      {errors.rUValue}
                    </div>
                  ) : null}
                </div>
                <div className="main-table">
                  <div className="main-title">Windows</div>
                  <div className="sub-title">Glazing</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Thermal conductivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="wGUValue"
                          id="wGUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.wGUValue && touched.wGUValue ? (
                    <div className="building-material-form-err">
                      {errors.wGUValue}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Energy transmissivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Coefficient</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="wGCoefficient"
                          id="wGCoefficient"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.wGCoefficient && touched.wGCoefficient ? (
                    <div className="building-material-form-err">
                      {errors.wGCoefficient}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Light transmissivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Coefficient</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="wGLightCoefficient"
                          id="wGLightCoefficient"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.wGLightCoefficient && touched.wGLightCoefficient ? (
                    <div className="building-material-form-err">
                      {errors.wGLightCoefficient}
                    </div>
                  ) : null}
                  <div className="sub-title">Frames</div>
                  <div className="border-btm"></div>
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Frame share</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>Share value</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="fShareValue"
                          id="fShareValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.fShareValue && touched.fShareValue ? (
                    <div className="building-material-form-err">
                      {errors.fShareValue}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Thermal conductivity</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>
                          U-value [W/(m<sup>2</sup>K)]
                        </p>
                        <Field
                          type="number"
                          placeholder=""
                          name="fUValue"
                          id="fUValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.fUValue && touched.fUValue ? (
                    <div className="building-material-form-err">
                      {errors.fUValue}
                    </div>
                  ) : null}
                  <div className="items-row">
                    <div className="sub-items">
                      <div className="items">
                        <p>Joint frame value</p>
                        <Field
                          as="select"
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
                        </Field>
                      </div>
                      <div className="items">
                        <p>F-value [W/(mK)]</p>
                        <Field
                          type="number"
                          placeholder=""
                          name="fJointValue"
                          id="fJointValue"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.fJointValue && touched.fJointValue ? (
                    <div className="building-material-form-err">
                      {errors.fJointValue}
                    </div>
                  ) : null}
                </div>
              </div>
              {!isView && (
                <div
                  className={`${
                    toggle ? "position-relative end-0" : ""
                  } end-flex`}
                >
                  <button type="submit" className="Pay-btn">
                    NEXT
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ShowDetails;
