import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../utils/Networking";
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
      `/${BUCKET_FOLDER}/${BUCKET_SUB_FOLDER}/${payload.name}`,
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

export const makeDefaultCard = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/credit-card/${payload?.id}/default`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const removeCard = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiDelete(`/credit-card/${payload.id}`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
