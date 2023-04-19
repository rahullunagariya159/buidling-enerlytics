import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";
import { Auth, Hub } from "aws-amplify";
import { validateInput } from "../config";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tcAccepted, setTCAccepted] = useState(false);

  const [verifyProcess, setVerifyProcess] = useState(false);
  const [OTP, setOTP] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const attributeList = [];

    let emailElm = document.getElementById("email");
    let firstNameElm = document.getElementById("firstName");
    let lastNameElm = document.getElementById("lastName");
    let phoneElm = document.getElementById("phone");
    let usernameElm = document.getElementById("username");
    let passwordElm = document.getElementById("password");
    let confirmPasswordElm = document.getElementById("confirmPassword");
    let termsCheckElm = document.getElementById("TCAccepted");

    let checkEmail = validateInput(emailElm);
    let checkFN = validateInput(firstNameElm);
    let checkLN = validateInput(lastNameElm);
    let checkPhone = validateInput(phoneElm);
    let checkUN = validateInput(usernameElm);
    let checkPass = validateInput(passwordElm);
    let checkCP = validateInput(confirmPasswordElm);
    let checkTerms = validateInput(termsCheckElm);

    if (checkFN && checkLN && checkPhone && checkUN && checkPass && checkCP) {
      if (!checkTerms) {
        toast.error("Please accept terms and conditions.", {
          toastId: "toast11",
        });
        return false;
      }

      if (!email) {
        toast.error("Please enter all required input values.", {
          toastId: "toast11",
        });
        return false;
      } else if (email && !checkEmail) {
        toast.error("Please enter valid email address.", {
          toastId: "toast11",
        });
        return false;
      }

      if (password.length < 6) {
        toast.error("Please enter atleast 6 digits for password.", {
          toastId: "toast11",
        });
        return false;
      } else if (password !== confirmPassword) {
        toast.error("Confirm password couldn't match.", { toastId: "toast11" });
        return false;
      }

      attributeList.push(
        new CognitoUserAttribute({
          Name: "email",
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: "given_name",
          Value: firstName,
        }),
        new CognitoUserAttribute({
          Name: "family_name",
          Value: lastName,
        }),
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: phone,
        }),
      );
      UserPool.signUp(username, password, attributeList, null, (err, data) => {
        if (err) {
          console.log("____err", err);
          toast.error("User already exists", { toastId: "toast11" });
        } else {
          console.log(data);
          // setVerifyProcess(true);
          // toast.success("Signup successful.");
          setTimeout((window.location.href = "/dashboard"), 2000);
        }
      });
    } else {
      toast.error("Please enter all required input values.", {
        toastId: "toast11",
      });
      return false;
    }
  };

  const verifyAccount = (e) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });
    console.log(user);
    user.confirmRegistration(OTP, true, (err, data) => {
      if (err) {
        console.log(err);
        toast.error("Couldn't verify account.", { toastId: "toast11" });
      } else {
        console.log(data);
        // toast.success("Account verified successfully.");
        window.location.href = "/dashboard";
      }
    });
  };

  const navigateToLogin = () => {
    navigate({
      pathname: "/",
      search: "?login=true",
    });
  };

  return (
    <div className="main-parant-signup">
      <section className="sec-1">
        <div className="container signup">
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
              <div className="background-black signUp">
                <div className="main-sing-up">
                  <div className="modal-header-flex">
                    <h1 className="sign-title wiht">SIGN UP</h1>
                    <p className="Your-Email wiht">
                      Or Use Your Email for Registration
                    </p>
                  </div>
                  <div className="socil-flex">
                    <img
                      src="assets/img/Home-Page/google-plus.svg"
                      alt=""
                      className="google-ic"
                      onClick={() =>
                        Auth.federatedSignIn({
                          provider: CognitoHostedUIIdentityProvider.Google,
                        })
                      }
                    />
                    <img
                      src="assets/img/Home-Page/facebook-white.svg"
                      alt=""
                      className="google-ic"
                      onClick={() =>
                        Auth.federatedSignIn({
                          provider: CognitoHostedUIIdentityProvider.Facebook,
                        })
                      }
                    />
                  </div>
                  <form
                    className="row g-3 needs-validation"
                    onSubmit={(event) => onSubmit(event)}
                    noValidate
                  >
                    <div className="top-sign-up">
                      <div className="signup-flex">
                        <input
                          id="firstName"
                          type="text"
                          disabled={verifyProcess}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="sign-in-input wigt"
                          required
                        />
                        <input
                          id="lastName"
                          type="text"
                          disabled={verifyProcess}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="sign-in-input wigt w-80"
                          required
                        />
                      </div>
                      <div className="signup-flex">
                        <input
                          id="email"
                          type="email"
                          disabled={verifyProcess}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="sign-in-input wigt"
                          required
                        />

                        <PhoneInput
                          id="phone"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={setPhone}
                          maxLength="15"
                          disabled={verifyProcess}
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          className="sign-in-input wigt w-80"
                          required
                        />
                      </div>
                      <div className="signup-flex">
                        <input
                          id="username"
                          type="text"
                          disabled={verifyProcess}
                          value={username.toLowerCase().trim()}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          className="sign-in-input wigt"
                          required
                        />
                      </div>
                      <div className="signup-flex">
                        <input
                          id="password"
                          type="password"
                          disabled={verifyProcess}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="sign-in-input wigt"
                          required
                        />
                        <input
                          id="confirmPassword"
                          type="password"
                          disabled={verifyProcess}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="sign-in-input wigt"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex-check">
                      <div className="form-group tc-accepted">
                        <input
                          id="TCAccepted"
                          type="checkbox"
                          disabled={verifyProcess}
                          checked={tcAccepted}
                          onChange={(e) => setTCAccepted(!tcAccepted)}
                          required
                        />
                        <label htmlFor="TCAccepted"></label>
                      </div>
                      <p className="Your-Email wtre">
                        Accept Our Term & Conditions
                      </p>
                    </div>
                    {verifyProcess == false ? (
                      <div className="signup-bottom">
                        <button className="signup-btn" type="submit">
                          Signup
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="signup-flex otp-field">
                          <input
                            type="text"
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                            placeholder="Enter OTP"
                            className="sign-in-input wigt"
                          />
                        </div>
                        <div className="signup-bottom">
                          <button
                            className="signup-btn"
                            onClick={verifyAccount}
                          >
                            Submit OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="">
                    <p className="Account-btn clr">
                      Already have an Account?{" "}
                      <span className="sign-brdr" onClick={navigateToLogin}>
                        Login
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
