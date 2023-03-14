import React, { useState } from "react";
import { ReactSession } from "react-client-session";
import { toast } from "react-toastify";
import { createProject } from "../Services/UserService";
import { useAuth } from "../../Context/AuthProvider";

import "./slider.css";

function Slider() {
  const [clicked, setClicked] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);

  const { userId, isLoggedIn } = useAuth();

  const handleCreateProjectForGuest = (clickedStatus) => {
    if (clickedStatus) {
      setClicked(true);
    } else {
      setSkipClicked(true);
    }
    let guestUserId = userId || `${Math.floor(Date.now() / 1000)}`;
    if (!userId) {
      ReactSession.set("guest_user_id", guestUserId);
      ReactSession.set("bp3dJson", null);
    }
    const guestProjectName = "project" + new Date().getTime();
    const payload = {
      name: guestProjectName,
      userId: guestUserId,
    };
    createProject(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        if (response?.msg) {
          ReactSession.set("project_id", response?.msg?.[0]?.id);
          if (isLoggedIn == "true") {
            setTimeout(
              (window.location.href =
                "/create-project?name=" + guestProjectName),
              2000,
            );
          } else {
            setTimeout(
              (window.location.href =
                "/create-project?name=" + guestProjectName + "&&skip=true"),
              2000,
            );
          }
        }
      }
    });
  };
  return (
    <div id="main-parant-1" className="main-parant-1">
      <section className="sec-1">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active slider-1 d-block head-img">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="main-grid">
                      <div className="small-grid">
                        <h1 className="head-title bordr">
                          <span className="head-block">
                            MAKE FIRST 3D MODEL{" "}
                          </span>
                          <span className="head-block">OF YOUR HOUSE</span>
                        </h1>
                        <p className="small-title">
                          <span className="head-block">
                            OUR EASY TO USE TOOL CAN CALCULATE YOUR
                            DAILY/MONTHLY CONSUMPTION{" "}
                          </span>
                          <span className="head-block">
                            OF ENERGY AND PROVIDE YOU BETTER CALCUATIONS/RESULT
                            BASED ON DATA YOU PROVIDE.
                          </span>
                        </p>
                      </div>
                      <div>
                        {isLoggedIn == "true" && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            CREATE A PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            TRY FOR FREE
                          </a>
                        )}
                        {isLoggedIn == "true" && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> CREATE A
                            PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> TRY FOR
                            FREE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item slider-2  head-img">
              <div className="container margin-left-10">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="main-wrapper">
                      <div className="small-grid">
                        <h1 className="head-title h-border-2">
                          <span className="head-block">
                            MAKE FIRST 3D MODEL
                          </span>
                          <span className="head-block">OF YOUR HOUSE</span>
                        </h1>
                        <p className="small-title margin-left-16">
                          <span className="head-block">
                            OUR EASY TO USE TOOL CAN CALCULATE YOUR
                            DAILY/MONTHLY CONSUMPTION{" "}
                          </span>
                          <span className="head-block">
                            OF ENERGY AND PROVIDE YOU BETTER CALCUATIONS/RESULT
                            BASED ON DATA YOU PROVIDE.
                          </span>
                        </p>
                      </div>
                      <div>
                        {isLoggedIn == "true" && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            CREATE A PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            TRY FOR FREE
                          </a>
                        )}
                        {isLoggedIn == "true" && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> CREATE A
                            PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> TRY FOR
                            FREE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item slider-3  head-img">
              {" "}
              <div className="container margin-left-10">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="main-wrapper">
                      <div className="small-grid">
                        <h1 className="head-title h-border">
                          <span className="head-block">
                            LETS FIND THE BEST SOLUTION
                          </span>
                          <span className="head-block">FOR YOUR HOME THAT</span>
                          <span className="head-block">IS PERFECT FOR YOU</span>
                        </h1>
                        <p className="small-title margin-left-16">
                          <span className="head-block">
                            OUR EASY TO USE TOOL CAN CALCULATE YOUR
                            DAILY/MONTHLY CONSUMPTION{" "}
                          </span>
                          <span className="head-block">
                            OF ENERGY AND PROVIDE YOU BETTER CALCUATIONS/RESULT
                            BASED ON DATA YOU PROVIDE.
                          </span>
                        </p>
                      </div>
                      <div>
                        {isLoggedIn == "true" && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            CREATE A PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && !clicked && (
                          <a
                            className="head-btn clickable"
                            onClick={() => handleCreateProjectForGuest(true)}
                          >
                            TRY FOR FREE
                          </a>
                        )}
                        {isLoggedIn == "true" && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> CREATE A
                            PROJECT
                          </a>
                        )}
                        {(!isLoggedIn || isLoggedIn == "false") && clicked && (
                          <a className="head-btn loading-button">
                            <i className="fa fa-spinner fa-spin"></i> TRY FOR
                            FREE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Slider;
