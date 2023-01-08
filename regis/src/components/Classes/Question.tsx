import { DocumentData } from 'firebase/firestore';

export default QuestionDTO;

interface QuestionDTO {
  id: string;
  statement: string;
  answer: string;
  flavor: string;
  points: number;
  teamId: string;
  status: number;
  index: number;
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
}

export enum Status {
  'not-answered' = 0,
  'selected' = 1,
  'answered' = 2,
}

export const extractQuestion = (doc: DocumentData): QuestionDTO => {
  const { statement, answer, flavor, points, teamId, status, index } =
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
  };
};
