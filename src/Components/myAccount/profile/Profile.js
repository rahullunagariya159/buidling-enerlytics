import React, { useState } from "react";
import EditProfile from "./editProfile/EditProfile.js";
import PersonalDetails from "./personalDetails/PersonalDetails.js";
import ProfileHeader from "./ProfileHeader.js";
import SavedCards from "./savedCard/SavedCards.js";
import { ProfileContent, Wrapper } from "./style.js";

const Profile = () => {
  const [show, setShow] = useState(true);
  const childToParent = () => {
    setShow(!show);
  };
  return (
    <Wrapper>
      {show ? (
        <>
          <ProfileHeader />
          <ProfileContent>
            <PersonalDetails childToParent={childToParent} />
            <SavedCards />
          </ProfileContent>
        </>
      ) : (
        <EditProfile childToParent={childToParent} />
      )}
    </Wrapper>
  );
};

export default Profile;
