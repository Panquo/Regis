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
  current: QuestionID | TopicID;
}

interface Round {
  id: string;
  name: string;
  questions?: QuestionDTO[];
  topics?: Topic[];
  current: QuestionID | TopicID;
}

class NRound implements Round {
  id = '';
  name = '';
  questions = [];
  topics = [];
  current = '';
}

export const extractRound = (doc: DocumentData): RoundDTO => {
  const { name, questions, topics, current } = doc.data() satisfies RoundDTO;

  return {
    id: doc.id,
    name,
    questions,
    topics,
    current,
  };
};
