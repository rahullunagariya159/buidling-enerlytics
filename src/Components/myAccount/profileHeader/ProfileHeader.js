import React from "react";
import "./style.js";
import {
  ContactHeader,
  ContactWrp,
  CreditLabel,
  CreditWrp,
  ImageWrp,
  BlueLabel,
  PlanInfo,
  ProfileInfo,
  ProfileWrp,
  Role,
  SmallLabel,
  UserLogo,
  UserName,
  VerticalLine,
  Wrapper,
  Label,
  AddressWrp,
} from "./style.js";

const ProfileHeader = () => {
  return (
    <Wrapper>
      <ProfileWrp>
        <UserLogo>
          <ImageWrp>
            <img src="assets/img/userLogo.png" alt="" />
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
            <AddressWrp>
              <img src="assets/img/active-ic/fan.svg" alt=" " />
              <Label>Canada, Ontario</Label>
            </AddressWrp>
            <AddressWrp>
              <img src="assets/img/active-ic/motor.svg" alt=" " />
              <Label>9876541234</Label>
            </AddressWrp>
            <AddressWrp>
              <img src="assets/img/active-ic/row1.svg" alt=" " />
              <Label>xyz@gmail.com</Label>
            </AddressWrp>
          </ContactWrp>
        </ProfileInfo>
      </ProfileWrp>
      <PlanInfo>Active plan</PlanInfo>
    </Wrapper>
  );
};

export default ProfileHeader;
