import React, { useEffect, useRef } from "react";
import { Form, Formik, Field } from "formik";
import ReactTooltip from "react-tooltip";
import { useHvacSystem } from "../../Context/HvacSystemProvider";

const ShowDetails = () => {
  const { setToggle, toggle, heatingWarmWaterData } = useHvacSystem();
  const hvacFormikRef = useRef(null);

  const initialValues = {
    heating_system_transmission_losses: "",
    heating_system_distribution_losses: "",
    warm_water_storage_losses: "",
    warm_water_distribution_losses: "",
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
          onSubmit={(e) => console.log(e)}
          innerRef={hvacFormikRef}
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
                            name="heatTransmission"
                            onChange={(e) => console.log(e)}
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
                            placeholder="0.1"
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
                            name="heatDistribution"
                            onChange={(e) => console.log(e)}
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
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder="0.1"
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
                            name="heatTransmission"
                            onChange={(e) => console.log(e)}
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
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder="0.1"
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
                            name="heatTransmission"
                            onChange={(e) => console.log(e)}
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
                          <div className="info">
                            <p>Share</p>
                            <span data-tip data-for="share">
                              !
                            </span>
                          </div>
                          <Field
                            type="number"
                            placeholder="0.1"
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
                        <Field type="number" placeholder="0.1" name="Shared" />
                        <span>W/m²</span>
                      </div>
                    </div>
                    <div className="items-row">
                      <div className="diff-items">
                        <div className="title">
                          Load during non-operating hours
                        </div>
                        <Field type="number" placeholder="0.1" name="Shared" />
                        <span>W/m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <div className="showDetails-image">
        <img src="assets/img/LoadExisting/project-page.png" alt="showDetails" />
        <div className="relative nextBtn">
          <button type="submit" className="Pay-btn">
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
