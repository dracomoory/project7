import assert from "assert";
import {fetchUniversities} from "./fetchUniversities.js";
import {fetchGeoCoord} from "./fetchGeoCoord";

describe("fetchUniversities", () => {
    it("follows type specification", () => {
        const promise = fetchUniversities("University of Massachusetts at Amherst");
        return promise.then(result => {
            assert(Array.isArray(result)); // Assert the result in an array
        });
    });
    it('finds info correctly (expected results may be temporary???)', () => {
        const prom = fetchUniversities("university of massachusetts");
        prom.then(
            result => {
                assert(Array.isArray(result)); // Assert the result in an array
                // assert(result[0] === 'University of Massachusetts at Amherst');
                // assert(result[1] === 'University of Massachusetts at Dartmouth');
            }
        );
    });
});
