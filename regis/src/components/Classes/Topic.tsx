import QuestionDTO from './Question'

export default interface TopicDTO {
    id: string;
    name:string;
    status:number;
    questions:string[];
    current:number;
}

export interface Topic {
    id: string;
    name:string;
    status:number;
    questions:QuestionDTO[];
    current:number;
}
