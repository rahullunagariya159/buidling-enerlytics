import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Pricing() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="main-parant-14">
        <section className="sec-1">
          <div>
            <p className="top-home pt-3 text-left">{"Home > Pricing"}</p>
          </div>
          <div className="container brdr-bottom">
            <div className="row">
              <div className="col-lg-12">
                <div className="cntr-area">
                  <div className="modeler-box">
                    <div className="grid-wlcm">
                      <h1 className="WELCOME-title">
                        PAGE UNDER <span className="cimr">DEVELOPMENT</span>
                      </h1>
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

export default Pricing;
