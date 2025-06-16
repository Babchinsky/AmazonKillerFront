import { Country, State, City } from "country-state-city";


const allowedCountries = [
  "Australia",
  "Austria",
  "Belgium",
  "Bulgaria",
  "Canada",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovenia",
  "Spain",
  "Sweden",
  "Ukraine",
  "United Kingdom",
  "United States",
];

export function getCountryOptions() {
  return Country.getAllCountries()
    .filter((country) => allowedCountries.includes(country.name))
    .map((country) => ({
      id: country.isoCode,
      label: country.name,
    }));
}

export function getCountryName(code: string) {
  return Country.getCountryByCode(code)?.name ?? code;
}

export function getStateOptions(countryIsoCode: string) {
  return State.getStatesOfCountry(countryIsoCode).map((state) => ({
    id: state.isoCode,
    label: state.name,
  }));
}

export function getStateName(stateCode: string, countryCode: string) {
  return State.getStateByCodeAndCountry(stateCode, countryCode)?.name ?? stateCode;
}

export function getCityOptions(countryIsoCode: string, stateIsoCode: string) {
  return City.getCitiesOfState(countryIsoCode, stateIsoCode).map((city) => ({
    id: city.name,
    label: city.name,
  }));
}