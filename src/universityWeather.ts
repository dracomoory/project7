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
    let count = 0;

    return fetchUniversities(universityQuery).then(
        (uNames: string[]): Promise<AverageTemperatureResults>[] => {
            return uNames.map(
                (uName: string): Promise<AverageTemperatureResults> =>
                    fetchGeoCoord(transformName !== undefined ? transformName(uName) : uName).then(
                        (geoco: GeoCoord) =>
                            fetchCurrentTemperature(geoco).then(
                                (temper: TemperatureReading) => {
                                    resObj[uName] = (
                                        temper.temperature_2m.length === 0 ?
                                            0 :
                                            temper.temperature_2m.reduce((s, a) => s + a, 0) / temper.temperature_2m.length
                                    );
                                    total += resObj[uName];
                                    ++count;
                                    if (count === uNames.length) {
                                        resObj.totalAverage = total / count;
                                    }
                                    return resObj;
                                }
                            )
                    )
            );
        }
    ).then(
        arr => Promise.all(arr).then(x => x[0])
    );
    // return fetchUniversities(universityQuery).then(
    //     (uNames: string[]): Promise<AverageTemperatureResults> => {
    //         if (uNames.length === 0)
    //             return Promise.reject<AverageTemperatureResults>(new Error("No results found for query."));
    //         const resultedObj: AverageTemperatureResults = {totalAverage: 0};
    //         let total: number = 0;
    //         let count: number = 0;
    //         uNames.forEach(
    //             (uName: string): void => {
    //                 fetchGeoCoord(transformName !== undefined ? transformName(uName) : uName).then(
    //                     (geoco: GeoCoord): void => {
    //                         fetchCurrentTemperature(geoco).then(
    //                             (temper: TemperatureReading): void => {
    //                                 resultedObj[uName] = (
    //                                     temper.temperature_2m.length === 0 ?
    //                                         0 :
    //                                         temper.temperature_2m.reduce((acc, elem) => acc + elem, 0) / temper.temperature_2m.length
    //                                 );
    //                                 total += resultedObj[uName];
    //                                 ++count;
    //                             }
    //                         );
    //                     }
    //                 );
    //             }
    //         );
    //         resultedObj.totalAverage = total / count;
    //         return Promise.resolve(resultedObj);
    //     }
    // );
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
