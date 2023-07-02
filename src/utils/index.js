import { Country, State, City } from "country-state-city";

export const checkPassword = (str) => {
  // var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  // console.log('__IS_VALID', re.test(str));
  return re.test(str);
};

export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

export const validateUserName = (value) => {
  return value.replace(/[&@!=/\#,+()$~%'":*?<>{}^ ]/g, "");
};

export const getCountryCodeByCountryName = async (countryName) => {
  return await Country.getAllCountries()?.find(
    (country) => country?.name === countryName,
  );
};

export const getCountries = (countryCode) => {
  if (countryCode) {
    return Country.getCountryByCode(countryCode);
  }
  return Country.getAllCountries();
};

export const getCities = (countryCode) => {
  if (countryCode) {
    return City.getCitiesOfCountry(countryCode);
  }
  return City.getAllCities();
};

export const getCitiesByCountryName = async (countryName) => {
  if (countryName) {
    const countryDetails = await getCountryCodeByCountryName(countryName);
    if (countryDetails?.isoCode) {
      const citiesList = City.getCitiesOfCountry(countryDetails?.isoCode);
      return citiesList || [];
    }
  }
};

export const validatePhoneNumber = (input_str) => {
  let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(input_str);
};

export const validateNumber = (value) => {
  let numberReg = /^[0-9]*$/;
  return numberReg.test(value);
};
