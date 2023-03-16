import React from "react";
import PersonalDetails from "./personalDetails/PersonalDetails.js";
import ProfileHeader from "./ProfileHeader.js";
import SavedCards from "./savedCard/SavedCards.js";
import { ProfileContent, Wrapper } from "./style.js";

const Profile = () => {
  return (
    <Wrapper>
      <ProfileHeader />
      <ProfileContent>
        <PersonalDetails />
        <SavedCards />
      </ProfileContent>
    </Wrapper>
  );
};

export default Profile;
