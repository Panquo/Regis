import { DocumentData } from 'firebase/firestore';
import QuestionDTO from './Question';

export default TopicDTO;

export { type Topic, NTopic };

type QuestionID = string;
type TeamID = string;

interface TopicDTO {
  id: string;
  name: string;
  status: number;
  questions: QuestionID[];
  current: QuestionID;
  index: number;
  teamId: TeamID;
}

interface Topic {
  id: string;
  name: string;
  status: number;
  questions: QuestionDTO[];
  current: QuestionID;
  index: number;
  teamId: TeamID;
}
class NTopic implements Topic {
  id = '';
  name = '';
  status = 0;
  questions = [];
  current = '';
  index = -1;
  teamId = '';
}

export const extractTopic = (doc: DocumentData): TopicDTO => {
  const { name, status, questions, current, index, teamId } = doc.data() satisfies TopicDTO;

  return {
    id: doc.id,
    name,
    status,
    questions,
    current,
    index,
    teamId,
  };
};
