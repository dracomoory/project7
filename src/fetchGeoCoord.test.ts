import assert from "assert";
import {fetchGeoCoord} from "./fetchGeoCoord.js";

describe("fetchGeoCoord", () => {
    it("follows type specification", () => {
        const promise = fetchGeoCoord("University of Massachusetts Amherst");
        return promise.then(result => {
            assert(typeof result === "object"); //  Assert the result is an object
            assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
        });
    });
    it('finds info correctly (expected results may be temporary???)', () => {
        const prom = fetchGeoCoord("newyork");
        prom.then(
            result => {
                assert(typeof result === "object"); //  Assert the result is an object
                assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
                // assert(result.lon === 139.7630049);
                // assert(result.lat === 35.7251496);
            }
        );
    });
    it('rejects errors correctly', () => {
        const prom = fetchGeoCoord("");
        prom.then(
            _result => _result,
            (error: Error) => {
                assert(error.message === "No results found for query.");
            }
        );
    });
});
