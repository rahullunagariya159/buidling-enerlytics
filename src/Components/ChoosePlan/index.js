import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams, useLocation, matchPath } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import LinkButton from "../LinkButton";
import Button from "../Button";
import AddCard from "../AddCard";
import { getPlans, getPromoDetails, saveCard } from "../Services/UserService";
import { validateInput } from "../../config";
import { Routes } from "../../navigation/Routes";
import Text from "../Text";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51MZ8dBF9eqYsOIGC0tvh8yRVb2Oo93rIKutAJISmU9GzYL01ORwSAc63OcPmQby3oEiS8xgqBtEfwe9DFGZyAlqC00B2TbfJ1E",
);

const ChoosePlan = () => {
  const [payClicked, setPayClicked] = useState(false);
  const [planData, setPlanData] = useState([]);

  const [selectedPlan, setSelectedPlan] = useState("Trial");
  const [selectedCredit, setSelectedCredit] = useState(1);
  const [selectedCost, setSelectedCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [addCardClicked, setAddCardClicked] = useState(false);
  const [applyPromoClicked, setApplyPromoClicked] = useState(false);
  const [applyPromoLoading, setApplyPromoLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [promoCodeError, setPromoCodeError] = useState("");
  const [buyPlanError, setBuyPlanError] = useState("");

  const [promo, setPromo] = useState("");

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isCreateProjectUrl = matchPath(location.pathname, Routes.createProject);
  const isBemodalUrl = matchPath(location.pathname, Routes.beModel);

  const projectName = searchParams.get("name") ? searchParams.get("name") : "";

  const navigate = useNavigate();

  const {
    userId: userID,
    setCurrentPlanDetails,
    isOpenChoosePlanPopup,
    userProfileDetails,
  } = useAuth();

  const handleRedirection = async () => {
    if (isCreateProjectUrl) {
      setTimeout(
        window.location.replace(`${Routes.createProject}?name=` + projectName),
        2000,
      );
    } else if (isBemodalUrl) {
      setTimeout(
        window.location.replace(`${Routes.beModel}?name=` + projectName),
        2000,
      );
    } else {
      setTimeout((window.location.href = "/dashboard"), 2000);
    }
  };

  const skipToBuy = (planName) => {
    if (!userID) {
      return false;
    }

    if (userID || !userProfileDetails?.plan) {
      document.getElementById("CHOOSEPLAN").classList.remove("show");
      // document.getElementsByClassName("modal-backdrop").style.opacity = 0;
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
        if (response?.msg?.Count > 0) {
          setCurrentPlanDetails(response?.msg?.Items);
        }
        // ReactSession.set("user_email_registered", "true");
        handleRedirection();
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

  const showChoosePlanDialog = () => {
    document.getElementById("CHOOSEPLAN").classList.add("show");
  };

  const removePromo = () => {
    setPromoCodeError("");
    setPromo("");
    setDiscount(0);
    setPromoApplied(false);
    document.getElementById("promoCode").value = "";
  };

  const handleBuyPlan = () => {
    setBuyPlanError("");
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

    if (promoApplied) {
      payload.promoCodeName = document.getElementById("promoCode").value;
    }

    getPlans(payload).then((response) => {
      if (response.error) {
        setBuyPlanError(
          response.error ||
            "We are sorry, but something went wrong. Please try again later.",
        );
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
        handleRedirection();
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
      // toast.error("Add your payment details.", { toastId: "toast11" });
      setBuyPlanError("Add your payment details.");
    }
  };

  const handlePromoInput = () => {
    setPromoCodeError("");
    if (applyPromoClicked) {
      const promoElm = document.getElementById("promoCode");
      promoElm.classList.remove("error");
      setApplyPromoClicked(false);
    }
  };

  const applyPromo = () => {
    setPromoCodeError("");
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
          if (response?.error) {
            setPromoCodeError(
              response?.error ||
                "We are sorry, but something went wrong. Please try again later.",
            );
          } else if (response) {
            if (response?.data) {
              toast.success("Promocode applied successfully.", {
                toastId: "toast12",
              });
              setDiscount(response?.data?.discount);
              setPromo(promoElm.value);
              setPromoApplied(true);
            }
          }
        })
        .catch((err) => {
          promoElm.classList.add("error");
          setPromoCodeError("Invalid Promo Code.");
        })
        .finally(() => {
          setApplyPromoLoading(false);
        });
    }
  };

  const totalCost = useMemo(
    () => parseInt(selectedCost) - parseInt(discount),
    [selectedCost, discount],
  );

  const getPaymentData = (data) => {
    console.log("PAYMENT_____", data);
    setBuyPlanError("");
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
            setBuyPlanError(response.error);
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
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setAddCardClicked(false);
          setBuyPlanError(
            "Something went wrong while making the payment. Please try again.",
          );
        });
    }
  };

  useEffect(() => {
    if (userID && isOpenChoosePlanPopup) {
      document.getElementById("enablePlans").click();
    }
  }, [userID, isOpenChoosePlanPopup]);

  return (
    <>
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
                  id="btnChoosePlanClose"
                  type="button"
                  className="x-btn"
                  onClick={() => skipToBuy("Trial")}
                >
                  x
                </button>
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
                    <Text
                      type="error"
                      text={promoCodeError}
                      className="lbl-verification-err"
                    />
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
                            {/* <a className="Change-promo">Change</a> */}
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
                    <Text text={buyPlanError} type="error" />
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
    </>
  );
};

export default ChoosePlan;
