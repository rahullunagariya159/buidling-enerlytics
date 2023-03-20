export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e?.response?.data?.error || "Something went wrong!");
    throw e;
  }
};

export const updateUserDetails = async (payload) => {
  try {
    const response = await axios.put(`/user/${payload.userId}`, payload);
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e?.response?.data?.error || "Something went wrong!");
    throw e;
  }
};

export const uploadImage = async (payload) => {
  try {
    const response = await axios.put(
      `/user/${payload.folder}/${payload.subFolder}/${payload.folder}`,
      payload,
    );
    if (response && response.status === 200) {
      return response.data;
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e?.response?.data?.error || "Something went wrong!");
    throw e;
  }
};
