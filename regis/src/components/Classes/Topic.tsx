import QuestionDTO from './Question'

export default interface TopicDTO {
    id: string;
    name:string;
    status:number;
    questions:QuestionDTO[]
}