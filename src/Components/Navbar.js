import React, { useContext, useState } from "react";
import { ReactSession } from "react-client-session";

import { toast } from "react-toastify";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  matchPath,
} from "react-router-dom";
import { AccountContext } from "./Account";
import { validateInput } from "../config";
import UserPool from "../UserPool";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Routes } from "../navigation/Routes";
import LinkButton from "./LinkButton";
import useEnterKeyListener from "../helpers/useEnterKeyListener";
import { updateGuestLogin } from "./Services/UserService";
import { checkPassword } from "../utils";
import { useAuth } from "../Context/AuthProvider";
import ChoosePlan from "./ChoosePlan";
import "../assets/styles/login.css";

function Navbar(props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { logout, authenticate } = useContext(AccountContext);

  // const isGuestUser = searchParams.get("skip") || false;
  const projectName = searchParams.get("name") ? searchParams.get("name") : "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newpassword, setNewPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regClicked, setRegClicked] = useState(false);
  const [verifyAccountClicked, setVerifyAccountClicked] = useState(false);
  const [regError, setRegError] = useState("");
  const { userId, currentPlanDetails, isLoggedIn, isGuestUser } = useAuth();

  // ---- Register ---

  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPassReg, setConfirmPassReg] = useState("");
  const [tcAccepted, setTCAccepted] = useState("");
  const [verifyProcess, setVerifyProcess] = useState(false);
  const [OTP, setOTP] = useState({});

  const isCreateProjectUrl = matchPath(location.pathname, Routes.createProject);
  const isBemodalUrl = matchPath(location.pathname, Routes.beModel);
  const isHomeUrl = matchPath(location.pathname, Routes.home);
  const isDashboardUrl = matchPath(location.pathname, Routes.dashboard);
  const isPricingUrl = matchPath(location.pathname, Routes.pricing);
  const isContactUsUrl = matchPath(location.pathname, Routes.contactUs);
  const isAboutUsUrl = matchPath(location.pathname, Routes.aboutUs);

  const navigateToModule = (module) => {
    if (isGuestUser) {
      navigate({ pathname: "/" + module, search: "?skip=true" });
    } else {
      navigate("/" + module);
    }
  };

  const logoutSession = () => {
    logout();

    ReactSession.set("is_logged_in", false);
    ReactSession.set("alreadyShow", false);
    ReactSession.set("bp3dJson", null);
    ReactSession.set("alreadyShow", null);
    ReactSession.set("building_user", null);
    ReactSession.set("building_social_user", null);
    ReactSession.set("user_email_registered", null);
    localStorage.setItem("amplify-signin-with-hostedUI", null);
    localStorage.setItem("amplify-redirected-from-hosted-ui", null);
    // localStorage.clear();
    // ReactSession.clear();

    setTimeout((window.location.href = "/"), 2000);
  };

  const onSubmitSignup = (e) => {
    e.preventDefault();

    const attributeList = [];

    let emailElm = document.getElementById("emailRegister");
    let passwordElm = document.getElementById("passwordRegister");
    let confirmPasswordElm = document.getElementById("confirmPasswordReg");
    let termsCheckElm = document.getElementById("TCAccepted");

    let checkEmail = validateInput(emailElm);
    let checkPass = validateInput(passwordElm);
    let checkCP = validateInput(confirmPasswordElm);
    let checkTerms = validateInput(termsCheckElm);

    if (checkPass && checkCP) {
      if (!emailReg) {
        toast.error("Please enter all required input values.", {
          toastId: "toast11",
        });
        return false;
      } else if (emailReg && !checkEmail) {
        toast.error("Please enter valid email address.", {
          toastId: "toast11",
        });
        return false;
      }

      if (passwordReg.length < 6) {
        toast.error("Please enter at least 6 digits for password.", {
          toastId: "toast11",
        });
        return false;
      } else if (!checkPassword(passwordReg)) {
        setRegClicked(false);
        setRegError(
          "Password contains at least 8 characters or more, 1 number, 1 letter, 1 lower case letter, and 1 upper case letter required",
        );

        passwordElm.classList.add("error");
        confirmPasswordElm.classList.add("error");
        return false;
      } else if (passwordReg !== confirmPassReg) {
        toast.error("Comfirm password couldn't match.", { toastId: "toast11" });
        return false;
      }

      if (!checkTerms) {
        toast.error("Please accept terms and conditions.", {
          toastId: "toast11",
        });
        return false;
      }

      setRegClicked(true);

      userSignUp()
        .then((data) => {
          setVerifyProcess(true);
          toast.success("OTP sent to your provided email id.");
          document.getElementById("getOTP").click();
        })
        .catch((e) => {
          if (e === "UsernameExistsException") {
            console.log(e);
            toast.error("Already register with this email address");
          } else if (e === "InvalidPasswordException") {
            passwordElm.classList.add("error");
            toast.error("Please enter a valid password.", {
              toastId: "toast11",
            });
          } else {
            toast.error(e);
          }
        })
        .finally(() => {
          setRegClicked(false);
        });
    } else {
      toast.error("Please enter all required input values.", {
        toastId: "toast11",
      });
      setRegClicked(false);

      return false;
    }
  };

  const resendOTP = async () => {
    const user = new CognitoUser({
      Username: emailReg || username,
      Pool: UserPool,
    });
    await user.resendConfirmationCode((err, result) => {
      if (err) {
        toast.error(
          "We are sorry, but something went wrong. Please try again later.",
        );
      } else {
        setVerifyProcess(true);
        toast.success("OTP sent to your provided email id.", {
          toastId: "toast12",
        });
      }
    });
  };

  const userSignUp = () => {
    return new Promise((resolve, reject) => {
      UserPool.signUp(emailReg, passwordReg, [], null, (error, result) => {
        if (error) {
          // TODO this code shouldn't know about graphql errors. refactor to use separate layers
          if (error.code === "UsernameExistsException") {
            reject(error.code);
          } else {
            reject(error);
          }
          return;
        }
        resolve(result);
      });
    });
  };

  const SetOtpFunc = (e, index) => {
    let digit = e.target.value;
    let currentElm = e.srcElement || e.target;
    let nextElm = currentElm.nextElementSibling;

    switch (index) {
      case 1:
        setOTP({ ...OTP, d1: digit });
        break;
      case 2:
        setOTP({ ...OTP, d2: digit });
        break;
      case 3:
        setOTP({ ...OTP, d3: digit });
        break;
      case 4:
        setOTP({ ...OTP, d4: digit });
        break;
      case 5:
        setOTP({ ...OTP, d5: digit });
        break;
      case 6:
        setOTP({ ...OTP, d6: digit });
        break;
      default:
        break;
    }

    if (nextElm && digit) {
      nextElm.focus();
    }
  };

  const validateOTP = () => {
    const errorOTP = [];
    const otpElm = ["digit1", "digit2", "digit3", "digit4", "digit5", "digit6"];
    otpElm.forEach((element) => {
      let otpDigitElm = document.getElementById(element);
      let checkOTPDigit = validateInput(otpDigitElm);
      if (!checkOTPDigit) {
        errorOTP.push(element);
      }
    });
    return !errorOTP.length;
  };

  const handleUpdateGuestLogin = (uId) => {
    const payload = {
      id: ReactSession.get("project_id"),
      userId: uId,
    };

    try {
      return updateGuestLogin(payload).then((response) => {
        if (response.error) {
          toast.error(response.error);
          return false;
        } else {
          ReactSession.set("guest_user_id", null);
          console.log(response);
          return true;
          // const path = ReactSession.get("guest_state");
          // navigate(path);
        }
      });
    } catch (error) {
      toast.error(error);
      return false;
    }
  };

  const handleRedirection = async (userId) => {
    if (isCreateProjectUrl) {
      const result = await handleUpdateGuestLogin(userId);
      if (result) {
        setTimeout(
          window.location.replace(
            `${Routes.createProject}?name=` + projectName,
          ),
          2000,
        );
      }
    } else if (isBemodalUrl) {
      const result = await handleUpdateGuestLogin(userId);
      if (result) {
        setTimeout(
          window.location.replace(`${Routes.beModel}?name=` + projectName),
          2000,
        );
      }
    } else {
      setTimeout((window.location.href = "/dashboard"), 2000);
    }
  };

  const verifyAccount = (e) => {
    e.preventDefault();
    setVerifyAccountClicked(true);
    const checkOTP = validateOTP();
    if (checkOTP) {
      const otpVal = OTP.d1 + OTP.d2 + OTP.d3 + OTP.d4 + OTP.d5 + OTP.d6;

      const user = new CognitoUser({
        Username: emailReg || username,
        Pool: UserPool,
      });

      user.confirmRegistration(otpVal, true, (err, data) => {
        if (err) {
          console.log(err);
          toast.error(
            "Couldn't verify your account, please enter a valid OTP.",
            { toastId: "toast11" },
          );
        } else {
          ReactSession.set("is_logged_in", "true");
          ReactSession.set("building_user", emailReg || username);
          toast.success("Account verified successfully.");

          handleRedirection(emailReg || username);
        }
        setVerifyAccountClicked(false);
      });
    } else {
      setVerifyAccountClicked(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let usernameElm = document.getElementById("username");
    let passwordElm = document.getElementById("loginPass");

    let checkUN = validateInput(usernameElm);
    let checkPass = validateInput(passwordElm);

    if (checkPass) {
      if (!username) {
        toast.error("Please enter all required input values.", {
          toastId: "toast11",
        });
        setIsLoading(false);
        return false;
      } else if (username && !checkUN) {
        toast.error("Please enter a valid email address.", {
          toastId: "toast11",
        });
        setIsLoading(false);
        return false;
      }
      authenticate(username, password)
        .then((data) => {
          console.log(data);
          toast.success("login success.");
          ReactSession.set("building_user", username);
          ReactSession.set("is_logged_in", "true");

          if (data?.idToken?.payload?.email) {
            handleRedirection(data?.idToken?.payload?.email);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Incorrect email or password.", { toastId: "toast11" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error("Please enter all required input values.", {
        toastId: "toast11",
      });
      setIsLoading(false);
      return false;
    }
  };

  const onForgotPassword = () => {
    let userEmailElm = document.getElementById("userEmail");
    let checkUE = validateInput(userEmailElm);

    if (checkUE) {
      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      user.forgotPassword({
        onSuccess: function (data) {
          // successfully initiated reset password request
          console.log("CodeDeliveryData from forgotPassword: " + data);
        },
        onFailure: function (err) {
          toast.error(err.message || JSON.stringify(err));
        },
        //Optional automatic callback
        inputVerificationCode: function (data) {
          toast.success(
            "Code sent to: " + data.CodeDeliveryDetails.Destination,
          );

          document.getElementById("forgotBtn").click();
        },
      });
    } else {
      toast.error("Enter valid email address to reset password!", {
        toastId: "toast11",
      });
    }
  };

  const onSubmitPassword = () => {
    var code = document.getElementById("verificationCode");
    var newPassword = document.getElementById("newPassword");

    let checkCode = validateInput(code);
    let checkNP = validateInput(newPassword);

    if (checkCode && checkNP) {
      if (newPassword.value.length < 6) {
        toast.error("Please enter atleast 6 digits for password.", {
          toastId: "toast11",
        });
        return false;
      }

      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      user.confirmPassword(code.value, newPassword.value, {
        onSuccess() {
          toast.success("Password reset successfully.");
          setTimeout((window.location.href = "/"), 2000);
        },
        onFailure(err) {
          console.log(err);
          toast.error(
            "Password couldn't be updated, please check your verification code.",
            { toastId: "toast11" },
          );
        },
      });
    }
  };

  const toggleDropdown = () => {
    document.getElementById("myDropdown").classList.toggle("show");
  };

  const setShowPassword = (elmData) => {
    if (elmData.elem === "login") {
      setShowLoginPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    } else if (elmData.elem === "register") {
      setShowRegPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    } else if (elmData.elem === "confirm") {
      setShowConfirmPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      });
    } catch (error) {
      console.log("--->>navbar login error", error);
    }
  };

  useEnterKeyListener({
    querySelectorToExecuteClick: "#btnSubmitOtp",
  });

  const keypressed = (e) => {
    if (e.keyCode === 8) {
      let currentElm = e.srcElement || e.target;
      let prevElm = currentElm.previousElementSibling;
      if (prevElm) {
        currentElm.value = "";
        prevElm.focus();
      }
    }
  };
  const updateValidation = (value) => {
    let emailElm = document.getElementById("emailRegister");
    let passwordElm = document.getElementById("passwordRegister");
    let confirmPasswordElm = document.getElementById("confirmPasswordReg");
    let termsCheckElm = document.getElementById("TCAccepted");

    switch (value) {
      case "terms":
        if (!tcAccepted) {
          validateInput(termsCheckElm);
        }
        break;
      case "email":
        validateInput(emailElm);
        break;
      case "password":
        validateInput(passwordElm);
        break;
      case "cPassword":
        validateInput(confirmPasswordElm);
        break;
      default:
    }
  };
  return (
    <div className="main-nav mb-95px">
      <div className="brdr-bottom full">
        <header className="header bg-img header-sticky ">
          <nav className="navbar">
            <a className="logo-link" onClick={() => navigate("/")}>
              <img src="assets/img/Home-Page/Asset 8@3x@2x.png" alt="" />
            </a>
            <input type="checkbox" id="nav" className="hidden" />
            <label htmlFor="nav" className="nav-toggle">
              <span></span>
              <span></span>
              <span></span>
            </label>
            <div className="wrapper">
              <ul className="menu m-0 p-0">
                <li className="menu-item">
                  <a
                    className={`link-itme ${isHomeUrl ? "active" : ""}`}
                    onClick={() => navigate("/")}
                  >
                    Home
                  </a>
                </li>
                <li className="menu-item">
                  <a
                    id="dashboard-link"
                    className={`link-itme reg-mark-icon ${
                      isDashboardUrl ? "active" : ""
                    }`}
                    onClick={() => navigateToModule("dashboard")}
                  >
                    BE Modeler{" "}
                    <sup>
                      <img src="" className="rr" alt="" />
                    </sup>
                  </a>
                </li>
                <li className="menu-item">
                  <a
                    id="price-link"
                    className={`link-itme ${isPricingUrl ? "active" : ""}`}
                    onClick={() => navigateToModule("pricing")}
                  >
                    Pricing
                  </a>
                </li>
                <li className="menu-item">
                  <a
                    id="contact-link"
                    className={`link-itme ${isContactUsUrl ? "active" : ""}`}
                    onClick={() => navigateToModule("contact-us")}
                  >
                    Contact us
                  </a>
                </li>
                <li className="menu-item">
                  <a
                    id="about-link"
                    className={`link-itme ${isAboutUsUrl ? "active" : ""}`}
                    onClick={() => navigateToModule("about-us")}
                  >
                    About us
                  </a>
                </li>
                {/* <!-- <li className="menu-item">
                      <a className="link-itme flex" href="#" >
                          <img src="assets/img/Home-Page/profile.png" className="profil" alt="" />
                          <img src="assets/img/Home-Page/homeFinal/Polygon 3.svg" alt="" />
                      </a>
                  </li> --> */}
              </ul>
            </div>
            <div className="main-login-btns">
              <div className="dropdown">
                <button onClick={toggleDropdown} className="dropbtn">
                  <img
                    src="assets/img/Home–new/NoPath@2x.png"
                    className="profil lang"
                    alt=""
                  />
                  English
                  <img src="assets/img/Home–new/gry-arrow.svg" alt="" />
                </button>
                <div
                  id="myDropdown"
                  className={`dropdown-content ${
                    isLoggedIn == "true" && userId ? "position-fixed" : ""
                  } `}
                >
                  <a className="active">
                    <img
                      src="assets/img/Home–new/NoPath@2x.png"
                      className="profil lang"
                      alt=""
                    />{" "}
                    English <span className="selected-lang"></span>
                  </a>
                  <a>
                    <img
                      src="assets/img/Home–new/german.png"
                      className="profil lang"
                      alt=""
                    />{" "}
                    German
                  </a>
                </div>
              </div>

              {isLoggedIn == "true" && userId ? (
                <div className="login-btn">
                  <a
                    className="Register-done clickable"
                    data-bs-toggle="modal"
                    data-bs-target="#LOGOUT"
                    data-bs-keyboard="false"
                    data-bs-backdrop="static"
                  >
                    <img
                      src="assets/img/Home-Page/profile.png"
                      className="profil"
                      alt=""
                    />
                    {currentPlanDetails?.[0]?.creditAmount
                      ? currentPlanDetails?.[0]?.creditAmount + " Credits"
                      : ""}
                    <img src="assets/img/Home–new/wihte-drop.svg" alt="" />
                  </a>
                </div>
              ) : (
                <div className="login-btn">
                  <a
                    className="Login"
                    data-bs-toggle="modal"
                    data-bs-target="#SIGNIN"
                  >
                    Log in
                  </a>
                  <a
                    className="Register"
                    data-bs-toggle="modal"
                    data-bs-target="#SIGNup"
                  >
                    Register
                  </a>
                </div>
              )}
            </div>
          </nav>
        </header>
      </div>

      {/* <!-- data-bs-toggle="modal" data-bs-target="#PROMOCODE" --> */}

      {/* <!-- SIGN-IN Modal --> */}
      <div
        className="modal fade"
        id="SIGNIN"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signin">
          <div className="modal-content signin">
            <div>
              <button
                type="button"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Login</h1>
              <p className="Your-Email">
                <span className="botm-brdr">Log in with your Goo</span>gle
                account
              </p>
            </div>
            <div className="socil-flex">
              <img
                src="assets/img/Home-Page/google-plusb.svg"
                alt=""
                className="google-ic"
                onClick={() => handleLoginWithGoogle()}
              />
              {/* <img src="assets/img/Sign-up/facebook.svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })} /> */}
            </div>
            <div className="top-sign">
              <div className="sign-space-input">
                <div>
                  <p className="or-log">Or log in using you email address</p>
                  <input
                    id="username"
                    type="email"
                    placeholder="Email"
                    className="sign-in-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-position">
                  <input
                    id="loginPass"
                    type="password"
                    placeholder="Password"
                    className="sign-in-input"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setRegError("");
                    }}
                    minLength={6}
                    maxLength={16}
                  />
                  <a className="show-ic">
                    {showLoginPassword ? (
                      <img
                        src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg"
                        alt=""
                        onClick={() =>
                          setShowPassword({
                            isVisible: false,
                            id: "loginPass",
                            elem: "login",
                            type: "password",
                          })
                        }
                      />
                    ) : (
                      <img
                        src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg"
                        alt=""
                        onClick={() =>
                          setShowPassword({
                            isVisible: true,
                            id: "loginPass",
                            elem: "login",
                            type: "text",
                          })
                        }
                      />
                    )}
                  </a>
                </div>
              </div>
              <div>
                <a
                  className="Forgot-btn"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#FORGOT"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <div>
              <LinkButton
                className={`signin-btn ${isLoading ? "loading-button" : ""}`}
                title="Login"
                isLoading={isLoading}
                isDisable={isLoading}
                onClick={onSubmit}
              />
            </div>
            <div className="modal-footer-btn">
              <p className="Account-btn">
                Don't Have an Account?{" "}
                <span
                  className="sign-brdr"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#SIGNup"
                >
                  Register
                </span>
              </p>
              <button
                type="button"
                className="Account-btn skip"
                data-bs-dismiss="modal"
              >
                Skip for now
                <img
                  src="assets/img/Home-Page/homeFinal/Path 66.svg"
                  className="right-ic"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- SIGN-UP Modal --> */}
      <div
        className="modal fade"
        id="SIGNup"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signup">
          <div className="modal-content signup">
            <div>
              <button
                type="button"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="row m-0">
              <div className="col-lg-6 p-0">
                <div className="signup-bg">
                  <img
                    src="assets/img/Home-Page/Asset 8@3x.png"
                    className="signup-logo"
                    alt=""
                  />
                </div>
              </div>
              <div className="col-lg-6 p-0">
                <div className="background-black">
                  <div className="main-sing-up">
                    <div className="modal-header-flex">
                      <h1 className="sign-title wiht">REGISTER</h1>
                      <p className="Your-Email wiht">
                        Register with your Google account
                      </p>
                    </div>
                    <div className="socil-flex">
                      <img
                        src="assets/img/Home-Page/google-plus.svg"
                        alt=""
                        className="google-ic"
                        onClick={() => handleLoginWithGoogle()}
                      />
                      {/* <img src="assets/img/Sign-up/facebook (2).svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })} /> */}
                    </div>
                    <div className="signup-grid">
                      <div>
                        <p className="or-log withr">
                          Or register using you email address
                        </p>
                        <input
                          type="email"
                          id="emailRegister"
                          value={emailReg}
                          onChange={(e) => {
                            setEmailReg(e.target.value);
                            updateValidation("email");
                          }}
                          placeholder="Email"
                          className="sign-in-input wigt"
                        />
                      </div>
                      <div className="input-position">
                        <input
                          type="password"
                          id="passwordRegister"
                          value={passwordReg}
                          onChange={(e) => {
                            setPasswordReg(e.target.value);
                            setRegError("");
                            updateValidation("password");
                          }}
                          placeholder="Password"
                          className="sign-in-input wigt"
                          minLength={6}
                          maxLength={16}
                        />
                        <a className="show-ic wer">
                          {showRegPassword ? (
                            <img
                              src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg"
                              alt=""
                              onClick={() =>
                                setShowPassword({
                                  isVisible: false,
                                  id: "passwordRegister",
                                  elem: "register",
                                  type: "password",
                                })
                              }
                            />
                          ) : (
                            <img
                              src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg"
                              alt=""
                              onClick={() =>
                                setShowPassword({
                                  isVisible: true,
                                  id: "passwordRegister",
                                  elem: "register",
                                  type: "text",
                                })
                              }
                            />
                          )}
                        </a>
                      </div>
                      <div className="input-position">
                        <input
                          type="password"
                          id="confirmPasswordReg"
                          value={confirmPassReg}
                          onChange={(e) => {
                            setConfirmPassReg(e.target.value);
                            setRegError("");
                            updateValidation("cPassword");
                          }}
                          placeholder="Confirm password"
                          className="sign-in-input wigt"
                          minLength={6}
                          maxLength={16}
                        />
                        <a className="show-ic wer">
                          {showConfirmPassword ? (
                            <img
                              src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg"
                              alt=""
                              onClick={() =>
                                setShowPassword({
                                  isVisible: false,
                                  id: "confirmPasswordReg",
                                  elem: "confirm",
                                  type: "password",
                                })
                              }
                            />
                          ) : (
                            <img
                              src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg"
                              alt=""
                              onClick={() =>
                                setShowPassword({
                                  isVisible: true,
                                  id: "confirmPasswordReg",
                                  elem: "confirm",
                                  type: "text",
                                })
                              }
                            />
                          )}
                        </a>
                      </div>
                    </div>
                    {regError && (
                      <div className="reg-error-msg">{regError}</div>
                    )}
                    <div className="flex-check">
                      <div className="custom-radio-wrap">
                        <form className="line-height-none">
                          <div className="formroup tc-accepted">
                            <input
                              id="TCAccepted"
                              type="checkbox"
                              disabled={verifyProcess}
                              checked={tcAccepted}
                              onChange={() => {
                                setTCAccepted(!tcAccepted);
                                updateValidation("terms");
                              }}
                              required
                            />
                            <label
                              className="custom-radio"
                              htmlFor="TCAccepted"
                            ></label>
                            <span className="label-text"></span>
                          </div>
                        </form>
                      </div>
                      <p className="Your-Email accept-tc qsdcs">
                        Accept Our Term &amp; Conditions
                      </p>
                    </div>
                    <div className="signup-bottom">
                      <LinkButton
                        className={`signin-btn ${
                          regClicked ? "loading-button" : ""
                        }`}
                        onClick={onSubmitSignup}
                        isLoading={regClicked}
                        isDisable={regClicked}
                        title="Register"
                      />
                      {/* <a className="signin-btn" onClick={onSubmitSignup}>
                        Register
                      </a> */}
                      <a
                        id="getOTP"
                        data-bs-dismiss="modal"
                        data-bs-toggle="modal"
                        data-bs-target="#OTP"
                        hidden
                      >
                        Signup
                      </a>
                    </div>
                    <div className="canter-skip">
                      <p className="Account-btn wiht">
                        Already have an Account?{" "}
                        <span
                          className="sign-brdr"
                          data-bs-dismiss="modal"
                          data-bs-toggle="modal"
                          data-bs-target="#SIGNIN"
                        >
                          Log in
                        </span>
                      </p>
                      <button
                        type="button"
                        className="Account-btn skip"
                        data-bs-dismiss="modal"
                      >
                        Skip for now
                        <img
                          src="assets/img/Home-Page/homeFinal/Path 66.svg"
                          className="right-ic"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- OTP Modal --> */}
      <div
        className="modal fade"
        id="OTP"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signin otp">
          <div className="modal-content signin px-50px-canter">
            <div className="">
              <img
                src="assets/img/Home–new/arrow.svg"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#SIGNup"
                className="back-arrow"
                alt=""
              />
              <img
                src="assets/img/Sign-up/secured-letter_hires.png"
                className="msg-img"
                alt=""
              />
            </div>
            <div className="otp-grid">
              <p className="Account-btn bold">
                <span className="HAVE-blockw">
                  WE HAVE SENT YOU AN VERIFICATION{" "}
                </span>
                <span className="HAVE-blockw">CODE TO YOUR E-MAIL ADDRESS</span>
              </p>
              <p className="Your-Email">Enter verification code</p>
            </div>
            <div className="otp-flex">
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 1);
                }}
                id="digit1"
                onKeyDown={keypressed}
                minLength="1"
                maxLength="1"
                required
                autoFocus
              />
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 2);
                }}
                onKeyDown={keypressed}
                id="digit2"
                minLength="1"
                maxLength="1"
                required
              />
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 3);
                }}
                onKeyDown={keypressed}
                id="digit3"
                minLength="1"
                maxLength="1"
                required
              />
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 4);
                }}
                onKeyDown={keypressed}
                id="digit4"
                minLength="1"
                maxLength="1"
                required
              />
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 5);
                }}
                onKeyDown={keypressed}
                id="digit5"
                minLength="1"
                maxLength="1"
                required
              />
              <input
                autoComplete="off"
                type="number"
                className="otp-input"
                onChange={(e) => {
                  SetOtpFunc(e, 6);
                }}
                onKeyDown={keypressed}
                id="digit6"
                minLength="1"
                maxLength="1"
                required
              />
            </div>
            <div>
              <LinkButton
                className={`signin-btn ${regClicked ? "loading-button" : ""}`}
                onClick={verifyAccount}
                isLoading={verifyAccountClicked}
                isDisable={verifyAccountClicked}
                title="Next"
                id="btnSubmitOtp"
              />
            </div>
            <div className="modal-fo">
              <p className="Account-btn">Didn't Receive an email?</p>
              <a className="Account-btn skip" onClick={resendOTP}>
                Resend it
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Forgot Password Modal --> */}
      <div
        className="modal fade"
        id="FORGOT"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signin">
          <div className="modal-content signin">
            <div>
              <button
                type="button"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Forgot Password</h1>
              <p className="Your-Email">
                <span className="botm-brdr">
                  Use your email address for reset ver
                </span>
                ification
              </p>
            </div>
            <div className="top-sign forgot">
              <div className="sign-space-input">
                <input
                  id="userEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="sign-in-input"
                />
                <a
                  id="forgotBtn"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#FORGOT2"
                  hidden
                >
                  Forgot
                </a>
              </div>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn" onClick={onForgotPassword}>
                Submit
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Forgot Password Code Modal --> */}
      <div
        className="modal fade"
        id="FORGOT2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog signin">
          <div className="modal-content signin">
            <div>
              <button
                type="button"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Forgot Password</h1>
              <p className="Your-Email">
                <span className="botm-brdr">
                  Use your verification code sent on email for reset ver
                </span>
                ification
              </p>
            </div>
            <div className="top-sign forgot">
              <div className="sign-space-input">
                <input
                  id="verificationCode"
                  type="number"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code sent on email"
                  className="sign-in-input"
                />
                <input
                  id="newPassword"
                  type="password"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="sign-in-input"
                />
                <a className="show-ic forgot-pwd">
                  {showLoginPassword ? (
                    <img
                      src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg"
                      alt=""
                      onClick={() =>
                        setShowPassword({
                          isVisible: false,
                          id: "newPassword",
                          elem: "login",
                          type: "password",
                        })
                      }
                    />
                  ) : (
                    <img
                      src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg"
                      alt=""
                      onClick={() =>
                        setShowPassword({
                          isVisible: true,
                          id: "newPassword",
                          elem: "login",
                          type: "text",
                        })
                      }
                    />
                  )}
                </a>
              </div>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn" onClick={onSubmitPassword}>
                Submit
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Logout Modal --> */}
      <div
        className="modal fade"
        id="LOGOUT"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog logout">
          <div className="modal-content logout">
            <div>
              <button
                type="button"
                className="x-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Are you sure you want to logout?</h1>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn yes-logout" onClick={logoutSession}>
                Yes
              </a>
              <a className="signin-btn cancel-logout" data-bs-dismiss="modal">
                Cancel
              </a>
            </div>
          </div>
        </div>
      </div>

      <ChoosePlan />
    </div>
  );
}

export default Navbar;
