import { readFileSync } from "fs";
import readXlsxFile from 'read-excel-file/node';
import { readSheetNames } from "read-excel-file/node";

/**
 * Import each sheet of a .xlsx file into a Round object
 * @param fileName name of the .xlsx file to parse in data directory
 * @returns an array of populated Round objects
 * @throws if the file is not a .xlsx file
 */
async function importXlsx(fileName: string) {
    const file = readFileSync(fileName);

    const rounds = Array();
    const sheetNames = await readSheetNames(file);
    for (let i = 0; i < sheetNames.length; i++) {
        let sheetName = sheetNames[i];
        console.log(sheetName, sheetNames);
        rounds.push(parseRound(
            (await readXlsxFile(file, { sheet: sheetName }))
                .map(r => r.map(c => c + "")), sheetName
        ));
    }
    return rounds;
}

/**
 * Imports a Round from a .tsv file
 * @param fileName name of the .tsv file to parse in data directory
 * @param roundName name of the round
 * @returns the populated Round object
 */
function importFile(fileName: string, roundName: string) {
    // import file
    const data = readFileSync("../data/" + fileName, "utf8");

    // split file into lines
    const lines = data.split("\n");
    return parseRound(lines.map((l: string) => l.split('\t')), roundName);
}

/**
 * Parses data into a Round object
 * @param lines data to parse
 * @param roundName name of the round
 * @returns the populated Round object
 */
function parseRound(lines: string[][], roundName: string) {
    switch (lines[0].length) {
        case 3:
            return parseQuestions(roundName, lines);
        case 4:
            if (lines[0][0] === "topic") return parseTopics(roundName, lines);
            if (lines[0][0] === "flavor")
                return parseQuestions(roundName, lines, true);
            break;
        default:
            console.error("non");
    }
}

/**
 * Parses a .tsv file into a Round object with Questions (flavor or regular)
 * @param roundName name of the round
 * @param lines lines of the .tsv file
 * @param flavor whether or not the questions are flavor questions
 * @returns the populated Round object
 */
function parseQuestions(roundName: string, lines: string[][], flavor = false) {
    let questions = Array();
    lines.forEach((columns, i) => {
        if (i === 0) return; // skip header

        // import question
        questions.push({
            //id: "",
            statement: columns[+flavor + 0],
            answer: columns[+flavor + 1],
            points: parseInt(columns[+flavor + 2]) ?? 0,
            bonus: 0,
            teamId: undefined,
            status: 0,
            ...(flavor && { flavor: columns[0] }),
        });
    });

    return {
        //id: "",
        status: 0,
        name: roundName,
        questions: questions,
    };
}

/**
 * Parses a .tsv file into a Round object with Topics
 * @param roundName name of the round
 * @param lines lines of the .tsv file
 * @returns the populated Round object
 */
function parseTopics(roundName: string, lines: string[][]) {
    let topics = Array();
    lines.forEach((columns, i) => {
        if (i === 0) return; // skip header
        // split line into columns

        let topic = topics.find((topic) => topic.name === columns[0] + "");
        if (!topic) {
            topics.push({
                id: "",
                name: columns[0],
                questions: [],
                status: 0,
            });
            topic = topics[topics.length - 1];
        }

        // import question & topic
        topic.questions.push({
            id: "",
            statement: columns[1],
            answer: columns[2],
            points: parseInt(columns[3]) ?? 0,
            bonus: 0,
            teamId: 0,
            status: 0,
        });
    });

    return {
        //id: "",
        status: 0,
        name: roundName,
        questions: topics,
    };
}

// console.log(
//     "------------",
//     importFile("../data/IMPORT_QUESTIONS_FIREBASE.tsv", "La manche 1")
// );
// console.log(
//     "________________£",
//     importFile("../data/IMPORT_TOPICS_FIREBASE.tsv", "Di(x)manche")
// );

importXlsx("../data/data.xlsx").then(console.log);

// run with :
// ts-node-esm import.ts