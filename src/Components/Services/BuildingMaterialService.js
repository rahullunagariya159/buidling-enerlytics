import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../utils/Networking";

export const getBuildingMaterialCountries = async () => {
  return new Promise((resolve, reject) => {
    ApiGet(`/building-material/countries`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getBuildingMaterialTypeList = (countryName) => {
  return new Promise((resolve, reject) => {
    ApiGet(`/building-material/building-type?country=${countryName}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getBuildingMaterialConstructionYear = (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(
      `/building-material/construction-year?country=${payload?.country}&buildingType=${payload?.buildingType}`,
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getBuildingMaterialAppearance = (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(
      `/building-material/building-appearance?country=${payload?.country}&buildingType=${payload?.buildingType}&constructionYear=${payload?.constructionYear}`,
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const saveBuildingMaterialData = (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/building-material`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getBuildingMaterialData = (payload) => {
  return new Promise((resolve, reject) => {
    ApiGet(
      `/building-material?userId=${payload?.userId}&configurationId=${payload?.configurationId}`,
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
