import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CancelButton from "../../../CancelButton";
import LinkButton from "../../../LinkButton";
import {
  BlueLabel,
  ContactHeader,
  ImageWrp,
  Label,
  ProfileInfo,
  ProfileWrp,
  UserName,
} from "../style.js";
import {
  UpdateWrp,
  HeaderWrapper,
  HorizontalLine,
  MainWrapper,
  Title,
  SectionTitle,
  FormSection,
  Items,
  RowWrp,
  DecoratedLabel,
  FooterButton,
  PhoneNumberItems,
  SelectWrp,
  EditProfileHeaderLabel,
} from "./style.js";
import {
  updateUserDetails,
  uploadProfileImage,
} from "../../../Services/UserProfileService";
import { useAuth } from "../../../../Context/AuthProvider";
import { toast } from "react-toastify";
import Text from "../../../Text";
import { somethingWentWrongError } from "../../../../Constants";
import {
  getBase64,
  validateUserName,
  getCountries,
  getCities,
} from "../../../../utils/";
import LoadingCover from "../../../LoadingCover";

const EditProfile = ({ childToParent }) => {
  const [inputVal, setInputVal] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const { userId, userProfileDetails, getUserInfo } = useAuth();

  const onChangeHandler = (evt) => {
    setError("");
    const value = evt.target.value;

    if (evt.target.name === "userName") {
      setInputVal({
        ...inputVal,
        [evt.target.name]: validateUserName(value),
      });
      return true;
    }

    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  const handleGetCitiesById = (countryCode) => {
    setCityList(getCities(countryCode));
  };

  const handleEditProfileDetails = async () => {
    setError("");
    if (!userId) {
      return false;
    }

    let updateProfileValues = {
      website: inputVal?.website,
      phone_no: inputVal?.phoneNumber,
      apt: inputVal?.apt,
      address: inputVal?.address,
      country: inputVal?.country,
      postal_code: inputVal?.postalCode,
      city: inputVal?.city,
      company_name: inputVal?.companyName,
      last_name: inputVal?.lastName,
      first_name: inputVal?.firstName,
      country_code: inputVal?.countryCode,
      user_name: inputVal?.userName,
      profile_pic: profileImgUrl || userProfileDetails?.profile_pic,
    };

    updateProfileValues.userId = userId;

    setLoading(true);
    await updateUserDetails(updateProfileValues)
      .then(async (response) => {
        if (response?.status === 200 && response?.data?.msg) {
          await getUserInfo(userId);
          toast.success("Your profile updated successfully");
          childToParent();
        } else {
          setError(response?.error || somethingWentWrongError);
        }
      })
      .catch((error) => {
        setError(error || somethingWentWrongError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      const defaultValues = {
        website: userProfileDetails?.website,
        phoneNumber: userProfileDetails?.phone_no,
        apt: userProfileDetails?.apt,
        address: userProfileDetails?.address,
        country: userProfileDetails?.country,
        postalCode: userProfileDetails?.postal_code,
        city: userProfileDetails?.city,
        companyName: userProfileDetails?.company_name,
        lastName: userProfileDetails?.last_name,
        firstName: userProfileDetails?.first_name,
        countryCode: userProfileDetails?.country_code,
        userName: userProfileDetails?.user_name,
        profilePic: userProfileDetails?.profile_pic,
      };
      setInputVal(defaultValues);
      setProfileImgUrl(userProfileDetails?.profile_pic);

      setCountryList(getCountries());
      setCityList(getCities());
    }
  }, [userId]);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length === 0) {
      setError("Please upload only jpeg,jpg, or png image");
      return false;
    }
    setShowLoading(true);

    const uploadFile = acceptedFiles[0];

    getBase64(uploadFile, (result) => {
      const fileData = {
        user_avatar: result,
      };

      uploadProfileImage(fileData)
        .then((response) => {
          if (response?.status === 200 && response?.data?.Location) {
            setProfileImgUrl(response?.data?.Location);
          }
        })
        .catch((error) => {
          console.log({ error });
          setError("Please upload only jpeg,jpg, or png image");
        })
        .finally(() => {
          setShowLoading(false);
        });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    type: "file",
  });

  return (
    <MainWrapper>
      <HeaderWrapper>
        <ProfileWrp>
          <ImageWrp>
            <img
              src={
                profileImgUrl || "assets/img/profile/default-user-avatar.jpeg"
              }
              alt="user_avatar"
            />
          </ImageWrp>
          <ProfileInfo>
            <ContactHeader>
              <div>
                <UserName>
                  {" "}
                  {(userProfileDetails?.first_name || "") +
                    " " +
                    (userProfileDetails?.last_name || "")}
                </UserName>
                <EditProfileHeaderLabel>
                  Manage your personal information, Password and more
                </EditProfileHeaderLabel>
              </div>
            </ContactHeader>
          </ProfileInfo>
        </ProfileWrp>
        <UpdateWrp>
          <BlueLabel {...getRootProps()}>
            <input {...getInputProps()} />
            Change
          </BlueLabel>
        </UpdateWrp>
      </HeaderWrapper>
      <HorizontalLine />
      <FormSection>
        <Title>EDIT PROFILE</Title>
      </FormSection>
      <div>
        <SectionTitle>PERSONAL DETAILS</SectionTitle>
        <form>
          <RowWrp>
            <Items>
              <Label>First name</Label>
              <input
                type="text"
                placeholder="First name"
                id="firstName"
                name="firstName"
                value={inputVal?.firstName}
                onChange={onChangeHandler}
              />
            </Items>
            <Items>
              <Label>Last name</Label>
              <input
                type="text"
                placeholder="Last name"
                id="lastName"
                name="lastName"
                value={inputVal?.lastName}
                onChange={onChangeHandler}
              />
            </Items>
          </RowWrp>
          <RowWrp>
            {/* <Items>
              <Label>Password</Label>
              <input type="password" placeholder="Password" />
            </Items> */}
            <Items>
              <Label>User id</Label>
              <input
                type="text"
                placeholder="User id"
                name="userName"
                value={inputVal?.userName}
                onChange={onChangeHandler}
              />
            </Items>
          </RowWrp>
          {/* <DecoratedLabel>Change password</DecoratedLabel> */}
        </form>
      </div>
      <div>
        <SectionTitle>ADDRESS DETAILS</SectionTitle>
        <RowWrp>
          <Items>
            <Label>Country</Label>
            <select
              id="country"
              name="country"
              onChange={onChangeHandler}
              value={inputVal?.country}
            >
              <option value="">Select</option>
              {countryList?.length > 0 &&
                countryList?.map((country) => {
                  return (
                    <option
                      value={country?.name}
                      onChange={() => handleGetCitiesById(country?.countryCode)}
                    >
                      {country?.name}
                    </option>
                  );
                })}
            </select>
          </Items>
          <Items>
            <Label>City</Label>
            <select
              id="city"
              name="city"
              onChange={onChangeHandler}
              value={inputVal?.city}
            >
              <option value="">Select</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Newyork">Newyork</option>
              <option value="Dallas">Dallas</option>
              <option value="Losangeles">Losangeles</option>
              <option value="Berlin">Berlin</option>
              <option value="Hamburg">Hamburg</option>
              <option value="Munich">Munich</option>
              <option value="Paris">Paris</option>
              <option value="Marseille">Marseille</option>
              <option value="Lyon">Lyon</option>

              {/* {cityList?.length > 0 &&
                cityList?.map((city) => {
                  return <option value={city?.name}>{city?.name}</option>;
                })} */}
            </select>
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Address</Label>
            <input
              type="text"
              placeholder="Address"
              name="address"
              id="address"
              value={inputVal.address}
              onChange={onChangeHandler}
            />
          </Items>
          <Items>
            <Label>Postal code</Label>
            <input
              type="number"
              placeholder="Postal code"
              name="postalCode"
              id="postalCode"
              value={inputVal.postalCode}
              onChange={onChangeHandler}
            />
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Apt, suite, etc (optional)</Label>
            <input
              type="text"
              placeholder="Apt, suite, etc"
              name="apt"
              id="apt"
              value={inputVal?.apt}
              onChange={onChangeHandler}
            />
          </Items>
        </RowWrp>
      </div>
      <div>
        <SectionTitle>CONTACT DETAILS</SectionTitle>
        <RowWrp>
          <PhoneNumberItems>
            <Label>Phone number</Label>
            <SelectWrp>
              <select
                name="countryCode"
                id="countryCode"
                value={inputVal?.countryCode}
                onChange={onChangeHandler}
              >
                <option value="+91">+91</option>
                <option value="+21">+21</option>
                <option value="+15">+15</option>
                <option value="+18">+18</option>
              </select>
              <input
                type="number"
                name="phoneNumber"
                id="phoneNumber"
                value={inputVal?.phoneNumber}
                onChange={onChangeHandler}
              />
              {/* {inputVal?.phoneNumber && <label>Verified</label>} */}
            </SelectWrp>
          </PhoneNumberItems>
          <Items>
            <Label>E-mail</Label>
            <input
              type="email"
              placeholder="Email"
              value={userProfileDetails?.email}
              disabled
            />
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Company name</Label>
            <input
              type="text"
              placeholder="Company name"
              name="companyName"
              id="companyName"
              value={inputVal?.companyName}
              onChange={onChangeHandler}
            />
          </Items>
          <Items>
            <Label>Website</Label>
            <input
              type="text"
              placeholder="Website"
              name="website"
              id="website"
              value={inputVal?.website}
              onChange={onChangeHandler}
            />
          </Items>
        </RowWrp>
        <Text text={error} type="error" className="lbl-login-error" />
      </div>
      <FooterButton>
        <LinkButton
          className={`signin-btn `}
          title="Save"
          isLoading={loading}
          isDisable={loading}
          onClick={handleEditProfileDetails}
        />
        <CancelButton title="Cancel" onClick={() => childToParent()} />
      </FooterButton>
      <LoadingCover show={showLoading} />
    </MainWrapper>
  );
};

export default EditProfile;
