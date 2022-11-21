import QuestionDTO from './Question'
import TopicDTO from './Topic';

export default interface RoundDTO {
    id:string;
    name:string;
    status:number;
    questions:QuestionDTO[]|TopicDTO[]
}