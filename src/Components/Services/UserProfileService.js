import { ApiGet, ApiPut } from "../../utils/Networking";

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

export const uploadImage = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPut(
      `/user/${payload.folder}/${payload.subFolder}/${payload.folder}`,
      payload,
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
