import { DocumentData } from 'firebase/firestore';
import QuestionDTO from './Question';
import { Topic } from './Topic';

export default RoundDTO;
export { type Round, NRound };

type QuestionID = string;
type TopicID = string;

interface RoundDTO {
  id: string;
  name: string;
  questions?: QuestionID[];
  topics?: TopicID[];
  phase?: number;
  current: QuestionID | TopicID;
}

interface Round {
  id: string;
  name: string;
  questions?: QuestionDTO[];
  topics?: Topic[];
  phase?: number;
  current: QuestionID | TopicID;
}

class NRound implements Round {
  id = '';
  name = '';
  questions = [];
  phase = 1;
  topics = [];
  current = '';
}

export const extractRound = (doc: DocumentData): RoundDTO => {
  const { name, questions, topics, phase, current } = doc.data() satisfies RoundDTO;

  return {
    id: doc.id,
    name,
    phase,
    questions,
    topics,
    current,
  };
};
