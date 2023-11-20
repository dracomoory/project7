import {GeoCoord} from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";

export interface TemperatureReading {
    time: string[];
    temperature_2m: number[];
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
    // TODO
    /*
        @param a longitude and latitude
        @return a Promise that fulfils with a TemperatureReading object
                The "time" field should be an array of times.
                The "temperature_2m" field should be an array of corresponding temperature measurements.
    **/
    const query: string = `https://220.maxkuechen.com/currentTemperature/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m&temperature_unit=fahrenheit`;
    return fetch(query)
        .then((result: Response): object => result.ok ? result.json() : {})
        .then((jsonobj: object): object => "hourly" in jsonobj ? jsonobj["hourly"] as object : {})
        .then((hourlyobj: object): TemperatureReading => {
            const obj: TemperatureReading = {time: [], temperature_2m: []};
            if ("time" in hourlyobj && Array.isArray(hourlyobj["time"]))
                hourlyobj["time"].forEach(elem => obj.time.push("".concat(elem as string)));
            if ("temperature_2m" in hourlyobj && Array.isArray(hourlyobj["temperature_2m"]))
                hourlyobj["temperature_2m"].forEach(elem => obj.temperature_2m.push(Number.parseFloat(elem as string)));
            return obj;
        });
}
