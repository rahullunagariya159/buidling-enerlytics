import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./index.css";

const ShowDetails = ({ setToggle, toggle }) => {
  const [inputValue, setInputValue] = useState({});

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

  return (
    <div className="right-wrp">
      <p className="rotet cursor-pointer" onClick={() => setToggle(!toggle)}>
        SHOW DETAILS
        <img
          src={
            toggle
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
          validationSchema={validationSchema}
          validateOnSubmit={true}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="rightContent">
                <div className="main-table">
                  <div className="main-title">General</div>
                  <div className="items-row">
                    <div className="items">
                      {/* <p>Heat tramission</p> */}
                      <p>Air tightness</p>
                      <select name="gAirTightness">
                        <option value="">Custom</option>
                        <option value="2.0">High</option>
                        <option value="1.0">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="buildingDesnsity">
                        <option value="">Custom</option>
                        <option value="500.0">Heigh</option>
                        <option value="250.0">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="energyBridges">
                        <option value="">Custom</option>
                        <option value="0.0">Heigh</option>
                        <option value="5.0">Medium</option>
                        <option value="10.0">Low</option>
                      </select>
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
                      <select name="wColor">
                        <option value="">Custom</option>
                        <option value="1.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="wThermal">
                        <option value="">Custom</option>
                        <option value="10.0">Heigh</option>
                        <option value="5.0">Medium</option>
                        <option value="0">Low</option>
                      </select>
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
                      <select name="fThermal">
                        <option value="">Custom</option>
                        <option value="10.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="roofColor">
                        <option value="">Custom</option>
                        <option value="1.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="thermalConductivity">
                        <option value="">Custom</option>
                        <option value="10.0">Heigh</option>
                        <option value="5.0">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="wThermal">
                        <option value="">Custom</option>
                        <option value="10.0">Heigh</option>
                        <option value="5.0">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="wEnergy">
                        <option value="">Custom</option>
                        <option value="1.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="wLight">
                        <option value="">Custom</option>
                        <option value="1.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="wFrame">
                        <option value="">Custom</option>
                        <option value="1.0">Heigh</option>
                        <option value="0.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="fThermal">
                        <option value="">Custom</option>
                        <option value="10.0">Heigh</option>
                        <option value="5.0">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                      <select name="fJointFrame">
                        <option value="">Custom</option>
                        <option value="5.0">Heigh</option>
                        <option value="2.5">Medium</option>
                        <option value="0.0">Low</option>
                      </select>
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
                <div className="end-flex">
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
