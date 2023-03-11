import React, { useEffect, useState, useMemo } from "react";
import { ReactSession } from "react-client-session";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProject,
  listProjects,
  updateGuestLogin,
  getPlans,
  getPromoDetails,
  saveCard,
} from "./Services/UserService";
import { validateInput } from "../config";
import { Auth } from "aws-amplify";
import Navbar from "./Navbar";
import AddCard from "./AddCard";
import Button from "./Button";
import LinkButton from "./LinkButton";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51MZ8dBF9eqYsOIGC0tvh8yRVb2Oo93rIKutAJISmU9GzYL01ORwSAc63OcPmQby3oEiS8xgqBtEfwe9DFGZyAlqC00B2TbfJ1E",
);

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectList, setProjectList] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [userID, setUserId] = useState("");
  const [promo, setPromo] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Trial");
  const [selectedCredit, setSelectedCredit] = useState(1);
  const [selectedCost, setSelectedCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [payClicked, setPayClicked] = useState(false);
  const [addCardClicked, setAddCardClicked] = useState(false);
  const [createProjectClicked, setCreateProjectClicked] = useState(false);
  const [applyPromoClicked, setApplyPromoClicked] = useState(false);
  const [applyPromoLoading, setApplyPromoLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [isLoggedIn, setLoggedInStatus] = useState(
    ReactSession.get("is_logged_in"),
  );
  const isGuestUser = searchParams.get("skip") || false;

  const handleCreateProjectForGuest = () => {
    let guestUserId = `${Math.floor(Date.now() / 1000)}`;
    ReactSession.set("guest_user_id", guestUserId);
    setCreateProjectClicked(true);

    const guestProjectName = "guest" + new Date().getTime();
    const payload = {
      name: guestProjectName,
      userId: guestUserId,
    };
    createProject(payload)
      .then((response) => {
        setCreateProjectClicked(false);
        if (response.error) {
          toast.error(response.error);
        } else {
          if (response && response.msg) {
            ReactSession.set("project_id", response.msg[0].id);
            if (isGuestUser) {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" + guestProjectName + "&&skip=true"),
                2000,
              );
            } else {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" + guestProjectName),
                2000,
              );
            }
          }
        }
      })
      .catch((err) => {
        setCreateProjectClicked(false);
      });
  };

  const handleCreateProject = () => {
    let projectNameElm = document.getElementById("projectName");
    let checkPName = validateInput(projectNameElm);

    if (checkPName) {
      const payload = {
        name: projectNameElm.value,
        userId: userID,
      };
      createProject(payload).then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          if (response && response.msg) {
            ReactSession.set("project_id", response.msg[0].id);
            if (isGuestUser) {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" +
                  projectNameElm.value +
                  "&&skip=true"),
                2000,
              );
            } else {
              setTimeout(
                (window.location.href =
                  "/create-project?name=" + projectNameElm.value),
                2000,
              );
            }
          }
        }
      });
    } else {
      toast.error("Please enter a project name.", { toastId: "toast11" });
    }
  };

  const handleListProjects = (ID) => {
    const payload = {
      userId: ID,
    };
    listProjects(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        // console.log(response);
        setProjectList(response.data);
      }
    });
  };

  const handleUpdateGuestLogin = () => {
    const payload = {
      id: ReactSession.get("project_id"),
      userId: userID,
    };
    updateGuestLogin(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        ReactSession.set("guest_user_id", null);
        console.log(response);

        const path = ReactSession.get("guest_state");
        navigate(path);
      }
    });
  };

  const checkPlans = (ID) => {
    if (!ID) {
      return false;
    }
    console.log("Check Plans ..", ID);

    const payload = {
      type: "VERIFY",
      userId: ID,
    };
    getPlans(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else if (response?.msg && response?.msg?.Count === 0) {
        // document.getElementById('CHOOSEPLAN').classList.remove('show');
        // document.getElementById('SECURE-RELIABLE').classList.remove('show');
        // document.getElementById('PROMOCODE').classList.add('show');
        document.getElementById("enablePlans").click();
      }
    });
  };

  const redirectToBuy = (planInfo) => {
    // {plan: planName, credit: credits, cost: cost}
    setSelectedPlan(planInfo.plan);
    setSelectedCredit(planInfo.credit);
    setSelectedCost(planInfo.cost);

    if (planInfo.plan === "Trial") {
      setTimeout(skipToBuy(), 1000);
    } else {
      document.getElementById("CHOOSEPLAN").classList.remove("show");
      // document.getElementById('PROMOCODE').classList.add('show');
      document.getElementById("enablePromo").click();
    }
  };

  const handleBuyPlan = () => {
    if (!userID) {
      return false;
    }

    let payload = {
      type: "buy",
      userId: userID,
      planName: selectedPlan,
      creditAmount: selectedCredit,
      amount: totalCost,
    };

    if (cardAdded && selectedCard.cardId) {
      payload.cardId = selectedCard.cardId;
    }

    getPlans(payload).then((response) => {
      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        console.log(response);

        if (response && response.msg) {
          setPlanData(response.msg);
          toast.success(
            `Your ${selectedPlan.toLowerCase()} plan successfully activated.`,
            { toastId: "toast12" },
          );
        }
        // ReactSession.set("user_email_registered", "true");
        setTimeout((window.location.href = "/dashboard"), 2000);
      }
      setPayClicked(false);
    });
  };

  const buyPlan = () => {
    setPayClicked(true);
    if (cardAdded && selectedCard.name) {
      handleBuyPlan();
    } else if (promoApplied && totalCost === 0) {
      handleBuyPlan();
    } else {
      setPayClicked(false);
      document.getElementById("paymentMethod").classList.add("no-card-added");
      toast.error("Add your payment details.", { toastId: "toast11" });
    }
  };

  const skipToBuy = (planName) => {
    if (!userID) {
      return false;
    }
    const payload = {
      type: "buy",
      userId: userID,
      planName: planName ?? selectedPlan,
      creditAmount: selectedCredit,
      amount: 0,
    };
    getPlans(payload).then((response) => {
      setPayClicked(false);

      if (response.error) {
        toast.error(response.error);
      } else {
        // data comes here..
        console.log(response);
        toast.success(
          `Your ${planName.toLowerCase()} plan successfully activated.`,
          { toastId: "toast12" },
        );
        if (response && response.msg) {
          setPlanData(response.msg);
        }
        // ReactSession.set("user_email_registered", "true");
        setTimeout((window.location.href = "/dashboard"), 2000);
      }
    });
  };

  const applyPromo = () => {
    setApplyPromoClicked(true);
    const promoElm = document.getElementById("promoCode");
    const checkPromo = validateInput(promoElm);
    if (checkPromo) {
      setApplyPromoLoading(true);
      const payload = {
        promo_code: promoElm.value.toUpperCase(),
      };
      getPromoDetails(payload)
        .then((response) => {
          if (response.error) {
            toast.error(response.error);
          } else if (response) {
            console.log(response.data);
            if (response.data) {
              toast.success("Promocode applied successfully.", {
                toastId: "toast12",
              });
              setDiscount(response.data.discount);
              setPromo(promoElm.value);
              setPromoApplied(true);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
          promoElm.classList.add("error");
          toast.error("Invalid Promo Code.", { toastId: "toast11" });
        })
        .finally(() => {
          setApplyPromoLoading(false);
        });
    }
  };

  const removePromo = () => {
    setPromo("");
    setDiscount(0);
    setPromoApplied(false);
    document.getElementById("promoCode").value = "";
  };

  const showPromoDialog = () => {
    document.getElementById("PROMOCODE").classList.add("show");
    document.getElementById("PROMOCODE").style.display = "block";
    document.getElementById("enablePromo").click();
  };

  const handleAddNowClick = () => {
    document.getElementById("PROMOCODE").classList.remove("show");
    document.getElementById("SECURE-RELIABLE").classList.add("show");
    document.getElementById("enableCard").click();
  };

  const getPaymentData = (data) => {
    console.log("PAYMENT_____", data);

    if (data && data.paymentMethod) {
      const payload = {
        userId: userID,
        stripe_token: data.token ? data.token.id : "",
        last4: data.paymentMethod.card.last4,
        card_name: data.name,
        card_brand: data.paymentMethod.card.brand,
      };
      saveCard(payload)
        .then((response) => {
          setAddCardClicked(false);
          if (response.error) {
            toast.error(response.error);
          } else if (response) {
            if (response.data) {
              let cardData = {
                cardType: data.selectedCard,
                last4: data?.paymentMethod?.card?.last4 || "",
                isDefault: response.data?.isDefault?.BOOL || true,
                name: data.name,
                cardId: response?.data?.id?.S,
              };

              setCardAdded(true);
              setSelectedCard(cardData);
              document
                .getElementById("paymentMethod")
                .classList.remove("no-card-added");
              document.getElementById("enablePromo").click();
              document
                .getElementById("SECURE-RELIABLE")
                .classList.remove("show");
              document.getElementById("SECURE-RELIABLE").style.display = "none";

              // document.getElementById('CHOOSEPLAN').classList.remove('show');
              // document.getElementById('CHOOSEPLAN').style.display = "none";

              // setTimeout(showPromoDialog(), 2000);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setAddCardClicked(false);
          toast.error(
            "Something went wrong while making the payment. Please try again.",
            { toastId: "toast11" },
          );
        });
    }
  };

  const showChoosePlanDialog = () => {
    document.getElementById("CHOOSEPLAN").classList.add("show");
  };

  useEffect(() => {
    ReactSession.set("bp3dJson", null);

    let IDVal = null;
    if (isGuestUser) {
      IDVal = ReactSession.get("guest_user_id");
      setUserId(IDVal);
    } else {
      IDVal =
        ReactSession.get("building_user") &&
        ReactSession.get("building_user") !== "null"
          ? ReactSession.get("building_user")
          : ReactSession.get("building_social_user");
      setUserId(IDVal);
    }

    if (
      localStorage.getItem("amplify-signin-with-hostedUI") == "true" ||
      localStorage.getItem("amplify-redirected-from-hosted-ui") == "true" ||
      ReactSession.get("user_email_registered") == "true"
    ) {
      ReactSession.set("is_logged_in", "true");
      setLoggedInStatus("true");
    }

    var input = document.getElementById("projectName");
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCreateProject();
      }
    });

    Auth.currentSession()
      .then((data) => {
        let idToken = data.getIdToken();
        let email = idToken.payload.email;
        ReactSession.set("building_social_user", email);
        ReactSession.set("is_logged_in", "true");
        !IDVal && setUserId(email);
      })
      .catch((err) => console.log(err));

    if (ReactSession.get("is_logged_in")) {
      if (ReactSession.get("guest_user_id")) {
        handleUpdateGuestLogin();
      }
    }
    // else {
    //   navigate('/');
    // }
  }, []);

  useMemo(() => {
    if (userID) {
      checkPlans(userID);
      handleListProjects(userID);
    }
  }, [userID]);

  const handlePromoInput = () => {
    if (applyPromoClicked) {
      const promoElm = document.getElementById("promoCode");
      promoElm.classList.remove("error");
      setApplyPromoClicked(false);
    }
  };

  const totalCost = useMemo(
    () => parseInt(selectedCost) - parseInt(discount),
    [selectedCost, discount],
  );

  return (
    <div>
      <Navbar />

      <div className="main-parant-9">
        <section className="sec-1">
          <div className="breadcrumb-top">
            <p className="top-home pt-3 text-left">
              {"Home > Building Modeler"}
            </p>
          </div>
          <div className="container brdr-bottom">
            <div className="row">
              <div className="col-lg-12">
                {/* <div>
                  <p className="top-home pt-3 text-left">{'Home > Building Modeler'}</p>
                </div> */}
                <div className="cntr-area">
                  <div className="modeler-box">
                    <div className="grid-wlcm">
                      <h1 className="WELCOME-title">
                        WELCOME T<span className="botm-brdr">O THE </span>
                        <span className="cimr">
                          BE Modeler{" "}
                          <sup>
                            <img src="" className="rr2" alt="" />
                          </sup>
                        </span>
                      </h1>
                      <p className="wlcm-pra p-1">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting
                        <span className="block-indus">
                          industry. Lorem Ipsum has been the industry's.
                        </span>
                      </p>
                    </div>
                    <div className="PROJECT-btns">
                      {!isGuestUser && (
                        <a
                          data-bs-toggle="modal"
                          data-bs-target="#STARTPROJECT"
                          className="PROJECT-one"
                        >
                          START NEW PROJECT
                        </a>
                      )}
                      {isGuestUser !== false && !createProjectClicked && (
                        <a
                          className="PROJECT-one"
                          onClick={handleCreateProjectForGuest}
                        >
                          START NEW PROJECT 2
                        </a>
                      )}
                      {isGuestUser !== false && createProjectClicked && (
                        <a className="PROJECT-one loading-button">
                          <i className="fa fa-spinner fa-spin"></i> START NEW
                          PROJECT
                        </a>
                      )}

                      <a
                        id="loadProjects"
                        className="PROJECT-one tow load-existing"
                        onClick={() => navigate("/load-project")}
                        disabled={isGuestUser || projectList.length === 0}
                      >
                        LOAD AN EXISTING PROJECT
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <a
        id="enablePlans"
        data-bs-toggle="modal"
        data-bs-target="#CHOOSEPLAN"
        hidden
      >
        Choose Plans
      </a>
      <a
        id="enablePromo"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#PROMOCODE"
        hidden
      >
        Promo Code
      </a>
      <a
        id="enableCard"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#SECURE-RELIABLE"
        hidden
      >
        Choose Card
      </a>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="STARTPROJECT"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signin">
          <div className="modal-content signin START">
            <div>
              <button
                type="button clickable"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="modal-header-flex">
              <h1 className="start-title">
                <span className="botm-brdr">START N</span>EW PROJECT
              </h1>
            </div>
            <div className="start-grid">
              <div>
                <input
                  type="text"
                  id="projectName"
                  placeholder="Project Name"
                  className="Project-input pop-create"
                />
              </div>
              {/* <div className="positionq">
                <input type="text" placeholder="Project Type" className="Project-input" />
                <img src="assets/img/Home-Page/homeFinal/Path 42.svg" className="arrow-ic" alt="" />
              </div> */}
            </div>
            <div className="CONTINUE-space">
              <a
                className="CONTINUE-btn clickable"
                onClick={handleCreateProject}
              >
                CONTINUE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- CHOOSE YOUR PLAN Modal --> */}
      <div
        className="modal fade"
        id="CHOOSEPLAN"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signup">
          <div className="modal-content signup plane">
            <div className="CHww">
              <div className="sdww col-lg-3">
                <a className="Selected"> Select currency</a>
                <a className="Euroed">
                  Euro <img src="assets/img/Home–new/black-drop.svg" alt="" />
                </a>

                {/* <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Euro
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="#">Dollar</a>
                  </div>
                </div> */}
              </div>
              <div className="WHAT-we col-lg-6">
                <p className="CHOOSwE-pra">CHOOSE YOUR PLAN</p>
                <p className="WHAT-praw">
                  PAY ONLY FOR WHAT YOU ACTUALLY USE
                  <span className="esdw">
                    {" "}
                    NO SUBSCRIPTION, NO FREQUENT PAYMENTS{" "}
                  </span>
                </p>
              </div>
              <div className="col-lg-3 text-end">
                <button
                  type="button"
                  className="x-btn"
                  onClick={() => skipToBuy("Trial")}
                >
                  x
                </button>
                {/* <a className="clickable" onClick={() => skipToBuy("Trial")}>
                  <img src="assets/img/Home–new/close_icon.png" alt="" />
                </a> */}
              </div>
            </div>
            <div className="plan-box">
              <div className="first-box">
                <div className="first-space">
                  <h6 className="top-titel">TRIAL</h6>
                  <p className="top-pra">
                    Try out the most robust & user-friendly web tool accessible
                    right now.
                  </p>
                </div>
                <div className="sec-spece">
                  <div>
                    <h1 className="plan-title">€0</h1>
                  </div>
                  <div className="plan-grid">
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      1 Credit included
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      1 Project
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      1 Project configuration
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      Detailed analytics
                    </p>
                  </div>
                  <div>
                    <a
                      className="Try-now-btn clickable"
                      onClick={() => skipToBuy("Trial")}
                    >
                      Try now
                    </a>
                  </div>
                </div>
              </div>
              <div className="second-box">
                <div className="bast-ss">
                  <p className="selling">Best selling</p>
                </div>
                <div className="first-space brdt">
                  <h6 className="top-titel orn">HOME</h6>
                  <p className="top-pra orn">
                    Try out the most robust & user-friendly web tool accessible
                    right now.
                  </p>
                </div>
                <div className="sec-spece">
                  <div>
                    <h1 className="plan-title orn">€30</h1>
                    <p className="plan-pra orn">
                      Additional 100 credits for €15
                    </p>
                  </div>
                  <div className="plan-grid">
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      100 Credits included
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      100 Credit included
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      3 Project
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      10 Project configuration
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      Detailed analytics
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      Automatic model calibration
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      Efficiency & savings calculations
                    </p>
                    <p className="plan-pra orn">
                      <img
                        src="assets/img/Choose-plane/checked-verified.svg"
                        className="plan-img"
                        alt=""
                      />
                      Full standard set of weather data
                    </p>
                  </div>
                  <div>
                    <a
                      className="Try-now-btn orn clickable"
                      onClick={() =>
                        redirectToBuy({ plan: "Basic", credit: 100, cost: 30 })
                      }
                    >
                      Start now
                    </a>
                  </div>
                </div>
              </div>
              <div className="first-box">
                <div className="first-space">
                  <h6 className="top-titel">PROFESSIONAL</h6>
                  <p className="top-pra">
                    Try out the most robust & user-friendly web tool accessible
                    right now.
                  </p>
                </div>
                <div className="sec-spece non">
                  <div>
                    <div>
                      <h1 className="plan-title">€70</h1>
                    </div>
                    <div className="Additional-bra">
                      <p className="plan-pra">Additional 100 credits for €10</p>
                      <p className="plan-pra colre">
                        Covers all features of Home
                      </p>
                    </div>
                  </div>
                  <div className="plan-grid">
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      300 Credits included
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      Unlimited Projects
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      20 Project configuration
                    </p>
                    <p className="plan-pra">
                      <img
                        src="assets/img/Choose-plane/checked-verified-1.svg"
                        className="plan-img"
                        alt=""
                      />
                      Individual Weather locations
                    </p>
                  </div>
                  <div>
                    <a
                      className="Try-now-btn clickable"
                      onClick={() =>
                        redirectToBuy({
                          plan: "Premium",
                          credit: 300,
                          cost: 70,
                        })
                      }
                    >
                      Start now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-plan">
              <a
                className="skip-bt clickable"
                onClick={() => skipToBuy("Trial")}
              >
                {" "}
                Skip <img src="assets/img/Home–new/next-black.svg" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- CHOOSE ADD PROMO CODE --> */}
      <div
        className="modal fade"
        id="PROMOCODE"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signup">
          <div className="modal-content signup PROMOCODE">
            <button
              type="button"
              className="x-btn close_iconw"
              onClick={showChoosePlanDialog}
              data-bs-dismiss="modal"
            >
              x
            </button>
            {/* <img
              src="assets/img/Home–new/close_icon.png"
              className="close_iconw"
              data-bs-dismiss="modal"
              alt=""
              onClick={() => showChoosePlanDialog()}
            /> */}
            <div className="row m-0">
              <div className="col-lg-6 p-0">
                <div className="canter-aline">
                  <div className="second-box">
                    <div className="bast-ss">
                      <p className="selling">Best selling</p>
                    </div>
                    <div className="first-space brdt">
                      <h6 className="top-titel orn">{selectedPlan}</h6>
                      <p className="top-pra orn">
                        Try out the most robust & user-friendly web tool
                        accessible right now.
                      </p>
                    </div>
                    <div className="sec-spece">
                      <div>
                        <h1 className="plan-title orn">
                          €{parseInt(selectedCost)}
                        </h1>
                        <p className="plan-pra orn">
                          Additional 100 credits for €15
                        </p>
                      </div>
                      <div className="plan-grid">
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          100 Credits included
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          100 Credit included
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          3 Project
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          10 Project configuration
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          Detailed analytics
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          Automatic model calibration
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          Efficiency & savings calculations
                        </p>
                        <p className="plan-pra orn">
                          <img
                            src="assets/img/Choose-plane/checked-verified.svg"
                            className="plan-img"
                            alt=""
                          />
                          Full standard set of weather data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 p-0">
                <div className="right-promo-box">
                  <div className="PROMO-main-box">
                    <div className="grid-promo">
                      <h6 className="add-title-promo">ADD PROMO CODE</h6>
                      <p className="enter-promo">Enter promo code</p>
                    </div>
                    <div className="Apply-btn-flex">
                      <input
                        id="promoCode"
                        type="text"
                        placeholder="Promo code here"
                        className="promo-input"
                        maxLength={10}
                        onInput={handlePromoInput}
                      />
                      <LinkButton
                        className={`Apply-btn ${
                          applyPromoLoading ? "loading-button" : ""
                        }`}
                        onClick={applyPromo}
                        title="Apply"
                        isLoading={applyPromoLoading}
                        isDisable={applyPromoLoading}
                      />
                      <LinkButton
                        className="Remove-btn"
                        onClick={removePromo}
                        title="Remove"
                      />
                    </div>
                    <div>
                      <p className="Terms-pr">Terms & conditions applied</p>
                    </div>
                  </div>
                  <div className="main-Credit-aline" id="paymentMethod">
                    {cardAdded ? (
                      <div className="w-100">
                        <div className="Credit-box">
                          <div className="card-Credit-box">
                            <p className="Harry-name">{selectedCard.name}</p>
                            <p className="Credit-card">
                              {selectedCard.cardType}
                            </p>
                            <p className="Default">Default</p>
                          </div>
                          <div>
                            {/* <a className="Change-promo" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#SECURE-RELIABLE">Change</a> */}
                            <a className="Change-promo">Change</a>
                          </div>
                        </div>
                        <div className="visa-flex">
                          <p className="number-card">
                            ****-****-****-
                            <span className="pt-1">{selectedCard.last4}</span>
                          </p>
                          <img
                            src="assets/img/Home–new/visa-credit-card.png"
                            className="visa-ixs"
                            alt=""
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-100">
                        <div className="visa-flex p-0">
                          <p className="payment-card">
                            No payment method added yet
                          </p>
                          <a
                            className="Add-promo"
                            data-bs-dismiss="modal"
                            data-bs-toggle="modal"
                            data-bs-target="#SECURE-RELIABLE"
                          >
                            Add now
                          </a>
                          {/* <a className="Add-promo" onClick={handleAddNowClick}>Add now</a> */}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="padin-pss">
                    <h6 className="Ordr-summary">Order summary</h6>
                  </div>
                  <div className="cost-ps">
                    <div className="cost-grid bordr">
                      <p className="Plan-cst">Plan cost</p>
                      <p className="Plan-cst-back">€{parseInt(selectedCost)}</p>
                    </div>
                    <div className="cost-grid">
                      <p className="Plan-cst">Promo code</p>
                      {promoApplied && (
                        <p className="Plan-cst-back flex">
                          {promo}
                          <img
                            src="assets/img/Home–new/chk-blue.svg"
                            className="chk-ic"
                            alt=""
                          />
                        </p>
                      )}
                    </div>
                    <div className="cost-grid">
                      <p className="drk-grey">Total cost</p>
                      <p className="totle-grt">€{totalCost}</p>
                    </div>
                  </div>
                  <div className="pay-back-flex">
                    <Button
                      className={`Pay-btn ${
                        payClicked ? "loading-button" : ""
                      }`}
                      title={totalCost > 0 ? "Pay" : "Activate"}
                      isLoading={payClicked}
                      isDisable={payClicked}
                      onClick={buyPlan}
                    />
                    {/* <a className="Back-btn" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#CHOOSEPLAN">Back</a> */}
                    <button
                      type="button clickable"
                      className="Back-btn"
                      data-bs-dismiss="modal"
                      onClick={showChoosePlanDialog}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- SECURE AND RELIABLE CODE --> */}
      <div
        className="modal fade"
        id="SECURE-RELIABLE"
        tabIdex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signup">
          <div className="modal-content signup card-detal">
            <button
              type="button"
              className="x-btn close_iconw"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={showChoosePlanDialog}
            >
              x
            </button>
            {/* <img
              src="assets/img/Home–new/close_icon.png"
              className="close_iconw"
              data-bs-dismiss="modal"
              alt=""
            /> */}
            <div className="row m-0">
              <div className="col-lg-6 p-0">
                <div className="Add-credit-aline">
                  <img
                    src="assets/img/Add-credit-card-details/AddCardLogo.jpg"
                    className="hgyu"
                    alt=""
                  />
                </div>
              </div>
              <div className="col-lg-6 p-0">
                <Elements stripe={stripePromise}>
                  <AddCard
                    getPaymentData={getPaymentData}
                    addCardClicked={addCardClicked}
                    handleAddCardSpinner={(e) => setAddCardClicked(e)}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
