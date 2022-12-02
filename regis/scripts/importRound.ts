import yaml from 'yaml';
import { readFileSync } from "fs";

const importRound1 = async (data: object) => {

};

const importRound2 = async (data: object) => {

};

const importRound25 = async (data: object) => {

};

const importRound3 = async (data: object) => {

};



const IMPORT_ROUND = {
  1: importRound1,
  2: importRound2,
  2.5: importRound25,
  3: importRound3,
}

const importRound = async (roundFile: string) => {
  const fileContent = readFileSync(roundFile, 'utf8');
  const data = yaml.parse(fileContent)
  const round: 1|2|2.5|3 = data.round;

  console.log(`Importing Round ${round}`);
  IMPORT_ROUND[round](data);
}

process.argv.slice(2).forEach(async (arg) => {
  console.log(`Processing file ${arg}`);
  await importRound(arg);
});

