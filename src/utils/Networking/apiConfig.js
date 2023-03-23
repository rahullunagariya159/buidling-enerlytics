import axios from "axios";
import { API_URL } from "../../Constants";

const axiosApi = axios.create({
  baseURL: API_URL,
});

// if a 401 happens, when token is expired
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      console.log({ "token is expired": error });
    }
    return Promise.reject(error);
  },
);

export default axiosApi;
