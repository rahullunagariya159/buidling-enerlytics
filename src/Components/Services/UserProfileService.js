import { ApiGet, ApiPut } from "../../utils/Networking";
import { BUCKET_FOLDER, BUCKET_SUB_FOLDER } from "../../Constants/";
export const getUserDetails = async (userId) => {
  return new Promise((resolve, reject) => {
    ApiGet(`/user/${userId}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const updateUserDetails = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPut(`/user/${payload.userId}`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const uploadProfileImage = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPut(
      `/user/${BUCKET_FOLDER}/${BUCKET_SUB_FOLDER}/${payload.name}`,
      payload.file,
      {
        headers: {
          "Content-Type": payload.fileType,
        },
      },
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getCreditCardsList = async (userId) => {
  return new Promise((resolve, reject) => {
    ApiGet(`/credit-card?userId=${userId}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
