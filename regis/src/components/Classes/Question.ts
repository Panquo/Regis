import { DocumentData } from 'firebase/firestore';

export default QuestionDTO;

export interface QuestionData {
  statement: string;
  answer: string;
  flavor: string;
  points: number;
  teamId: string;
  status: Status;
  index: number;
  answerStatus: AnswerStatus;
}

interface QuestionDTO extends QuestionData {
  id: string;
}

export class NQuestion implements QuestionDTO {
  id = '';
  statement = '';
  answer = '';
  flavor = '';
  points = 0;
  teamId = '';
  status = 0;
  index = -1;
  answerStatus = 0;
}

export enum AnswerStatus {
  'not-answered' = 0,
  'answered-right' = 1,
  'answered-wrong' = 2,
}

export enum Status {
  'not-answered' = 0,
  'selected' = 1,
  'answered' = 2,
}

export const extractQuestion = (doc: DocumentData): QuestionDTO => {
  const { statement, answer, flavor, points, teamId, status, index, answerStatus } =
    doc.data() satisfies QuestionDTO;

  return {
    id: doc.id,
    statement,
    answer,
    flavor,
    points,
    teamId,
    status,
    index,
    answerStatus,
  };
};
