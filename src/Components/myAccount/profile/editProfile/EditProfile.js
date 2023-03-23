import React from "react";
import CancelButton from "../../../CancelButton.js";
import LinkButton from "../../../LinkButton.js";
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
} from "./style.js";
const EditProfile = () => {
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
                <UserName>Golden Designs</UserName>
                <Label>
                  Manage your personal information, Password and more
                </Label>
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
              <input type="text" placeholder="First name" />
            </Items>
            <Items>
              <Label>Last name</Label>
              <input type="text" placeholder="Last name" />
            </Items>
          </RowWrp>
          <RowWrp>
            <Items>
              <Label>Password</Label>
              <input type="password" placeholder="Password" />
            </Items>
            <Items>
              <Label>User id</Label>
              <input type="text" placeholder="User id" />
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
            <select id="Country" name="Country">
              <option value="">Select</option>
              <option value="India">India</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
            </select>
          </Items>
          <Items>
            <Label>City</Label>
            <select id="City" name="City">
              <option value="">Select</option>
              <option value="India">India</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
            </select>
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Address</Label>
            <input type="text" placeholder="Address" />
          </Items>
          <Items>
            <Label>Postal code</Label>
            <input type="text" placeholder="Postal code" />
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Apt, suite, etc (optional)</Label>
            <input type="text" placeholder="Apt, suite, etc" />
          </Items>
        </RowWrp>
      </div>
      <div>
        <SectionTitle>CONTACT DETAILS</SectionTitle>
        <RowWrp>
          <PhoneNumberItems>
            <Label>Phone number</Label>
            <SelectWrp>
              <select>
                <option value="">+91</option>
                <option value="India">+21</option>
                <option value="Japan">+15</option>
                <option value="Australia">+18</option>
              </select>
              <input type="text" />
              <label>Verified</label>
            </SelectWrp>
          </PhoneNumberItems>
          <Items>
            <Label>E-mail</Label>
            <input type="email" placeholder="Email" />
          </Items>
        </RowWrp>
        <RowWrp>
          <Items>
            <Label>Company name</Label>
            <input type="text" placeholder="Company name" />
          </Items>
          <Items>
            <Label>Website</Label>
            <input type="text" placeholder="Website" />
          </Items>
        </RowWrp>
      </div>
      <FooterButton>
        <LinkButton className={`signin-btn `} title="Save" />
        <CancelButton title="Cancel" />
      </FooterButton>
    </MainWrapper>
  );
};

export default EditProfile;
