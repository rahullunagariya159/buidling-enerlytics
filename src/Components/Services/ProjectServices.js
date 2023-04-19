import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../utils/Networking";

export const listProjects = async (userId) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/projects`, { userId })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const listProjectConfigurations = async (projectId) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/project-configurations`, { projectId })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const addProjectConfiguration = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/add-project-configuration`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const deleteProject = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/delete-project`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const deleteProjectConfiguration = async (payload) => {
  return new Promise((resolve, reject) => {
    ApiPost(`/delete-project-configuration`, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
