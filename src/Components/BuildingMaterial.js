import React, { useState, useEffect } from 'react';
import { ReactSession } from 'react-client-session';

import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';

function BuildingMaterial() {
  const navigate = useNavigate();

  useEffect(() => {
    if (ReactSession.get("is_logged_in")) {
      console.log('BE-Data', JSON.parse(ReactSession.get("bp3dJson")));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-parant-10">
        <section className="sec-1">
          <div className="container-be">
            <div className="row">
              <div className="col-lg-3 left-side-bar-container">
                <LeftSidebar module="BM" />
              </div>
              <div className="col-lg-9 p-0">
                <div className="row piuuw m-0">
                  <div className="col-lg-9 p-0">
                    <div className="main-table">
                      <div className="second-gride">
                        <div className="one-boex">
                          <p className="stepce">Step 1</p>
                          <div className="table-pading">
                            <h1>Do you have details knowledge about your Building Materials?</h1>
                            <div className="forn-flex">
                              <div className="form-one">
                                <input type="radio" className="inst" id="female" name="gender" />
                                <label className="insted no-1 tow" htmlFor="female">Yes, I do</label>
                              </div>
                              <div className="form-one">
                                <input type="radio" className="inst" id="female1" name="gender" />
                                <label className="insted no-1 tow" htmlFor="female1">No, I don't have details available</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="one-boex side-brdr">
                          <p className="stepce qw">Step 3</p>
                          <div className="table-pading">
                            <h1 className="wsw">Did your Building ever undergo Energy Efficient Refurbishment?</h1>
                            <div className="forn-flex">
                              <div className="form-one">
                                <input type="radio" className="inst" id="female2" name="gender" />
                                <label className="insted no-1" htmlFor="female2">No</label>
                              </div>
                              <div className="form-one">
                                <input type="radio" className="inst" id="female3" name="gender" />
                                <label className="insted no-1" htmlFor="female3">Yes, (After 1990)</label>
                              </div>
                              <div className="form-one">
                                <input type="radio" className="inst" id="female4" name="gender" />
                                <label className="insted no-1" htmlFor="female4">Yes, (After 2010)</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="one-boex top-brdr">
                        <p className="stepce">Step 1</p>
                        <div className="Country-flexre">

                          <div className="nav12">
                            <a className="dropdown-toggle1 country-links">
                              Country<img src="assets/img/Home-Page/homeFinal/Path 311.svg" alt="" />
                            </a>
                            {/* <ul className="dropdown1">
                              <li><a className="frech-flx">France <img src="assets/img/Home-Page/homeFinal/Path 132.svg" alt="" /></a></li>
                              <li><a className="frech-flx">Germany</a></li>
                              <li><a className="frech-flx">Spain</a></li>
                            </ul> */}
                          </div>
                          <div className="nav12">
                            <a className="dropdown-toggle1 country-links">
                              Building Type<img src="assets/img/Home-Page/homeFinal/Path 311.svg" alt="" />
                            </a>
                            {/* <ul className="dropdown1">
                              <li><a className="frech-flx">Single Family House </a></li>
                              <li><a className="frech-flx">Terraced House <img src="assets/img/Home-Page/homeFinal/Path 132.svg" alt="" /></a></li>
                              <li><a className="frech-flx">Multi Family House</a></li>
                              <li><a className="frech-flx">Apartment Block</a></li>
                            </ul> */}
                          </div>
                          <div className="nav12">
                            <a className="dropdown-toggle1 country-links">
                              Construction Year<img src="assets/img/Home-Page/homeFinal/Path 311.svg" alt="" />
                            </a>
                            {/* <ul className="dropdown1">
                              <li><a className="frech-flx">1850 <img src="assets/img/Home-Page/homeFinal/Path 132.svg" alt="" /></a></li>
                              <li><a className="frech-flx">1850 - 1900</a></li>
                              <li><a className="frech-flx">1900 - 1950</a></li>
                            </ul> */}
                          </div>
                          <div className="nav12">
                            <a className="dropdown-toggle1 country-links jj">
                              Building Appearance<img src="assets/img/Home-Page/homeFinal/Path 311.svg" alt="" />
                            </a>
                            {/* <ul className="dropdown1">
                              <li><a className="frech-flx">1850 <img src="assets/img/Home-Page/homeFinal/Path 132.svg" alt="" /></a></li>
                              <li><a className="frech-flx">1850 - 1900</a></li>
                              <li><a className="frech-flx">1900 - 1950</a></li>
                            </ul> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 p-0">
                    <div className="main-rotate">
                      <p className="rotet">SHOW DETAILS <img src="assets/img/Home-Page/homeFinal/Path 66.svg" className="porte" alt="" /></p>
                    </div>
                  </div>
                  <div className="col-lg-8 p-0">
                    <div className="one-imgs">
                      <img src="assets/img/Home-Page/casey-horner-4rDCa5hBlCs-unsplash.jpg" className="single-img" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-4 p-0">
                    <div className="end-flex">
                      <a href="" className="next-btnes">NEXT</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BuildingMaterial;
