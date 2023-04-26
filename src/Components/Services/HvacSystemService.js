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

export const getHVACHeatingWarmWater = (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(
      `/hvac/heating-warm-water?unheated_space=${payload?.unheated_space}&well_insulated=${payload?.well_insulated}&heating_energy_transmitted=${payload?.heating_energy_transmitted}`,
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
