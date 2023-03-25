import React, { useState, useEffect } from "react";
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
import { updateUserDetails } from "../../../Services/UserProfileService";
import { useAuth } from "../../../../Context/AuthProvider";
import { toast } from "react-toastify";
import Text from "../../../Text";
import { somethingWentWrongError } from "../../../../Constants/";

const EditProfile = ({ childToParent }) => {
  const [inputVal, setInputVal] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userId, userProfileDetails, getUserInfo } = useAuth();

  const onChangeHandler = (evt) => {
    setError("");
    const value = evt.target.value;
    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  const handleEditProfileDetails = () => {
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
      profile_pic: userProfileDetails?.profile_pic,
    };

    updateProfileValues.userId = userId;

    setLoading(true);
    updateUserDetails(updateProfileValues)
      .then((response) => {
        if (response?.status === 200 && response?.data?.msg) {
          toast.success("Your profile updated successfully");
          getUserInfo();
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
    }
  }, [userId]);

  return (
    <MainWrapper>
      <HeaderWrapper>
        <ProfileWrp>
          <ImageWrp>
            <img src="assets/img/profile/userLogo.png" alt="" />
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
          <BlueLabel>Change</BlueLabel>
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
            <Items>
              <Label>Password</Label>
              <input type="password" placeholder="Password" />
            </Items>
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
          <DecoratedLabel>Change password</DecoratedLabel>
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
              <option value="india">India</option>
              <option value="japan">Japan</option>
              <option value="australia">Australia</option>
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
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="chandigarh">Chandigarh</option>
              <option value="chandigarh">Handa</option>
              <option value="seto">Seto</option>
              <option value="tsushima">Tsushima</option>
              <option value="anjō">Anjō</option>
              <option value="tokoname">Tokoname</option>
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
              <label>Verified</label>
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
    </MainWrapper>
  );
};

export default EditProfile;
