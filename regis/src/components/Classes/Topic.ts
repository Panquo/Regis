import { QuestionData } from './Question';

export default TopicDTO;

export { type Topic, NTopic };

export interface TopicData {
  name: string;
  status: number;
  questions: QuestionData[];
  current: string;
}

interface TopicDTO {
  id: string;
  name: string;
  status: number;
  questions: string[];
  current: string;
}

interface Topic extends TopicData {
  id: string;
}

class NTopic implements Topic {
  id = '';
  name = '';
  status = 0;
  questions = [];
  current = '';
}
