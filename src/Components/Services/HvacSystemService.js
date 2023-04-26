import { ApiGet, ApiPost } from "../../utils/Networking";

export const getHvacData = (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(
      `/hvac?userId=${payload?.userId}&configurationId=${payload?.configurationId}`,
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const saveHvacData = (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/hvac`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
