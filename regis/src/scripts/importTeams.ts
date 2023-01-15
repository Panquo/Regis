/* eslint-disable no-console */
import yaml from 'yaml';
import { readFileSync } from 'fs';
import { addDoc, collection } from 'firebase/firestore';

import { db } from '../firebase.js';
import { TeamData } from '../components/Classes/Team';

const FIREBASE = {
  TEAMS_COLLECTION: 'teams-test',
};

const addTeam = async (team: TeamData): Promise<string> => {
  const docRef = await addDoc(collection(db, FIREBASE.TEAMS_COLLECTION), team);

  return docRef.id;
};

const importTeams = async (teamFile: string) => {
  const fileContent = readFileSync(teamFile, 'utf8');
  const { teams } = yaml.parse(fileContent);

  console.log('💾 Importing teams');

  const firebaseTeams = teams?.map((team: TeamData) => {
    const { name, phase } = team;

    return {
      name,
      phase,
      eliminated: false,
      life: 2,
      score: [0, 0, 0, 0],
    };
  });

  await Promise.all(firebaseTeams.map((team: TeamData) => addTeam(team)));

  console.log('✅ Teams imported successfully');
};

const processFile = async (argv: string[]) => {
  const file = argv[2];

  console.log(`\nProcessing file 📄 ${file}`);
  await importTeams(file);
};

/**
 * Commande use:
 * $ ts-node-esm ./scripts/importTeams.ts ./data/qpui1/teams.yaml
 */

await processFile(process.argv);
