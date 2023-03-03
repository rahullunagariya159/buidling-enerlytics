import React, { useContext, useState, useEffect } from 'react';
import { ReactSession } from 'react-client-session';

import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from "react-router-dom";
import { createProject } from './Services/UserService';
import { AccountContext } from './Account';
import { validateInput } from '../config';
import UserPool from '../UserPool';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoggedIn, setLoggedInStatus] = useState(ReactSession.get("is_logged_in"));
  const isGuestUser = searchParams.get('skip') || false;
  const { logout } = useContext(AccountContext);

  const [clicked, setClicked] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const [regClicked, setRegClicked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [isValidEmailReg, setIsValidEmailReg] = useState(true);
  const [isValidPassReg, setIsValidPassReg] = useState(true);
  const [isValidConfirmPass, setIsValidConfirmPass] = useState(true);

  const { authenticate } = useContext(AccountContext);

  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

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

  const skipLogin = () => {
    // toast.error("You have been redirected to create project. Please register to have access to all the features.");
    setTimeout(navigate({ pathname: '/dashboard', search: '?skip=true' }), 3000);
  }

  const navigateToDashboard = () => {
    if (isLoggedIn == 'true') {
      navigate('/dashboard');
    } else {
      navigate({ pathname: '/dashboard', search: '?skip=true' });
    }
  }

  const handleCreateProjectForGuest = (clickedStatus) => {
    if (clickedStatus) {
      setClicked(true);
    } else {
      setSkipClicked(true);
    }

    let guestUserId = `${Math.floor(Date.now() / 1000)}`;

    ReactSession.set("guest_user_id", guestUserId);
    ReactSession.set("bp3dJson", null);
    const guestProjectName = 'project' + (new Date()).getTime();
    const payload = {
      "name": guestProjectName,
      "userId": guestUserId
    };
    createProject(payload)
      .then(response => {
        if (response.error) {
          toast.error(response.error);
        } else {
          if (response && response.msg) {
            ReactSession.set("project_id", response.msg[0].id);
            if (isLoggedIn == 'true') {
              setTimeout(window.location.href = '/create-project?name=' + guestProjectName, 2000);
            } else {
              setTimeout(window.location.href = '/create-project?name=' + guestProjectName + '&&skip=true', 2000);
            }
          }
        }
      });
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

    setTimeout(window.location.reload(), 2000);
  }

  function checkPassword(str) {
    // var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    console.log('__IS_VALID', re.test(str));
    return re.test(str);
  }

  useEffect(() => {
    console.log(emailReg);
    if (!isValidEmailReg) {
      let emailElm = document.getElementById('emailRegister');
      emailElm.classList.remove("error");
    }
  }, [emailReg]);

  useEffect(() => {
    if (!isValidPassReg) {
      let passwordElm = document.getElementById('passwordRegister');
      passwordElm.classList.remove("error");
    }
  }, [passwordReg]);

  useEffect(() => {
    if (!isValidConfirmPass) {
      let confirmPasswordElm = document.getElementById('confirmPasswordReg');
      confirmPasswordElm.classList.remove("error");
    }
  }, [confirmPassReg]);

  const onSubmitSignup = (e) => {
    e.preventDefault();
    setRegClicked(true);

    let emailElm = document.getElementById('emailRegister');
    let passwordElm = document.getElementById('passwordRegister');
    let confirmPasswordElm = document.getElementById('confirmPasswordReg');
    let termsCheckElm = document.getElementById('TCAccepted');

    passwordElm.classList.remove("error");
    confirmPasswordElm.classList.remove("error");

    let checkEmail = validateInput(emailElm);
    let checkPass = validateInput(passwordElm);
    let checkCP = validateInput(confirmPasswordElm);
    let checkTerms = validateInput(termsCheckElm);

    setIsValidEmailReg(checkEmail);
    setIsValidPassReg(checkPass);
    setIsValidConfirmPass(checkCP);

    if (checkPass && checkCP) {

      if (!checkTerms) {
        setRegClicked(false);
        toast.error("Please accept terms and conditions.", { toastId: 'toast11' });
        return false;
      }

      if (!emailReg) {
        setRegClicked(false);
        toast.error("Please enter all required input values.", { toastId: 'toast11' });
        return false;
      } else if (emailReg && !checkEmail) {
        setRegClicked(false);
        toast.error("Please enter valid email address.", { toastId: 'toast11' });
        return false;
      }

      if (!checkPassword(passwordReg)) {
        setRegClicked(false);
        toast.error("Please enter a valid password.", { toastId: 'toast11' });
        passwordElm.classList.add("error");
        confirmPasswordElm.classList.add("error");
        return false;
      } else if (passwordReg !== confirmPassReg) {
        setRegClicked(false);
        toast.error("Comfirm password couldn't match.", { toastId: 'toast11' });
        return false;
      }

      userSignUp()
        .then((data) => {
          setRegClicked(false);
          console.log('success', data);
          setVerifyProcess(true);
          toast.success("OTP sent to your provided email id.", { toastId: 'toast12' });
          document.getElementById('getOTP').click();
        })
        .catch((e) => {
          setRegClicked(false);
          if (e === 'UsernameExistsException') {
            console.log(e);
            // toast.error("Please enter OTP sent to your registered email id to confirm your account.");
            toast.success("OTP sent to your provided email id.", { toastId: 'toast12' });
            document.getElementById('getOTP').click();
          } else if (e === 'InvalidPasswordException') {
            passwordElm.classList.add("error");
            toast.error("Please enter a valid password.", { toastId: 'toast11' });
          } else {
            toast.error(e);
          }
        })
    } else {
      toast.error("Please enter all required input values.", { toastId: 'toast11' });
      setRegClicked(false);
      return false;
    }
  };

  const resendOTP = () => {
    userSignUp()
      .then((data) => {
        console.log('success', data);
        setVerifyProcess(true);
        toast.success("OTP sent to your provided email id.", { toastId: 'toast12' });
      })
      .catch((e) => {
        if (e === 'UsernameExistsException') {
          // console.log(e);
          // toast.error("Please enter OTP sent to your registered email id to confirm your account.");
          // document.getElementById('getOTP').click();
          toast.success("OTP sent to your provided email id.", { toastId: 'toast12' });
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
          console.log('error____', error);
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

  const keypressed = (e) => {

    if (e.keyCode === 8) {
      let currentElm = e.srcElement || e.target;
      let prevElm = currentElm.previousElementSibling;
      if (prevElm) {
        currentElm.value = '';
        prevElm.focus();
      }
    }
  }

  const SetOtpFunc = (e, index) => {
    let digit = e.target.value;
    let currentElm = e.srcElement || e.target;
    let nextElm = currentElm.nextElementSibling;

    if (digit.length > 1) {
      let newDigit = digit.slice(0, 1);
      currentElm.value = newDigit;
      digit = newDigit
    }

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
      setNextButtonClicked(true);
      const otpVal = OTP.d1 + OTP.d2 + OTP.d3 + OTP.d4 + OTP.d5 + OTP.d6;

      const user = new CognitoUser({
        Username: emailReg,
        Pool: UserPool,
      });

      user.confirmRegistration(otpVal, true, (err, data) => {
        if (err) {
          console.log(err);
          setNextButtonClicked(false);
          toast.error("Couldn't verify your account, please enter a valid OTP.", { toastId: 'toast11' });
        } else {
          console.log(data);

          ReactSession.set("building_user", emailReg);
          ReactSession.set("is_logged_in", 'true');
          ReactSession.set("user_email_registered", 'true');

          setNextButtonClicked(false);
          toast.success("Account verified successfully.", { toastId: 'toast12' });
          setTimeout(window.location.href = '/dashboard', 2000);

        }
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoginClicked(true);

    let usernameElm = document.getElementById('username');
    let passwordElm = document.getElementById('loginPass');

    let checkUN = validateInput(usernameElm);
    let checkPass = validateInput(passwordElm);

    if (checkPass) {

      if (!username) {
        toast.error("Please enter all required input values.", { toastId: 'toast11' });
        setLoginClicked(false);
        return false;
      } else if (username && !checkUN) {
        toast.error("Please enter a valid email address.", { toastId: 'toast11' });
        setLoginClicked(false);
        return false;
      }

      authenticate(username, password)
        .then((data) => {
          console.log(data);
          setLoginClicked(false);

          ReactSession.set("building_user", username);
          ReactSession.set("is_logged_in", 'true');

          toast.success("login success.", { toastId: 'toast12' });
          setTimeout(window.location.href = '/dashboard', 2000);
        })
        .catch((err) => {
          console.log(err);
          setLoginClicked(false);
          toast.error("Incorrect email or password.", { toastId: 'toast11' });
        });
    } else {
      toast.error("Please enter all required input values.", { toastId: 'toast11' });
      setLoginClicked(false);
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
          toast.success('Password reset successfully.', { toastId: 'toast12' });
          setTimeout(window.location.href = '/', 2000);
        },
        onFailure(err) {
          console.log(err);
          toast.error("Password couldn't be updated, please check your verification code.", { toastId: 'toast11' });
        },
      });
    }
  }

  const getUser = () => {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  const scrollToElm = (elm) => {
    let myElement = document.getElementById(elm);
    myElement.scrollIntoView();
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

  const handlePlanClick = (plan) => {
    switch (plan) {
      case 'fFloor':
        document.getElementById(plan).classList.add('active');
        document.getElementById('sFloor').classList.remove('active');
        document.getElementById('basePlan').classList.remove('active');
        break;
      case 'sFloor':
        document.getElementById(plan).classList.add('active');
        document.getElementById('fFloor').classList.remove('active');
        document.getElementById('basePlan').classList.remove('active');
        break;
      default:
        document.getElementById(plan).classList.add('active');
        document.getElementById('sFloor').classList.remove('active');
        document.getElementById('fFloor').classList.remove('active');
    }
  }

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });
  }, []);

  return (
    <div>

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
                  <li className="menu-item"><a className="link-itme active" onClick={() => navigate('/')}>Home</a></li>
                  <li className="menu-item"><a className="link-itme reg-mark-icon" onClick={navigateToDashboard}>BE Modeler <sup>
                    <img src="" className="rr" alt="" /></sup></a></li>
                  <li className="menu-item"><a className="link-itme" onClick={() => scrollToElm("main-parant-5")}>Pricing</a></li>
                  <li className="menu-item"><a className="link-itme" onClick={() => scrollToElm("main-parant-6")}>Contact us</a></li>
                  <li className="menu-item"><a className="link-itme" onClick={() => scrollToElm("main-parant-5")}>About us</a></li>
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
                    <a className="Register-done" data-bs-toggle="modal" data-bs-target="#LOGOUT" data-backdrop="static" data-keyboard="false">
                      <img src="assets/img/Home-Page/profile.png" className="profil" alt="" />
                      500 Credits
                      <img src="assets/img/Home–new/wihte-drop.svg" alt="" />
                    </a>
                  </div>
                ) : (
                  <div className="login-btn">
                    <a href="" className="Login" data-bs-toggle="modal" data-bs-target="#SIGNIN">Log in</a>
                    <a href="" className="Register" data-bs-toggle="modal" data-bs-target="#SIGNup">Register</a>
                  </div>
                )
                }

              </div>
            </nav>
          </header>
        </div>
      </div>

      <div id="main-parant-1" className="main-parant-1">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="main-grid">
                  <div className="small-grid">
                    <h1 className="head-title bordr">
                      <span className="head-block">MAKE FIRST 3D MODEL </span>
                      <span className="head-block">OF YOUR HOUSE</span>
                    </h1>
                    <p className="small-title">
                      <span className="head-block">OUR EASY TO USE TOOL CAN CALCULATE YOUR DAILY/MONTHLY
                        CONSUMPTION </span>
                      <span className="head-block">OF ENERGY AND PROVIDE YOU BETTER CALCUATIONS/RESULT BASED
                        ON DATA YOU PROVIDE.</span>
                    </p>
                  </div>
                  <div>
                    {isLoggedIn == 'true' && !clicked &&
                      (
                        <a className="head-btn clickable" onClick={() => handleCreateProjectForGuest(true)}>CREATE A PROJECT</a>
                      )
                    }
                    {(!isLoggedIn || isLoggedIn == 'false') && !clicked &&
                      (
                        <a className="head-btn clickable" onClick={() => handleCreateProjectForGuest(true)}>TRY FOR FREE</a>
                      )
                    }
                    {isLoggedIn == 'true' && clicked &&
                      (
                        <a className="head-btn loading-button"><i class="fa fa-spinner fa-spin"></i> CREATE A PROJECT</a>
                      )
                    }
                    {(!isLoggedIn || isLoggedIn == 'false') && clicked &&
                      (
                        <a className="head-btn loading-button"><i class="fa fa-spinner fa-spin"></i> TRY FOR FREE</a>
                      )
                    }
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="swiper-sider">
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                  className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                  aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                  aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
                  aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4"
                  aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="assets/img/Home-Page/ForSlider1.png" className="d-block head-img" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="assets/img/Home-Page/ForSlider1.png" className="d-block head-img" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="assets/img/Home-Page/ForSlider1.png" className="d-block head-img" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="assets/img/Home-Page/ForSlider1.png" className="d-block head-img" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="assets/img/Home-Page/ForSlider1.png" className="d-block head-img" alt="..." />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-2" className="main-parant-2">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="sec-">
                  <div>
                    <p className="top-smaal-title bordr">PROFESSIONAL. INOVATIVE. RELIABLE.</p>
                    <h1 className="sec-title">
                      <span className="src-block">GET GRAPHICAL REPRESENTATION </span>
                      <span className="src-block">AS A RESULT</span>
                    </h1>
                  </div>
                  <div className="spacing-sec">
                    <p className="sec-small-title">
                      <span className="src-block">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the </span>
                      <span className="src-block">industry's standard dummy text ever since the 1500s, when an
                        unknown printer took a galley of type and </span>
                      <span className="src-block">scrambled it to make a type specimen book.</span>
                    </p>
                  </div>
                  <div>
                    <a href="" className="Read-More">Read More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-3" className="main-parant-3">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="card-box">
                  <div className="first-card">
                    <div>
                      <h6 className="STEPS-TO">STEPS TO SUCCESS</h6>
                    </div>
                    <div className="card-DESIGN">
                      <h1 className="card-title"><span className="color-chnge">DESIGN</span> FUTURE WITH EXCELENCE
                      </h1>
                    </div>
                    <div className="three-grid">
                      <p className="DESIGN-check"><img src="assets/img/Home-Page/Path 21.svg"
                        className="check-img" alt="" />DESIGN</p>
                      <p className="DESIGN-check"><img src="assets/img/Home-Page/Path 21.svg"
                        className="check-img" alt="" />CALCULATE</p>
                      <p className="DESIGN-check"><img src="assets/img/Home-Page/Path 21.svg"
                        className="check-img" alt="" />RESULT</p>
                    </div>
                  </div>
                  <div className="second-card">
                    <div>
                      <h1 className="card-no">01</h1>
                    </div>
                    <div className="card-grid">
                      <h6 className="card-title">BUILDING MODEL</h6>
                      <p className="small-card-title">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div className="deta-box">
                      <a href="" className="DETAILS-btn">DETAILS</a>
                    </div>
                  </div>
                  <div className="second-card">
                    <div>
                      <h1 className="card-no">02</h1>
                    </div>
                    <div className="card-grid">
                      <h6 className="card-title">BUILDING MATERIALS</h6>
                      <p className="small-card-title">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div className="deta-box">
                      <a href="" className="DETAILS-btn">DETAILS</a>
                    </div>
                  </div>
                  <div className="second-card">
                    <div>
                      <h1 className="card-no">03</h1>
                    </div>
                    <div className="card-grid">
                      <h6 className="card-title">HVAC SYSTEM</h6>
                      <p className="small-card-title">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div className="deta-box">
                      <a href="" className="DETAILS-btn">DETAILS</a>
                    </div>
                  </div>
                  <div className="second-card">
                    <div>
                      <h1 className="card-no">04</h1>
                    </div>
                    <div className="card-grid">
                      <h6 className="card-title">ENERGY GENERATION & CONVERSION</h6>
                      <p className="small-card-title">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div className="deta-box">
                      <a href="" className="DETAILS-btn">DETAILS</a>
                    </div>
                  </div>
                  <div className="second-card">
                    <div>
                      <h1 className="card-no">05</h1>
                    </div>
                    <div className="card-grid">
                      <h6 className="card-title">SPACE UTILIZATION</h6>
                      <p className="small-card-title">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div className="deta-box">
                      <a href="" className="DETAILS-btn">DETAILS</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-4" className="main-parant-4">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="space-bottom">
                  <h1 className="thred-title"><span className="brdr">T</span>ry our</h1>
                </div>
                <div className="card-box">
                  <div className="card-01">
                    <div>
                      <img src="assets/img/Home-Page/Asset3@3x.png" className="bank-img" alt="" />
                    </div>
                    <div className="bank-spacing">
                      <h6 className="HOME-card-title black">BASIC VERSION</h6>
                      <p className="small-card-title black">Lorem Ipsum is simply dummy text of the printing
                        and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s.</p>
                    </div>
                  </div>
                  <div className="card-01">
                    <div>
                      <img src="assets/img/Home-Page/Asset 5@3x@2x.png" className="bank-img" alt="" />
                    </div>
                    <div className="bank-spacing">
                      <h6 className="HOME-card-title black">HOME VERSION</h6>
                      <p className="small-card-title black">Lorem Ipsum is simply dummy text of the printing
                        and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s.</p>
                    </div>
                    <div>
                      <a href="" className="TRY-NOW-btn">TRY NOW</a>
                    </div>
                  </div>
                  <div className="card-01">
                    <div>
                      <img src="assets/img/Home-Page/Asset 4@3x@2x.png" className="bank-img" alt="" />
                    </div>
                    <div className="bank-spacing">
                      <h6 className="HOME-card-title black">PROFESSIONAL VERSION</h6>
                      <p className="small-card-title black">Lorem Ipsum is simply dummy text of the printing
                        and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-5" className="main-parant-5">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="main-cnatre">
                  <div className="">
                    <h1 className="thred-title"><span className="brdr">H</span>ouse Plan</h1>
                  </div>
                  <div className="flex-cntre">
                    <a id="basePlan" className="house-link active" onClick={() => handlePlanClick("basePlan")}>Base Plan</a>
                    <a id="fFloor" className="house-link" onClick={() => handlePlanClick("fFloor")}>First Floor</a>
                    <a id="sFloor" className="house-link" onClick={() => handlePlanClick("sFloor")}>Second Floor</a>
                    <a className="house-link More">More</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <img src="assets/img/Home-Page/Capture@2x.png" className="Captur-img" alt="" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="aline-cntr">
                  <div className="grid-forth">
                    <div className="title-grid">
                      <h1 className="forth-title">In<span className="botm-brdr">structions to U</span>se</h1>
                      <p className="lore,-title">Lorem Ipsum is simply dummy text of the printing and I don't
                        know typesetting industry. Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s. Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s.</p>
                    </div>
                    <div>
                      <a href="" className="Read-Mores-btn">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-6" className="main-parant-6">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div>
                  <div>
                    <h1 className="fifth-title"><span className="brdr">C</span>ontact Us</h1>
                  </div>
                  <div className="tow-part">
                    <div className="send-grid">
                      <div className="input-grid">
                        <input type="text" placeholder="Full name" className="contact-input" />
                        <input type="text" placeholder="Email" className="contact-input" />
                        <input type="text" placeholder="Phone" className="contact-input mobile" />
                        <textarea name="" id="" placeholder="Message" cols="30" className="contact-input"
                          rows="4"></textarea>
                      </div>

                    </div>
                    <div className="alweay-grid">
                      <input type="text" placeholder="Phone" className="contact-input web" />
                      <h1 className="always-title">We Are Always Here To Help You</h1>
                    </div>
                  </div>
                  <div className="top-padise">
                    <a href="" className="Send-Message-btn">Send Message</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-7" className="main-parant-7">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="Lorem-grid">
                  <a className="logo-links" href="#"><img src="assets/img/Home-Page/Asset 8@3x@2x.png" alt="" /></a>
                  <p className="Lorem-14px">Lorem Ipsum is simply dummy text of the printing and I don't know</p>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="forter-grid">
                  <a href="" className="forter-link">COMPANY</a>
                  <a href="" className="forter-link">PRICE</a>
                  <a href="" className="forter-link">CUSTOMER CARE</a>
                  <a href="" className="forter-link">BLOG</a>
                  <a href="" className="forter-link">MY ACCOUNT</a>
                </div>
              </div>
              <div className="col-lg-3">
                <div>
                  <div className="forter-grid gap">
                    <a href="" className="forter-link">NEWSLETTER</a>
                    <p className="Lorem-14px">Subscribe to our weekly Newsletter and get updates via email.</p>
                  </div>
                  <div className="email-space ddd">
                    <input type="text" className="email-input" placeholder="@example.com" name="" id="" />
                    <img src="assets/img/Home–new/next-arrow.svg" className="next-arrow" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="pading">
                  <div className="forter-grid gap">
                    <a href="" className="forter-link"><span className="botm-brdr">WE</span> ACCEPT</a>
                    <div className="pay-flex">
                      <img src="assets/img/Home-Page/paypal.png" className="pay-ic" alt="" />
                      <img src="assets/img/Home-Page/mastercard.png" className="pay-ic" alt="" />
                      <img src="assets/img/Home-Page/visa-credit-card.png" className="pay-ic" alt="" />
                      <img src="assets/img/Home-Page/american-express.png" className="pay-ic" alt="" />
                    </div>
                  </div>
                  <div className="forter-grid">
                    <div className="email-space">
                      <a href="" className="forter-link"><span className="botm-brdr">CO</span>NNECT WITH US</a>
                    </div>
                    <div className="pay-flex SPACE">
                      <img src="assets/img/Home-Page/MaskGroup1.svg" className="socil-ic" alt="" />
                      <img src="assets/img/Home-Page/MaskGroup2.svg" className="socil-ic" alt="" />
                      <img src="assets/img/Home-Page/MaskGroup3.svg" className="socil-ic" alt="" />
                      <img src="assets/img/Home-Page/MaskGroup4.svg" className="socil-ic" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="main-parant-8" className="main-parant-8">
        <section className="sec-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="foter-flex">
                  <div>
                    <p className="foter-links">All Rights Reserved @ 2022</p>
                  </div>
                  <div className="flex-gap">
                    <a href="" className="foter-links">Privacy & Policy</a>
                    <a href="" className="foter-links">Terms & Conditions</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
              {!loginClicked && (<a className="signin-btn" onClick={onSubmit}>Login</a>)}
              {loginClicked && (<a className="signin-btn loading-button"><i class="fa fa-spinner fa-spin"></i> Login</a>)}
            </div>
            <div className="modal-footer-btn">
              <p className="Account-btn">Don't Have an Account? <span className="sign-brdr" data-bs-dismiss="modal"
                data-bs-toggle="modal" data-bs-target="#SIGNup">Register</span></p>
              {skipClicked && (
                <a className="Account-btn skip"><i class="fa fa-spinner fa-spin"></i> Skip for now
                  {/* <img src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" /> */}
                </a>
              )}
              {!skipClicked && (
                <a className="Account-btn skip" data-bs-dismiss="modal" onClick={navigateToDashboard}>Skip for now
                  <img src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" />
                </a>
              )}
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
                        <input type="email" id="emailRegister" value={emailReg} onChange={(e) => setEmailReg(e.target.value.replace(/\s/g, ""))} placeholder="Email" className="sign-in-input wigt" />
                      </div>
                      <div className="input-position">
                        <input type="password" id="passwordRegister" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value.replace(/\s/g, ""))} placeholder="Password" className="sign-in-input wigt" minLength={6} maxLength={16} />
                        <a className="show-ic wer">
                          {showRegPassword ? (
                            <img src="assets/img/LoadExisting/8674868_ic_fluent_eye_show_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': false, 'id': 'passwordRegister', 'elem': 'register', 'type': 'password' })} />
                          ) : (
                            <img src="assets/img/LoadExisting/8674983_ic_fluent_eye_hide_regular_icon.svg" alt="" onClick={() => setShowPassword({ 'isVisible': true, 'id': 'passwordRegister', 'elem': 'register', 'type': 'text' })} />
                          )}
                        </a>
                      </div>
                      <div className="input-position">
                        <input type="password" id="confirmPasswordReg" value={confirmPassReg} onChange={(e) => setConfirmPassReg(e.target.value.replace(/\s/g, ""))} placeholder="Confirm password" className="sign-in-input wigt" minLength={6} maxLength={16} />
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
                      {!regClicked && (<a className="signin-btn" onClick={onSubmitSignup}>Register</a>)}
                      {regClicked && (<a className="signin-btn loading-button"><i class="fa fa-spinner fa-spin"></i> Register</a>)}
                      <a id="getOTP" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#OTP" hidden>Signup</a>
                    </div>
                    <div className="canter-skip">
                      <p className="Account-btn wiht">Already have an Account? <span className="sign-brdr"
                        data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#SIGNIN">Log in</span></p>


                      {skipClicked && (
                        <p className="Account-btn clr pt-3"><i class="fa fa-spinner fa-spin"></i> Skip for now
                          {/* <img src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" /> */}
                        </p>
                      )}
                      {!skipClicked && (
                        <p className="Account-btn clr pt-3" data-bs-dismiss="modal" onClick={navigateToDashboard}>Skip for now
                          <img src="assets/img/Home-Page/homeFinal/Path 66.svg" className="right-ic" alt="" />
                        </p>
                      )}
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
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 1) }} onKeyDown={keypressed} id="digit1" pattern="\d*" minLength="1" maxLength="1" required autoFocus />
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 2) }} onKeyDown={keypressed} id="digit2" pattern="\d*" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 3) }} onKeyDown={keypressed} id="digit3" pattern="\d*" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 4) }} onKeyDown={keypressed} id="digit4" pattern="\d*" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 5) }} onKeyDown={keypressed} id="digit5" pattern="\d*" minLength="1" maxLength="1" required />
              <input autoComplete="off" type="number" className="otp-input" onChange={(e) => { SetOtpFunc(e, 6) }} onKeyDown={keypressed} id="digit6" pattern="\d*" minLength="1" maxLength="1" required />
            </div>
            <div>
              {nextButtonClicked ? (
                <button className="signin-btn loading-button" onClick={verifyAccount}><i class="fa fa-spinner fa-spin"></i> Next</button>
              ) : (
                <button className="signin-btn" onClick={verifyAccount}>Next</button>
              )}
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

export default Login;
