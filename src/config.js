export function content() {
    return {
        emailErrorMessage: 'Please enter valid email id.',
        passwordErrorMessage: 'Please enter a password.'
    }
}

// validate the input fields
export function validateInput(Elm, errorMessage) {

    const _validateEmail = function (email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        return (false)
    }

    switch (Elm.type) {
        case 'password':
            if (!Elm.value) {
                Elm.classList.add("error");

                let spanTag = document.createElement("span");
                spanTag.classList = "error-message";
                spanTag.innerHTML = errorMessage;
                return false;
            } else {
                Elm.classList.remove("error");
                return true;
            }
        case 'tel':
            let telElm = document.querySelector(".PhoneInput");
            console.log('Phone__', Elm.value.replace(/ /g, ''));
            if (!Elm.value) {
                telElm.classList.add("error");
                return false;
                // } else if (!(Elm.value.replace(/ /g,'').match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/))) {
                //     telElm.classList.add("error");
                //     return false;
            } else {
                telElm.classList.remove("error");
                return true;
            }
        case 'number':
            if (!Elm.value) {
                Elm.classList.add("error");

                if (errorMessage) {
                    let spanTag = document.createElement("span");
                    spanTag.classList = "error-message";
                    spanTag.innerHTML = errorMessage;
                }
                return false;
            } else if (Elm.value < 0) {
                Elm.classList.add("error");

                if (errorMessage) {
                    let spanTag = document.createElement("span");
                    spanTag.classList = "error-message";
                    spanTag.innerHTML = errorMessage;
                }
                return false;
            } else {
                Elm.classList.remove("error");
                return true;
            }
        case 'textarea':
        case 'text':
            if (!Elm.value) {
                Elm.classList.add("error");

                if (errorMessage) {
                    let spanTag = document.createElement("span");
                    spanTag.classList = "error-message";
                    spanTag.innerHTML = errorMessage;
                }
                return false;
            } else {
                Elm.classList.remove("error");
                return true;
            }
        case 'email':
            if (!Elm.value) {
                Elm.classList.add("error");
                return false;
            } else if (!_validateEmail(Elm.value)) {
                Elm.classList.add("error");
                return false
            } else {
                Elm.classList.remove("error");
                return true;
            }
        case 'radio':
        case 'checkbox':
            let tcElm = document.querySelector(".tc-accepted");
            if (!Elm.checked) {
                tcElm.classList.add("error");
                return false;
            } else {
                tcElm.classList.remove("error");
                return true;
            }
        case 'select-one':
            if (Elm.value === '0') {
                Elm.classList.add("error");
                return false;
            } else {
                Elm.classList.remove("error");
                return true;
            }
    }
    return true;
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

export default {
    s3: {
        REGION: "YOUR_S3_UPLOADS_BUCKET_REGION",
        BUCKET: "YOUR_S3_UPLOADS_BUCKET_NAME"
    },
    apiGateway: {
        REGION: "YOUR_API_GATEWAY_REGION",
        URL: "YOUR_API_GATEWAY_URL"
    },
    cognito: {
        REGION: "YOUR_COGNITO_REGION",
        USER_POOL_ID: "YOUR_COGNITO_USER_POOL_ID",
        APP_CLIENT_ID: "YOUR_COGNITO_APP_CLIENT_ID",
        IDENTITY_POOL_ID: "YOUR_IDENTITY_POOL_ID"
    },
    social: {
        FB: "4120158951542979"
    }
};