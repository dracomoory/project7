import {fetchUniversities} from "./fetchUniversities.js";
import {fetchGeoCoord, GeoCoord} from "./fetchGeoCoord.js";
import {fetchCurrentTemperature, TemperatureReading} from "./fetchCurrentTemperature.js";

interface AverageTemperatureResults {
    totalAverage: number;

    [key: string]: number;
}

export function fetchUniversityWeather(
    universityQuery: string,
    transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
    // TODO
    const resObj: AverageTemperatureResults = {totalAverage: 0};
    let total = 0;

    return fetchUniversities(universityQuery).then(
        (uNames: string[]): Promise<void>[] => uNames.map(
            (uName: string): Promise<void> => fetchGeoCoord(transformName !== undefined ? transformName(uName) : uName).then(
                (geoco: GeoCoord): Promise<void> => fetchCurrentTemperature(geoco).then(
                    (temper: TemperatureReading): void => {
                        resObj[uName] = (
                            temper.temperature_2m.length === 0 ?
                                0 :
                                temper.temperature_2m.reduce((s, a) => s + a, 0) / temper.temperature_2m.length
                        );
                        total += resObj[uName];
                    }
                )
            )
        )
    ).then(
        (proms: Promise<void>[]): Promise<AverageTemperatureResults> =>
            Promise.all(proms).then(
                (_: void[]): AverageTemperatureResults => {
                    if (_.length === 0) {
                        // return Promise.reject(new Error("No universities found."));
                        throw new Error("No universities found.");
                    }
                    resObj.totalAverage = total / _.length;
                    return resObj;
                }
            )
    );
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return fetchUniversityWeather("University of Massachusetts", x => {
        if (x === "University of Massachusetts at Amherst") return "University of Massachusetts Amherst";
        if (x === "University of Massachusetts at Lowell") return "University of Massachusetts Lowell";
        if (x === "University of Massachusetts at Dartmouth") return "University of Massachusetts Dartmouth";
        return x;
    });
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return fetchUniversityWeather("University of California");
}
