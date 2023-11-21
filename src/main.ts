import fetch from "../include/fetch.js";
import { GeoCoord } from "./fetchGeoCoord.js";
import { fetchUniversities } from "./fetchUniversities.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { fetchUniversityWeather, fetchUMassWeather, fetchUCalWeather } from "./universityWeather.js";

// TODO - Now its your turn to make the working example! :)

//this function finds the temperature average in a city given by its longitude and latitude (using fetchCurrentWeather)
function weatherIn(c: GeoCoord) {
  return fetchCurrentTemperature(c).then(result => {
    return result.temperature_2m.reduce((s, a) => s + a, 0) / result.temperature_2m.length;
  });
}

//finding average temperature for the following cities
let Moscow = weatherIn({ lat: 37.6, lon: 55.75 });
let Copenhagen = weatherIn({ lat: 12.57, lon: 55.67 });
let RioDeJaneiro = weatherIn({ lat: -43.17, lon: -22.9 });
let Paris = weatherIn({ lat: 2.35, lon: 48.86 });

/*
Moscow.then(c => console.log(c));
Copenhagen.then(c => console.log(c));
RioDeJaneiro.then(c => console.log(c));
Paris.then(c => console.log(c));

fetchUniversities("University of Massachusetts").then(x => console.log(x));
fetchGeoCoord("University of Massachusetts Amherst").then(x => console.log(x));
fetchUMassWeather().then(x => console.log(x));
fetchUCalWeather().then(x => console.log(x));
*/

//this function compares weather in the given city to the weather in the given university
function printDif(city: number, cityN: string, uni: number, uniN: string) {
  if (city > uni) {
    console.log("Weather in " + uniN + " is lower than in " + cityN + " by " + (city - uni) + " degrees.");
  } else if (uni > city) {
    console.log("Weather in " + uniN + " is higher than in " + cityN + " by " + (uni - city) + " degrees.");
  } else {
    console.log("Weather in " + uniN + " is the same as in " + cityN + ".");
  }
}

//printing all the comparisons (using fetchUmassWeather and fetchUCalWeather)
fetchUMassWeather().then(r => {
  Moscow.then(c => {
    printDif(c, "Moscow", r.totalAverage, "University of Massachusetts");
  });
});

fetchUMassWeather().then(r => {
  Copenhagen.then(c => {
    printDif(c, "Copenhagen", r.totalAverage, "University of Massachusetts");
  });
});

fetchUMassWeather().then(r => {
  RioDeJaneiro.then(c => {
    printDif(c, "Rio de Janeiro", r.totalAverage, "University of Massachusetts");
  });
});

fetchUMassWeather().then(r => {
  Paris.then(c => {
    printDif(c, "Paris", r.totalAverage, "University of Massachusetts");
  });
});

fetchUCalWeather().then(r => {
  Moscow.then(c => {
    printDif(c, "Moscow", r.totalAverage, "University of California");
  });
});

fetchUCalWeather().then(r => {
  Copenhagen.then(c => {
    printDif(c, "Copenhagen", r.totalAverage, "University of California");
  });
});

fetchUCalWeather().then(r => {
  RioDeJaneiro.then(c => {
    printDif(c, "Rio de Janeiro", r.totalAverage, "University of California");
  });
});

fetchUCalWeather().then(r => {
  Paris.then(c => {
    printDif(c, "Paris", r.totalAverage, "University of California");
  });
});
