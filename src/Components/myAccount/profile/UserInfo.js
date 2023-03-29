import React, { useState } from "react";

import "./style.js";
import {
  ContactHeader,
  ContactWrp,
  CreditLabel,
  CreditWrp,
  ImageWrp,
  BlueLabel,
  ProfileInfo,
  ProfileWrp,
  Role,
  SmallLabel,
  UserLogo,
  UserName,
  VerticalLine,
  Label,
  EmailWrp,
  LocationWrp,
  PhoneWrp,
  CreditMainWrp,
} from "./style.js";
import { useAuth } from "../../../Context/AuthProvider";

const UserInfo = () => {
  const { userProfileDetails } = useAuth();
  const [error, setError] = useState("");

  return (
    <ProfileWrp>
      <UserLogo>
        <ImageWrp>
          <img
            src={
              userProfileDetails?.profile_pic ||
              "assets/img/profile/default-user-avatar.jpeg"
            }
            alt=""
          />
        </ImageWrp>
        {/* <BlueLabel {...getRootProps()}>
          <input {...getInputProps()} />
          Change
        </BlueLabel> */}
      </UserLogo>
      <ProfileInfo>
        <ContactHeader>
          <div>
            <UserName>
              {(userProfileDetails?.first_name || "") +
                " " +
                (userProfileDetails?.last_name || "")}
            </UserName>
            <Role>{userProfileDetails?.user_name}</Role>
          </div>
          <CreditMainWrp>
            <VerticalLine></VerticalLine>
            <CreditWrp>
              <SmallLabel>Available credits</SmallLabel>
              <CreditLabel>{userProfileDetails?.credits || 0}</CreditLabel>
            </CreditWrp>
          </CreditMainWrp>
        </ContactHeader>
        <ContactWrp>
          <LocationWrp>
            <img src="assets/img/profile/location.png" alt=" " />
            <Label>
              {userProfileDetails?.country}, {userProfileDetails?.city}
            </Label>
          </LocationWrp>
          <PhoneWrp>
            <img src="assets/img/profile/phone.png" alt=" " />
            <Label>{userProfileDetails?.phone_no || ""}</Label>
          </PhoneWrp>
          <EmailWrp>
            <img src="assets/img/profile/mail.png" alt=" " />
            <Label>{userProfileDetails?.email || ""}</Label>
          </EmailWrp>
        </ContactWrp>
      </ProfileInfo>
    </ProfileWrp>
  );
};

export default UserInfo;
