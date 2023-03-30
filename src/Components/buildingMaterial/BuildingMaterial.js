import React, { useState } from "react";

import Navbar from "../Navbar";
import LeftSidebar from "../LeftSidebar";

const BuildingMaterial = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="main-building">
              <div className="left-side-bar-container">
                <LeftSidebar module="BM" />
              </div>
              <div className="building-content ">
                <div className="left-wrp">
                  <div className="main-table">
                    <div className="one-boex ">
                      <div className="stepce">Step 1</div>
                      <div className="table-pading">
                        <h1>
                          Do you have details knowledge about your Building
                          Materials?
                        </h1>
                        <div className="forn-flex">
                          <div className="form-one">
                            <input
                              type="radio"
                              className="inst"
                              id="female"
                              name="gender"
                            />
                            <label className="insted no-1 tow" htmlFor="female">
                              Yes, I do
                            </label>
                          </div>
                          <div className="form-one">
                            <input
                              type="radio"
                              className="inst"
                              id="female1"
                              name="gender"
                            />
                            <label
                              className="insted no-1 tow"
                              htmlFor="female1"
                            >
                              No, I don't have details available
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="one-boex top-brdr">
                      <div className="stepce">Step 2</div>
                      <div className="mt">
                        <div className="Country-flexre">
                          <div className="nav12">
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="vertical-line"></div>
                          <div className="nav12">
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                        </div>
                        <div className="Country-flexre">
                          <div className="nav12">
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="vertical-line"></div>
                          <div className="nav12">
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="one-boex top-brdr">
                      <div className="stepce">Step 3</div>
                      <div className="table-pading">
                        <h1>
                          Did your Building ever undergo Energy Efficient
                          Refurbishment?
                        </h1>
                        <div className="forn-flex">
                          <div className="form-one">
                            <input
                              type="radio"
                              className="inst"
                              id="female2"
                              name="gender"
                            />
                            <label className="insted no-1" htmlFor="female2">
                              No
                            </label>
                          </div>
                          <div className="form-one">
                            <input
                              type="radio"
                              className="inst"
                              id="female3"
                              name="gender"
                            />
                            <label className="insted no-1" htmlFor="female3">
                              Yes, (After 1990)
                            </label>
                          </div>
                          <div className="form-one">
                            <input
                              type="radio"
                              className="inst"
                              id="female4"
                              name="gender"
                            />
                            <label className="insted no-1" htmlFor="female4">
                              Yes, (After 2010)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right-wrp">
                  <p
                    className="rotet cursor-pointer"
                    onClick={() => setToggle(!toggle)}
                  >
                    SHOW DETAILS
                    <img
                      src="assets/img/Home-Page/homeFinal/Path 66.svg"
                      className="porte"
                      alt=""
                    />
                  </p>
                  {toggle && (
                    <div className="rightContent">
                      <div className="main-table">
                        <div className="main-title">General</div>
                        <div className="items-row">
                          <div className="items">
                            <p>Heat tramission</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>Infiltration rates</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="items-row">
                          <div className="items">
                            <p>Energy bridges</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="items-row">
                          <div className="items">
                            <p>Building density</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>Absortvity</p>
                            <input type="text" placeholder="Custom" />
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
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>Absorption coefficient</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="items-row">
                          <div className="items">
                            <p>Thermal conductivity</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="sub-title">Floor</div>
                        <div className="border-btm"></div>
                        <div className="items-row">
                          <div className="items">
                            <p>Thermal conductivity</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="sub-title">Roof</div>
                        <div className="border-btm"></div>
                        <div className="items-row">
                          <div className="items">
                            <p>Color</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>Absorption coefficient</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="items-row">
                          <div className="items">
                            <p>Thermal conductivity</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                      </div>
                      <div className="main-table">
                        <div className="main-title">Windows</div>
                        <div className="sub-title">Glazing</div>
                        <div className="border-btm"></div>
                        <div className="items-row">
                          <div className="items">
                            <p>Color</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>Absorption coefficient</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="items-row">
                          <div className="items">
                            <p>Thermal conductivity</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                        <div className="sub-title">Floor</div>
                        <div className="border-btm"></div>
                        <div className="items-row">
                          <div className="items">
                            <p>Thermal conductivity</p>
                            <select name="heatTramission">
                              <option value="">Custom</option>
                              <option value="india">India</option>
                              <option value="japan">Japan</option>
                              <option value="australia">Australia</option>
                            </select>
                          </div>
                          <div className="items">
                            <p>U-value</p>
                            <input type="text" placeholder="Custom" />
                          </div>
                        </div>
                      </div>
                      <div className="end-flex">
                        <a href="" className="next-btnes">
                          NEXT
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default BuildingMaterial;
