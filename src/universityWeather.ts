import {fetchUniversities} from "./fetchUniversities";
import {fetchGeoCoord} from "./fetchGeoCoord";
import {fetchCurrentTemperature} from "./fetchCurrentTemperature";

interface AverageTemperatureResults {
    totalAverage: number;

    [key: string]: number;
}

export function fetchUniversityWeather(
    universityQuery: string,
    transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
    // TODO
    let totalAvg = 0;
    let obj: AverageTemperatureResults;
    let count = 0;
    let sum = 0;

    if (typeof universityQuery !== "string") {
        return Promise.reject(new Error("Query must be a string"));
    }

    if (universityQuery === "") {
        return Promise.reject(new Error("Query is empty"));
    }

    const p = fetchUniversities(universityQuery).then(arr => {
        if (arr.length === 0) {
            return Promise.reject(new Error("No results found for query."));
        }
        return arr.map(x =>
            ((transformName !== undefined) ? fetchGeoCoord(transformName(x)) : fetchGeoCoord(x)).then(y =>
                fetchCurrentTemperature(y).then(z => {
                    count += 1;
                    z["temperature_2m"].map(e => (sum += e));

                    obj[x] = sum / z["temperature_2m"].length;
                    totalAvg += obj[x];

                    sum = 0;

                    if (count === arr.length) {
                        obj["totalAverage"] = totalAvg / arr.length;
                    }
                    return obj;
                })
            )
        );
    });

    const newP = p.then(arr => Promise.all(arr).then(x => x[0]));
    return newP;
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return new Promise(res => res({totalAverage: NaN}));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return new Promise(res => res({totalAverage: NaN}));
}
