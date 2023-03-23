import axiosApi from "./apiConfig";

export const ApiPut = async (path, body) => {
  return axiosApi.put(path, body);
};

export const ApiGet = async (path) => {
  return axiosApi.get(path);
};

export const ApiPost = async (path, body) => {
  return axiosApi.post(path, body);
};

export const ApiDelete = async (path, body) => {
  return axiosApi.delete(path, body);
};
