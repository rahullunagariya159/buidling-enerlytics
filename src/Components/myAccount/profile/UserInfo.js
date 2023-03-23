import React from "react";
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
} from "./style.js";
import { useAuth } from "../../../Context/AuthProvider";

const UserInfo = () => {
  const { userProfileDetails } = useAuth();

  return (
    <ProfileWrp>
      <UserLogo>
        <ImageWrp>
          <img
            src={
              userProfileDetails?.profile_pic ||
              "assets/img/profile/userLogo.png"
            }
            alt=""
          />
        </ImageWrp>
        <BlueLabel>Change</BlueLabel>
      </UserLogo>
      <ProfileInfo>
        <ContactHeader>
          <div>
            <UserName>
              {(userProfileDetails?.first_name || "") +
                " " +
                (userProfileDetails?.last_name || "")}
            </UserName>
            <Role>golden_design12</Role>
          </div>
          <VerticalLine></VerticalLine>
          <CreditWrp>
            <SmallLabel>Available credits</SmallLabel>
            <CreditLabel>{userProfileDetails?.credits || 0}</CreditLabel>
          </CreditWrp>
        </ContactHeader>
        <ContactWrp>
          <LocationWrp>
            <img src="assets/img/profile/location.png" alt=" " />
            <Label>
              {userProfileDetails?.address}, {userProfileDetails?.city}{" "}
              {userProfileDetails?.country}{" "}
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
