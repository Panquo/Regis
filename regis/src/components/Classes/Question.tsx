export default QuestionDTO;

interface QuestionDTO {
  id: string;
  statement: string;
  answer: string;
  flavor: string;
  points: number;
  teamId: string;
  status: number;
}

export class NQuestion implements QuestionDTO {
  id = '';
  statement = '';
  answer = '';
  flavor = '';
  points = 0;
  teamId = '';
  status = 0;
}

export enum Status {
  'not-answered' = 0,
  'selected' = 1,
  'answered' = 2,
}
