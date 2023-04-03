import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../utils/Networking";

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
    ApiPost(`/upload-image`, payload)
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

export const getPromoCodesList = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(`/promo-code?userId=${payload?.userId}&type=${payload?.type}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getSubscriptionAndHistory = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(`/subscriptions?userId=${payload?.userId}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const activatePromocode = (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/promo-code/activate`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const buyCredits = (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/credits`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const checkUserEmailExist = (userId) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/check-email`, { userId })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
