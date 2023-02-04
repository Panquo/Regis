/* eslint-disable no-console */
import yaml from 'yaml';
import { readFileSync } from 'fs';
import { addDoc, collection } from 'firebase/firestore';

import { QuestionData } from '../components/Classes/Question';
import { db } from '../firebase.js';
import { TopicData } from '../components/Classes/Topic';

const FIREBASE = {
  QUESTIONS_COLLECTION: 'questions',
  ROUNDS_COLLECTION: 'rounds',
  TOPICS_COLLECTION: 'topics',
};

const QUESTION_DEFAULT = {
  answerStatus: 0,
  points: 1,
  status: 0,
  teamId: '',
};

interface FileData {
  round: number;
  questions?: QuestionData[];
  topics?: TopicData[];
}

const addQuestion = async (question: QuestionData): Promise<string> => {
  const docRef = await addDoc(collection(db, FIREBASE.QUESTIONS_COLLECTION), question);

  return docRef.id;
};

const addTopic = async (topic: TopicData): Promise<string> => {
  const { questions: firebaseQuestions } = topic;

  const questionsIds = await Promise.all(
    firebaseQuestions.map((question: QuestionData) => addQuestion(question)),
  );

  const docRef = await addDoc(collection(db, FIREBASE.TOPICS_COLLECTION), {
    ...topic,
    questions: questionsIds,
  });

  return docRef.id;
};

const importRound1 = async (data: FileData) => {
  const { questions } = data;

  const firebaseQuestions = questions?.map((question: QuestionData, index: number) => {
    const { statement, answer, flavor } = question;

    return {
      index,
      statement,
      answer,
      flavor,
      ...QUESTION_DEFAULT,
    };
  });

  if (!firebaseQuestions) {
    return;
  }

  const questionsIds = await Promise.all(
    firebaseQuestions.map((question: QuestionData) => addQuestion(question)),
  );

  const round = {
    curent: '',
    index: 1,
    name: 'Manche 1',
    phase: 1,
    questions: questionsIds,
  };

  await addDoc(collection(db, FIREBASE.ROUNDS_COLLECTION), round);
};

const importRound2 = async (data: FileData) => {
  const { topics } = data;

  const firebaseTopics = topics?.map((topic: TopicData, index: number) => {
    const { name, questions } = topic;

    const firebaseQuestions = questions?.map((question: QuestionData, index: number) => {
      const { statement, answer } = question;

      return {
        index,
        statement,
        answer,
        flavor: '',
        ...QUESTION_DEFAULT,
      };
    });

    return {
      index,
      name,
      questions: firebaseQuestions,
      current: '',
      status: 0,
      teamId: '',
    };
  });

  if (!firebaseTopics) {
    return;
  }

  const topicsIds = await Promise.all(firebaseTopics.map((topic: TopicData) => addTopic(topic)));

  const round = {
    curent: '',
    index: 2,
    name: 'Manche 2',
    topics: topicsIds,
  };

  await addDoc(collection(db, FIREBASE.ROUNDS_COLLECTION), round);
};

const importRound25 = async (data: FileData) => {
  const { questions } = data;

  const firebaseQuestions = questions?.map((question: QuestionData, index: number) => {
    const { statement, answer } = question;

    return {
      index,
      statement,
      answer,
      flavor: '',
      ...QUESTION_DEFAULT,
    };
  });

  if (!firebaseQuestions) {
    return;
  }

  const questionsIds = await Promise.all(
    firebaseQuestions.map((question: QuestionData) => addQuestion(question)),
  );

  const round = {
    curent: '',
    index: 2.5,
    name: 'Manche 2.5',
    questions: questionsIds,
  };

  await addDoc(collection(db, FIREBASE.ROUNDS_COLLECTION), round);
};

const importRound3 = async (data: FileData) => {
  const { topics } = data;

  const firebaseTopics = topics?.map((topic: TopicData, index: number) => {
    const { name, questions } = topic;

    const firebaseQuestions = questions?.map((question: QuestionData, index: number) => {
      const { statement, answer } = question;

      return {
        ...QUESTION_DEFAULT,
        index,
        statement,
        answer,
        flavor: '',
        points: index + 1,
      };
    });

    return {
      index,
      name,
      questions: firebaseQuestions,
      current: '',
      status: 0,
      teamId: '',
    };
  });

  if (!firebaseTopics) {
    return;
  }

  const topicsIds = await Promise.all(firebaseTopics.map((topic: TopicData) => addTopic(topic)));

  const round = {
    curent: '',
    index: 3,
    name: 'Manche 3',
    topics: topicsIds,
  };

  await addDoc(collection(db, FIREBASE.ROUNDS_COLLECTION), round);
};

const IMPORT_ROUND = {
  1: importRound1,
  2: importRound2,
  2.5: importRound25,
  3: importRound3,
};

const importRound = async (roundFile: string) => {
  const fileContent = readFileSync(roundFile, 'utf8');
  const data = yaml.parse(fileContent);
  const round: 1 | 2 | 2.5 | 3 = data.round;

  console.log(`💾 Importing Round ${round}`);
  await IMPORT_ROUND[round](data);
  console.log(`✅ Round ${round} imported successfully`);
};

const processFiles = async (argv: string[]) => {
  for (const file of argv.slice(2)) {
    console.log(`\nProcessing file 📄 ${file}`);
    await importRound(file);
  }
  process.exit(0);
};

/**
 * Commande use:
 * $ ts-node-esm ./scripts/importRounds.ts ./data/qpui1/round1.yaml ./data/qpui1/round2.yaml ./data/qpui1/round25.yaml ./data/qpui1/round3.yaml
 */

await processFiles(process.argv);
