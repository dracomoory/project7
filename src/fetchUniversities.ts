import fetch from "../include/fetch.js";

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO
  /*
        @param a query string
        @return a Promise that fulfils with an array of university names
        If there are no results (the returned JSON is an empty array), resolve to an empty array.
  **/
  query = "http://220.maxkuechen.com/universities/search?name=".concat(query);
  return fetch(query)
    .then((result: Response): object => (result.ok ? result.json() : {}))
    .then((jsonObj: object): string[] => {
      if (!Array.isArray(jsonObj)) return [] as string[];
      // now jsonObj is of object[]
      return jsonObj.reduce((acc: string[], elem: object) => {
        if ("name" in elem) acc.push("".concat(elem["name"] as string));
        return acc;
      }, [] as string[]);
    });
}
