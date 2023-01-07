import QuestionDTO from './Question';

export default TopicDTO;

export { type Topic, NTopic };

interface TopicDTO {
  id: string;
  name: string;
  status: number;
  questions: string[];
  current: string;
}

interface Topic {
  id: string;
  name: string;
  status: number;
  questions: QuestionDTO[];
  current: string;
}
class NTopic implements Topic {
  id = '';
  name = '';
  status = 0;
  questions = [];
  current = '';
}
