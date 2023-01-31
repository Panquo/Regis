import QuestionDTO, { QuestionData } from './Question';
import { DocumentData } from 'firebase/firestore';

export default TopicDTO;

type QuestionID = string;
type TeamID = string;

export { type Topic, NTopic };

export interface TopicData {
  name: string;
  status: number;
  questions: QuestionData[];
  current: string;
  index: number;
  teamId: TeamID;
  gold?: boolean;
}

interface TopicDTO {
  id: string;
  name: string;
  status: number;
  questions: QuestionDTO[];
  current: QuestionID;
  index: number;
  teamId: TeamID;
  gold?: boolean;
}

interface Topic extends TopicData {
  id: string;
}

class NTopic implements Topic {
  id = '';
  name = '';
  gold = false;
  status = 0;
  questions = [];
  current = '';
  index = -1;
  teamId = '';
}

export const extractTopic = (doc: DocumentData): TopicDTO => {
  const { name, status, questions, current, index, teamId, gold } = doc.data() satisfies TopicDTO;

  return {
    id: doc.id,
    name,
    status,
    questions,
    current,
    index,
    teamId,
    gold,
  };
};
