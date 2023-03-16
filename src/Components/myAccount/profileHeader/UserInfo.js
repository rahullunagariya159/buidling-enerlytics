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
const UserInfo = () => {
  return (
    <ProfileWrp>
      <UserLogo>
        <ImageWrp>
          <img src="assets/img/profile/userLogo.png" alt="" />
        </ImageWrp>
        <BlueLabel>Change</BlueLabel>
      </UserLogo>
      <ProfileInfo>
        <ContactHeader>
          <div>
            <UserName>Golden Designs</UserName>
            <Role>golden_design12</Role>
          </div>
          <VerticalLine></VerticalLine>
          <CreditWrp>
            <SmallLabel>Available credits</SmallLabel>
            <CreditLabel>500</CreditLabel>
          </CreditWrp>
        </ContactHeader>
        <ContactWrp>
          <LocationWrp>
            <img src="assets/img/profile/location.png" alt=" " />
            <Label>Canada, Ontario</Label>
          </LocationWrp>
          <PhoneWrp>
            <img src="assets/img/profile/phone.png" alt=" " />
            <Label>9876541234</Label>
          </PhoneWrp>
          <EmailWrp>
            <img src="assets/img/profile/mail.png" alt=" " />
            <Label>xyz@gmail.com</Label>
          </EmailWrp>
        </ContactWrp>
      </ProfileInfo>
    </ProfileWrp>
  );
};

export default UserInfo;
