import { fetchUniversities } from "./fetchUniversities.js";
import { fetchGeoCoord, GeoCoord } from "./fetchGeoCoord.js";
import { fetchCurrentTemperature, TemperatureReading } from "./fetchCurrentTemperature.js";

interface AverageTemperatureResults {
    totalAverage: number;
    [key: string]: number;
}

export function fetchUniversityWeather(
    universityQuery: string,
    transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
    // TODO

    const obj: AverageTemperatureResults = { totalAverage: 0 };
    let total = 0;
    let count = 0;

    return fetchUniversities(universityQuery).then((x: string[]) => {
        x.forEach((y: string) =>
            (transformName !== undefined ? fetchGeoCoord(transformName(y)) : fetchGeoCoord(y)).then((z: GeoCoord) =>
                fetchCurrentTemperature(z).then((t: TemperatureReading) => {
                    obj[y] = t.temperature_2m.reduce((s, a) => s + a, 0) / t.temperature_2m.length;
                    total += obj[y];
                    ++count;
                })
            )
        );
        obj.totalAverage = total / count;
        return obj;
    });
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return fetchUniversityWeather("University of Massachusetts", x => {
        return x === "University of Massachussetts at Amherst" ? "University of Massachussetts Amherst" : x;
    });
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
    // TODO
    return fetchUniversityWeather("University of California");
}
