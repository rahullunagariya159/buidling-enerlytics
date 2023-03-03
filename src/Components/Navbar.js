import React, { useContext, useState, useEffect } from 'react';
import { ReactSession } from 'react-client-session';

import { toast } from 'react-toastify';
import { useNavigate, useSearchParams, useLocation  } from "react-router-dom";
import { AccountContext } from './Account';
import { validateInput } from '../config';
import UserPool from '../UserPool';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { logout } = useContext(AccountContext);
  // let isLoggedIn = ReactSession.get("is_logged_in");
  const [isLoggedIn, setLoggedInStatus] = useState(ReactSession.get("is_logged_in"));
  const isGuestUser = searchParams.get('skip') || false;

  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const { authenticate } = useContext(AccountContext);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---- Register ---

  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [confirmPassReg, setConfirmPassReg] = useState('');
  const [TCAccepted, setTCAccepted] = useState('');
  const [verifyProcess, setVerifyProcess] = useState(false);
  const [OTP, setOTP] = useState({});

  const navigateToModule = (module) => {
    if (isGuestUser) {
      navigate({ pathname: '/' + module, search: '?skip=true' });
    } else {
      navigate('/' + module);
    }
  }

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

    setTimeout(window.location.href = '/', 2000);
  }

  const onSubmitSignup = (e) => {
    e.preventDefault();
    const attributeList = [];

    let emailElm = document.getElementById('emailRegister');
    let passwordElm = document.getElementById('passwordRegister');
    let confirmPasswordElm = document.getElementById('confirmPasswordReg');
    let termsCheckElm = document.getElementById('TCAccepted');

    let checkEmail = validateInput(emailElm);
    let checkPass = validateInput(passwordElm);
    let checkCP = validateInput(confirmPasswordElm);
    let checkTerms = validateInput(termsCheckElm);

    if (checkPass && checkCP) {

      if (!checkTerms) {
        toast.error("Please accept terms and conditions.", { toastId: 'toast11' });
        return false;
      }

      if (!emailReg) {
        toast.error("Please enter all required input values.", { toastId: 'toast11' });
        return false;
      } else if (emailReg && !checkEmail) {
        toast.error("Please enter valid email address.", { toastId: 'toast11' });
        return false;
      }

      if (passwordReg.length < 6) {
        toast.error("Please enter atleast 6 digits for password.", { toastId: 'toast11' });
        return false;
      } else if (passwordReg !== confirmPassReg) {
        toast.error("Comfirm password couldn't match.", { toastId: 'toast11' });
        return false;
      }

      userSignUp()
        .then((data) => {
          console.log('success', data);
          setVerifyProcess(true);
          toast.success("OTP sent to your provided email id.");
          document.getElementById('getOTP').click();
        })
        .catch((e) => {
          if (e === 'UsernameExistsException') {
            console.log(e);
            // toast.error("Please enter OTP sent to your registered email id to confirm your account.");
            toast.success("OTP sent to your provided email id.");
            document.getElementById('getOTP').click();
          } else {
            toast.error(e);
          }
        })
    } else {
      toast.error("Please enter all required input values.", { toastId: 'toast11' });
      return false;
    }
  };

  const resendOTP = () => {
    userSignUp()
      .then((data) => {
        console.log('success', data);
        setVerifyProcess(true);
        toast.success("OTP sent to your provided email id.");
      })
      .catch((e) => {
        if (e === 'UsernameExistsException') {
          // console.log(e);
          // toast.error("Please enter OTP sent to your registered email id to confirm your account.");
          // document.getElementById('getOTP').click();
          toast.success("OTP sent to your provided email id.");
        } else {
          toast.error(e);
        }
      })
  }

  const userSignUp = () => {
    return new Promise((resolve, reject) => {

      UserPool.signUp(emailReg, passwordReg, [], null, (error, result) => {
        console.log(error, result)
        if (error) {
          // TODO this code shouldn't know about graphql errors. refactor to use separate layers
          if (error.code === 'UsernameExistsException') {
            reject(error.code)
          } else {
            reject(error)
          }
          return
        }
        resolve(result)
      })
    })
  }

  const SetOtpFunc = (e, index) => {
    let digit = e.target.value;
    let currentElm = e.srcElement || e.target;
    let nextElm = currentElm.nextElementSibling;

    switch (index) {
      case 1:
        setOTP({ ...OTP, 'd1': digit })
        break;
      case 2:
        setOTP({ ...OTP, 'd2': digit })
        break;
      case 3:
        setOTP({ ...OTP, 'd3': digit })
        break;
      case 4:
        setOTP({ ...OTP, 'd4': digit })
        break;
      case 5:
        setOTP({ ...OTP, 'd5': digit })
        break;
      case 6:
        setOTP({ ...OTP, 'd6': digit })
        break;
      default:
        break;

    };

    if (nextElm && digit) {
      nextElm.focus();
    }
  }

  const validateOTP = () => {
    const errorOTP = [];
    const otpElm = ["digit1", "digit2", "digit3", "digit4", "digit5", "digit6"];
    otpElm.forEach(element => {
      let otpDigitElm = document.getElementById(element);
      let checkOTPDigit = validateInput(otpDigitElm);
      if (!checkOTPDigit) {
        errorOTP.push(element);
      }
    });
    return !(errorOTP.length);
  }

  const verifyAccount = (e) => {
    e.preventDefault();

    const checkOTP = validateOTP();
    if (checkOTP) {
      const otpVal = OTP.d1 + OTP.d2 + OTP.d3 + OTP.d4 + OTP.d5 + OTP.d6;

      const user = new CognitoUser({
        Username: emailReg,
        Pool: UserPool,
      });

      user.confirmRegistration(otpVal, true, (err, data) => {
        if (err) {
          console.log(err);
          toast.error("Couldn't verify your account, please enter a valid OTP.", { toastId: 'toast11' });
        } else {
          console.log(data);
          ReactSession.set("is_logged_in", 'true');
          ReactSession.set('building_user', emailReg);
          toast.success("Account verified successfully.");
          setTimeout(window.location.href = '/dashboard', 2000);

        }
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let usernameElm = document.getElementById('username');
    let passwordElm = document.getElementById('loginPass');

    let checkUN = validateInput(usernameElm);
    let checkPass = validateInput(passwordElm);

    if (checkPass) {

      if (!username) {
        toast.error("Please enter all required input values.", { toastId: 'toast11' });
        return false;
      } else if (username && !checkUN) {
        toast.error("Please enter a valid email address.", { toastId: 'toast11' });
        return false;
      }

      authenticate(username, password)
        .then((data) => {
          console.log(data);
          toast.success("login success.");
          ReactSession.set('building_user', username);
          ReactSession.set("is_logged_in", 'true');
          setTimeout(window.location.href = '/dashboard', 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Incorrect email or password.", { toastId: 'toast11' });
        });
    } else {
      toast.error("Please enter all required input values.", { toastId: 'toast11' });
      return false;
    }
  };

  const onForgotPassword = () => {
    let userEmailElm = document.getElementById('userEmail');
    let checkUE = validateInput(userEmailElm);

    if (checkUE) {
      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      user.forgotPassword({
        onSuccess: function (data) {
          // successfully initiated reset password request
          console.log('CodeDeliveryData from forgotPassword: ' + data);
        },
        onFailure: function (err) {
          toast.error(err.message || JSON.stringify(err));
        },
        //Optional automatic callback
        inputVerificationCode: function (data) {
          toast.success('Code sent to: ' + data.CodeDeliveryDetails.Destination);
          console.log(JSON.stringify(data));

          document.getElementById('forgotBtn').click();
        },
      });
    } else {
      toast.error("Enter valid email address to reset password!", { toastId: 'toast11' });
    }
  }

  const onSubmitPassword = () => {
    var code = document.getElementById('verificationCode');
    var newPassword = document.getElementById('newPassword');

    let checkCode = validateInput(code);
    let checkNP = validateInput(newPassword);

    if (checkCode && checkNP) {

      if (newPassword.value.length < 6) {
        toast.error("Please enter atleast 6 digits for password.", { toastId: 'toast11' });
        return false;
      }

      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      user.confirmPassword(code.value, newPassword.value, {
        onSuccess() {
          toast.success('Password reset successfully.');
          setTimeout(window.location.href = '/', 2000);
        },
        onFailure(err) {
          console.log(err);
          toast.error("Password couldn't be updated, please check your verification code.", { toastId: 'toast11' });
        },
      });
    }
  }

  const toggleDropdown = () => {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  const setShowPassword = (elmData) => {
    if (elmData.elem === 'login') {
      setShowLoginPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    } else if (elmData.elem === 'register') {
      setShowRegPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    } else if (elmData.elem === 'confirm') {
      setShowConfirmPassword(elmData.isVisible);
      document.getElementById(elmData.id).type = elmData.type;
    }
  }

  useEffect(() => {
    ReactSession.set('guest_state', location.pathname);

    if (ReactSession.get('amplify-signin-with-hostedUI') == 'true'
      || ReactSession.get('amplify-redirected-from-hosted-ui') == 'true') {
      ReactSession.set("is_logged_in", 'true');
      setLoggedInStatus('true');
    }

    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log('SETTING USER DATA => ', data);
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
          console.log('__state', data);
      }
    });

    Auth.currentSession()
      .then(data => {
        let idToken = data.getIdToken();
        // console.dir(idToken);
        let email = idToken.payload.email;
        let name = idToken.payload.name;
        // console.log('__email_', email);
        // console.log('__name_', name);
        ReactSession.set('building_social_user', email);
        ReactSession.set("is_logged_in", 'true');
      })
      .catch(err => console.log(err));

    Auth.currentAuthenticatedUser()
      .then(currentUser => {
        setUser(currentUser);
        // console.log('___user', currentUser);
      })
      .catch(() => console.log("Not signed in"));

    setLoggedInStatus(ReactSession.get("is_logged_in"));

    return unsubscribe;
  }, []);

  return (
    <div className="main-nav">
      <div className="brdr-bottom full">
        <header className="header bg-img">
          <nav className="navbar">
            <a className="logo-link" onClick={() => navigate('/')}><img src="assets/img/Home-Page/Asset 8@3x@2x.png" alt="" /></a>
            <input type="checkbox" id="nav" className="hidden" />
            <label htmlFor="nav" className="nav-toggle">
              <span></span>
              <span></span>
              <span></span>
            </label>
            <div className="wrapper">
              <ul className="menu m-0 p-0">
                <li className="menu-item"><a className="link-itme" onClick={() => navigate('/')}>Home</a></li>
                <li className="menu-item"><a id="dashboard-link" className="link-itme reg-mark-icon active" onClick={() => navigateToModule('dashboard')}>BE Modeler <sup>
                  <img src="" className="rr" alt="" /></sup></a></li>
                <li className="menu-item"><a id="contact-link" className="link-itme" onClick={() => navigateToModule('contact-us')}>Pricing</a></li>
                <li className="menu-item"><a id="price-link" className="link-itme" onClick={() => navigateToModule('pricing')}>Contact us</a></li>
                <li className="menu-item"><a id="about-link" className="link-itme" onClick={() => navigateToModule('about-us')}>About us</a></li>
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
                  <img src="assets/img/Home–new/NoPath@2x.png" className="profil lang" alt="" />
                  English
                  <img src="assets/img/Home–new/gry-arrow.svg" alt="" />
                </button>
                <div id="myDropdown" className="dropdown-content">
                  <a className='active'><img src="assets/img/Home–new/NoPath@2x.png" className="profil lang" alt="" /> English <span className="selected-lang"></span></a>
                  <a><img src="assets/img/Home–new/german.png" className="profil lang" alt="" /> German</a>
                </div>
              </div>

              {isLoggedIn == 'true' && isGuestUser == false ? (
                <div className="login-btn">
                  <a className="Register-done clickable" data-bs-toggle="modal" data-bs-target="#LOGOUT" data-bs-keyboard="false" data-bs-backdrop="static" >
                    <img src="assets/img/Home-Page/profile.png" className="profil" alt="" />
                    500 Credits
                    <img src="assets/img/Home–new/wihte-drop.svg" alt="" />
                  </a>
                </div>
              ) : (
                <div className="login-btn">
                  <a className="Login" data-bs-toggle="modal" data-bs-target="#SIGNIN">Log in</a>
                  <a className="Register" data-bs-toggle="modal" data-bs-target="#SIGNup">Register</a>
                </div>
              )
              }

            </div>
          </nav>
        </header>
      </div>

      {/* <!-- data-bs-toggle="modal" data-bs-target="#PROMOCODE" --> */}

      {/* <!-- SIGN-IN Modal --> */}
      <div className="modal fade" id="SIGNIN" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog signin">
          <div className="modal-content signin">
          <div>
              <button type="button" className="x-btn" data-bs-dismiss="modal" aria-label="Close">x</button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Login</h1>
              <p className="Your-Email"><span className="botm-brdr">Log in with your Goo</span>gle account</p>
            </div>
            <div className="socil-flex">
              <img src="assets/img/Home-Page/google-plusb.svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })} />
              {/* <img src="assets/img/Sign-up/facebook.svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })} /> */}
            </div>
            <div className="top-sign">
              <div className="sign-space-input">
                <div>
                  <p className="or-log">Or log in using you email address</p>
                  <input id="username" type="email" placeholder="Email" className="sign-in-input" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-position">
                  <input id="loginPass" type="password" placeholder="Password" className="sign-in-input" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} maxLength={16} />
                  <a className="show-ic">
                    {showLoginPassword ? (
                      <img src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': false, 'id': 'loginPass', 'elem': 'login', 'type': 'password' })} />
                    ) : (
                      <img src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': true, 'id': 'loginPass', 'elem': 'login', 'type': 'text' })} />
                    )}
                  </a>
                </div>
              </div>
              <div>
                <a className="Forgot-btn" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#FORGOT">Forgot Password?</a>
              </div>
            </div>
            <div>
              <a className="signin-btn" onClick={onSubmit}>Login</a>
            </div>
            <div className="modal-footer-btn">
              <p className="Account-btn">Don't Have an Account? <span className="sign-brdr" data-bs-dismiss="modal"
                data-bs-toggle="modal" data-bs-target="#SIGNup">Register</span></p>
              {/* <a className="Account-btn skip" data-bs-dismiss="modal" onClick={handleCreateProjectForGuest}>Skip for now <img
                src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" /></a> */}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- SIGN-UP Modal --> */}
      <div className="modal fade" id="SIGNup" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog signup">
          <div className="modal-content signup">
          <div>
              <button type="button" className="x-btn" data-bs-dismiss="modal" aria-label="Close">x</button>
            </div>
            <div className="row m-0">
              <div className="col-lg-6 p-0">
                <div className="signup-bg">
                  <img src="assets/img/Home-Page/Asset 8@3x.png" className="signup-logo" alt="" />
                </div>
              </div>
              <div className="col-lg-6 p-0">
                <div className="background-black">
                  <div className="main-sing-up">
                    <div className="modal-header-flex">
                      <h1 className="sign-title wiht">REGISTER</h1>
                      <p className="Your-Email wiht">Register with your Google account</p>
                    </div>
                    <div className="socil-flex">
                      <img src="assets/img/Home-Page/google-plus.svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })} />
                      {/* <img src="assets/img/Sign-up/facebook (2).svg" alt="" className="google-ic" onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook })} /> */}
                    </div>
                    <div className="signup-grid">
                      <div>
                        <p className="or-log withr">Or register using you email address</p>
                        <input type="email" id="emailRegister" value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder="Email" className="sign-in-input wigt" />
                      </div>
                      <div className="input-position">
                        <input type="password" id="passwordRegister" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} placeholder="Password" className="sign-in-input wigt" minLength={6} maxLength={16} />
                        <a className="show-ic wer">
                          {showRegPassword ? (
                            <img src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': false, 'id': 'passwordRegister', 'elem': 'register', 'type': 'password' })} />
                          ) : (
                            <img src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': true, 'id': 'passwordRegister', 'elem': 'register', 'type': 'text' })} />
                          )}
                        </a>
                      </div>
                      <div className="input-position">
                        <input type="password" id="confirmPasswordReg" value={confirmPassReg} onChange={(e) => setConfirmPassReg(e.target.value)} placeholder="Confirm password" className="sign-in-input wigt" minLength={6} maxLength={16} />
                        <a className="show-ic wer">
                          {showConfirmPassword ? (
                            <img src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': false, 'id': 'confirmPasswordReg', 'elem': 'confirm', 'type': 'password' })} />
                          ) : (
                            <img src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': true, 'id': 'confirmPasswordReg', 'elem': 'confirm', 'type': 'text' })} />
                          )}
                        </a>
                      </div>
                    </div>
                    <div className="flex-check">
                      <div className="custom-radio-wrap">
                        <form>
                          <div className="formroup tc-accepted">
                            <input id="TCAccepted" type="radio" name="custom-radio-btn" value={TCAccepted} onChange={(e) => setTCAccepted(e.target.value)} required />
                            <label className="custom-radio" htmlFor="TCAccepted"></label>
                            <span className="label-text"></span>
                          </div>

                        </form>
                      </div>
                      <p className="Your-Email accept-tc qsdcs">Accept Our Term &amp; Conditions</p>
                    </div>
                    <div className="signup-bottom">
                      <a className="signin-btn" onClick={onSubmitSignup}>Register</a>
                      <a id="getOTP" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#OTP" hidden>Signup</a>
                    </div>
                    <div className="canter-skip">
                      <p className="Account-btn wiht">Already have an Account? <span className="sign-brdr"
                        data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#SIGNIN">Log in</span></p>
                      {/* <p className="Account-btn clr pt-3" onClick={handleCreateProjectForGuest}>Skip for now <img
                        src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" />
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- OTP Modal --> */}
      <div className="modal fade" id="OTP" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog signin otp">
          <div className="modal-content signin px-50px-canter">
            <div className="">
              <img src="assets/img/Home–new/arrow.svg" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#SIGNup" className="back-arrow" alt="" />
              <img src="assets/img/Sign-up/secured-letter_hires.png" className="msg-img" alt="" />
            </div>
            <div className="otp-grid">
              <p className="Account-btn bold">
                <span className="HAVE-blockw">WE HAVE SENT YOU AN VERIFICATION </span>
                <span className="HAVE-blockw">CODE TO YOUR E-MAIL ADDRESS</span>
              </p>
              <p className="Your-Email">Enter verification code</p>
            </div>
            <div className="otp-flex">
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 1) }} id="digit1" minLength="1" maxLength="1" required autoFocus />
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 2) }} id="digit2" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 3) }} id="digit3" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 4) }} id="digit4" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 5) }} id="digit5" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="text" className="otp-input" onChange={(e) => { SetOtpFunc(e, 6) }} id="digit6" minLength="1" maxLength="1" required />
            </div>
            <div>
              <a className="signin-btn" onClick={verifyAccount}>Next</a>
            </div>
            <div className="modal-fo">
              <p className="Account-btn">Didn't Receive an email?</p>
              <a className="Account-btn skip" onClick={resendOTP}>Resend it</a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Forgot Password Modal --> */}
      <div className="modal fade" id="FORGOT" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog signin">
          <div className="modal-content signin">
            <div>
              <button type="button" className="x-btn" data-bs-dismiss="modal" aria-label="Close">x</button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Forgot Password</h1>
              <p className="Your-Email"><span className="botm-brdr">Use your email address for reset ver</span>ification</p>
            </div>
            <div className="top-sign forgot">
              <div className="sign-space-input">
                <input id="userEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="sign-in-input" />
                <a id="forgotBtn" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#FORGOT2" hidden>Forgot</a>
              </div>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn" onClick={onForgotPassword}>Submit</a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Forgot Password Code Modal --> */}
      <div className="modal fade" id="FORGOT2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog signin">
          <div className="modal-content signin">
            {/* <div>
              <button type="button" className="x-btn" data-bs-dismiss="modal" aria-label="Close">x</button>
            </div> */}
            <div className="modal-header-flex">
              <h1 className="sign-title">Forgot Password</h1>
              <p className="Your-Email"><span className="botm-brdr">Use your verification code sent on email for reset ver</span>ification</p>
            </div>
            <div className="top-sign forgot">
              <div className="sign-space-input">
                <input id="verificationCode" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter verification code sent on email" className="sign-in-input" />
                <input id="newPassword" type="password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="sign-in-input" />
              </div>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn" onClick={onSubmitPassword}>Submit</a>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Logout Modal --> */}
      <div className="modal fade" id="LOGOUT" tabIndex="-1" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog logout">
          <div className="modal-content logout">
            <div>
              <button type="button" className="x-btn" data-bs-dismiss="modal" aria-label="Close">x</button>
            </div>
            <div className="modal-header-flex">
              <h1 className="sign-title">Are you sure you want to logout?</h1>
            </div>
            <div>
              {/* data-bs-dismiss="modal"  */}
              <a className="signin-btn yes-logout" onClick={logoutSession}>Yes</a>
              <a className="signin-btn cancel-logout" data-bs-dismiss="modal">Cancel</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Navbar;
