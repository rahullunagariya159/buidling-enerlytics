import axios from "axios";

// Configs
axios.defaults.baseURL = 'https://bbgn1qkc7d.execute-api.eu-central-1.amazonaws.com/dev';
// Api calls

// const response = await axios.post(`/accounts/v1/update/vendor/details/onboard`, payload, {
//     headers: {
//         'Client-Secret': ReactSession.get('usr_access_token')
//     }
// });

export async function createProject(payload) {
    try {
        const response = await axios.post(`/createproject`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function listProjects(payload) {
    try {
        const response = await axios.post(`/list-projects`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function get3dJSONData(payload) {
    try {
        const response = await axios.post(`/get-project-building-model-data`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function set3dJSONData(payload) {
    try {
        const response = await axios.post(`/save-project-building-model-data`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function updateProjectName(payload) {
    try {
        const response = await axios.post(`/update-project-name`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function updateGuestLogin(payload) {
    try {
        const response = await axios.post(`/updateproject`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function getPlans(payload) {
    try {
        const response = await axios.post(`/choose-plan`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function getPromoDetails(payload) {
    try {
        const response = await axios.post(`/promo-code`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}

export async function saveCard(payload) {
    try {
        const response = await axios.post(`/credit-card`, payload);
        if (response && response.status === 200) {
            return response.data;
        }
        else {
            throw response;
        }
    }
    catch (e) {
        console.log(e?.response?.data?.error || 'Something went wrong!');
        throw e;
    }
}