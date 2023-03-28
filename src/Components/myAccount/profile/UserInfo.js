import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

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
import { uploadProfileImage } from "../../Services/UserProfileService";

const UserInfo = () => {
  const { userProfileDetails, getUserInfo } = useAuth();
  const [error, setError] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length === 0) {
      setError("Please upload only jpeg,jpg, or png image");
      return false;
    }

    const uploadFile = acceptedFiles[0];
    const fileName = uploadFile.name || "";
    const formData = new FormData();
    formData.append("file", uploadFile);
    const uploadData = {
      file: formData,
      name: fileName,
      fileType: uploadFile.type,
    };

    uploadProfileImage(uploadData)
      .then((response) => {
        console.log({ response });
        if (response.status === 200) {
          getUserInfo();
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    type: "file",
  });

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
        <BlueLabel {...getRootProps()}>
          <input {...getInputProps()} />
          Change
        </BlueLabel>
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
