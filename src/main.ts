import fetch from "../include/fetch.js";
import * as readline from 'readline';
// import {GeoCoord} from "./fetchGeoCoord.js";
// import {fetchUniversities} from "./fetchUniversities.js";
// import {fetchGeoCoord} from "./fetchGeoCoord.js";
// import {fetchCurrentTemperature} from "./fetchCurrentTemperature.js";
// import {fetchUniversityWeather, fetchUMassWeather, fetchUCalWeather} from "./universityWeather.js";

// TODO - Now its your turn to make the working example! :)

class ConsoleAsker {
    private linereader: readline.Interface;

    public constructor() {
        this.linereader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    public askQuestion(question: string): Promise<string> {
        return new Promise<string>(
            (resolve) => {
                this.linereader.question(question, (answer) => {
                    resolve(answer);
                });
            }
        );
    }

    public close(): void {
        this.linereader.close();
    }
}

interface BookInfo {
    languages?: string[]; // [ { key: '/languages/eng' } ]
    number_of_pages?: number; // 1332
    publish_date?: string; // '2022'
    publishers?: string[]; // [ 'MIT Press' ]
    title?: string; // 'Introduction to Algorithms, Fourth Edition'
    created?: string; // { type: '/type/datetime', value: '2021-09-30T22:31:17.574194' }
    last_modified?: string;  //{ type: '/type/datetime', value: '2023-10-11T14:36:39.173425' }
}

// This function fetches the information of the book of a given ISBN.
function fetchISBN(isbn: string): Promise<BookInfo> {
    isbn = `https://openlibrary.org/isbn/${isbn}.json`;
    const resultedObj: BookInfo = {};
    return fetch(isbn)
        .then((result: Response): object => (result.ok ? result.json() : {}))
        .then((result: object): BookInfo | Promise<BookInfo> => {
            if ("languages" in result && Array.isArray(result["languages"])) {
                resultedObj.languages = [] as string[];
                result["languages"].forEach(
                    (obj: object): void => {
                        if ("key" in obj)
                            resultedObj.languages?.push(`${obj["key"] as string}`);
                    }
                );
            }
            if ("number_of_pages" in result) {
                resultedObj.number_of_pages = result["number_of_pages"] as number;
            }
            if ("publish_date" in result) {
                resultedObj.publish_date = `${result["publish_date"] as string}`;
            }
            if ("publishers" in result && Array.isArray(result["publishers"])) {
                resultedObj.publishers = [] as string[];
                result["publishers"].forEach(
                    (obj: string): void => {
                        resultedObj.publishers?.push(`${obj}`);
                    }
                )
            }
            if ("title" in result) {
                resultedObj.title = `${result["title"] as string}`;
            }
            if ("full_title" in result) {
                resultedObj.title = `${result["full_title"] as string}`;
            }
            if ("created" in result) {
                const cobj: object = result["created"] as object;
                if ("type" in cobj && "value" in cobj)
                    resultedObj.created = `${cobj["value"] as string}`;
            }
            if ("last_modified" in result) {
                const lmobj: object = result["last_modified"] as object;
                if ("type" in lmobj && "value" in lmobj)
                    resultedObj.last_modified = `${lmobj["value"] as string}`;
            }
            const pNames: string[] = Object.getOwnPropertyNames(resultedObj);
            return (pNames.length !== 0 && pNames.some((s: string): boolean => (s === "title"))) ?
                resultedObj :
                Promise.reject<BookInfo>(new Error("No results found for query."));
        });
}

// This function compares the number of pages between two books and tells which one has more and by how many.
async function comparePages(ISBN1: string, ISBN2: string): Promise<string> {
    const isbninfo1 = await fetchISBN(ISBN1);
    const isbninfo2 = await fetchISBN(ISBN2);
    return (isbninfo1.title !== undefined && isbninfo1.number_of_pages !== undefined &&
        isbninfo2.title !== undefined && isbninfo2.number_of_pages !== undefined) ?
        (
            (isbninfo1.number_of_pages > isbninfo2.number_of_pages) ?
                `"${isbninfo1.title}" has ${isbninfo1.number_of_pages - isbninfo2.number_of_pages} more pages than "${isbninfo2.title}".` :
                `"${isbninfo2.title}" has ${isbninfo2.number_of_pages - isbninfo1.number_of_pages} more pages than "${isbninfo1.title}".`
        ) :
        "Invalid Book!";
}

async function asymain(): Promise<void> {
    console.log("There is a demo output where ISBN1 is 9780262046305, and ISBN2 is 9780140328721. ");
    console.log(await comparePages('9780262046305', '9780140328721'));
    console.log("Now, please input your two ISBNs, and similar output will be shown as result! \n");
    const ca: ConsoleAsker = new ConsoleAsker();
    const isbn1: string = await ca.askQuestion('Please input your first ISBN: ');
    const isbn2: string = await ca.askQuestion('Please input your second ISBN: ');
    console.log(await comparePages(isbn1, isbn2));
    ca.close();
}

asymain();


// //this function finds the temperature average in a city given by its longitude and latitude (using fetchCurrentWeather)
// function weatherIn(c: GeoCoord) {
//     return fetchCurrentTemperature(c).then(result => {
//         return result.temperature_2m.reduce((s, a) => s + a, 0) / result.temperature_2m.length;
//     });
// }
//
// //finding average temperature for the following cities
// let Moscow = weatherIn({lat: 37.6, lon: 55.75});
// let Copenhagen = weatherIn({lat: 12.57, lon: 55.67});
// let RioDeJaneiro = weatherIn({lat: -43.17, lon: -22.9});
// let Paris = weatherIn({lat: 2.35, lon: 48.86});
//
// /*
// Moscow.then(c => console.log(c));
// Copenhagen.then(c => console.log(c));
// RioDeJaneiro.then(c => console.log(c));
// Paris.then(c => console.log(c));
//
// fetchUniversities("University of Massachusetts").then(x => console.log(x));
// fetchGeoCoord("University of Massachusetts Amherst").then(x => console.log(x));
// fetchUMassWeather().then(x => console.log(x));
// fetchUCalWeather().then(x => console.log(x));
// */
//
// //this function compares weather in the given city to the weather in the given university
// function printDif(city: number, cityN: string, uni: number, uniN: string) {
//     if (city > uni) {
//         console.log("Weather in " + uniN + " is lower than in " + cityN + " by " + (city - uni) + " degrees.");
//     } else if (uni > city) {
//         console.log("Weather in " + uniN + " is higher than in " + cityN + " by " + (uni - city) + " degrees.");
//     } else {
//         console.log("Weather in " + uniN + " is the same as in " + cityN + ".");
//     }
// }
//
// //printing all the comparisons (using fetchUmassWeather and fetchUCalWeather)
// fetchUMassWeather().then(r => {
//     Moscow.then(c => {
//         printDif(c, "Moscow", r.totalAverage, "University of Massachusetts");
//     });
// });
//
// fetchUMassWeather().then(r => {
//     Copenhagen.then(c => {
//         printDif(c, "Copenhagen", r.totalAverage, "University of Massachusetts");
//     });
// });
//
// fetchUMassWeather().then(r => {
//     RioDeJaneiro.then(c => {
//         printDif(c, "Rio de Janeiro", r.totalAverage, "University of Massachusetts");
//     });
// });
//
// fetchUMassWeather().then(r => {
//     Paris.then(c => {
//         printDif(c, "Paris", r.totalAverage, "University of Massachusetts");
//     });
// });
//
// fetchUCalWeather().then(r => {
//     Moscow.then(c => {
//         printDif(c, "Moscow", r.totalAverage, "University of California");
//     });
// });
//
// fetchUCalWeather().then(r => {
//     Copenhagen.then(c => {
//         printDif(c, "Copenhagen", r.totalAverage, "University of California");
//     });
// });
//
// fetchUCalWeather().then(r => {
//     RioDeJaneiro.then(c => {
//         printDif(c, "Rio de Janeiro", r.totalAverage, "University of California");
//     });
// });
//
// fetchUCalWeather().then(r => {
//     Paris.then(c => {
//         printDif(c, "Paris", r.totalAverage, "University of California");
//     });
// });
