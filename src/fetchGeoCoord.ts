import fetch from "../include/fetch.js";

export interface GeoCoord {
    lat: number;
    lon: number;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
    // TODO
    /*
          @param query string
          @return a Promise that fulfils with the first geo-coordinate result.
          If there are no results for a location (the result array is empty), then the promise should reject with an error identical to the one below:
                  new Error("No results found for query.");
    **/
    query = "https://220.maxkuechen.com/geoCoord/search?q=".concat(query);
    return fetch(query)
        .then((result: Response): object => (result.ok ? result.json() : {}))
        .then((result: object): GeoCoord | Promise<GeoCoord> => {
            if (Array.isArray(result)) {
                for (const elemObj of result as object[]) {
                    if ("lat" in elemObj && "lon" in elemObj) {
                        return {
                            lat: Number.parseFloat(elemObj["lat"] as string),
                            lon: Number.parseFloat(elemObj["lon"] as string),
                        };
                    }
                }
            }
            return Promise.reject<GeoCoord>(new Error("No results found for query."));
        });
}
