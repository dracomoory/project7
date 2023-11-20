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
        .then((result: Response): object => result.ok ? result.json() : {})
        .then(
            (result: object) => {
                if (Array.isArray(result)) {
                    for (const elemObj of (result as object[])) {
                        if ("lat" in elemObj && "lon" in elemObj) {
                            return {
                                lat: Number.parseFloat(elemObj["lat"] as string),
                                lon: Number.parseFloat(elemObj["lon"] as string)
                            };
                        }
                    }
                }
                return Promise.reject<GeoCoord>(new Error("No results found for query."));
            }
        );
}

/*

** Below is an example is query is equal to "newyork"

[
  {
    place_id: 60064560,
    licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    powered_by: 'Map Maker: https://maps.co',
    osm_type: 'node',
    osm_id: 5479083558,
    boundingbox: [ '35.7250996', '35.7251996', '139.7629549', '139.7630549' ],
    lat: '35.7251496',
    lon: '139.7630049',
    display_name: 'NEWYORK, Shinobazu Dori, Sendagi 3-chome, Bunkyo, Tokyo, 〒110-0001, Japan',
    class: 'shop',
    type: 'yes',
    importance: 0.101
  }
]

* */
