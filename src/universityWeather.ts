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
    const obj: AverageTemperatureResults = {totalAverage: 0};
    let total = 0;
    let count = 0;

    return fetchUniversities(universityQuery)
        .then((x: string[]) => {
            return x.map((y: string) =>
                (transformName !== undefined ? fetchGeoCoord(transformName(y)) : fetchGeoCoord(y)).then((z: GeoCoord) =>
                    fetchCurrentTemperature(z).then((t: TemperatureReading) => {
                        obj[y] = t.temperature_2m.reduce((s, a) => s + a, 0) / t.temperature_2m.length;
                        total += obj[y];
                        ++count;

                        if (count === x.length) {
                            obj.totalAverage = total / count;
                        }
                        return obj;
                    })
                )
            );
        })
        .then(arr => Promise.all(arr).then(x => x[0]));
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
