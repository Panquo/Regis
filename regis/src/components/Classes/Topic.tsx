import QuestionDTO from './Question'

export default interface TopicDTO {
    id: string;
    name:string;
    status:number;
    questions:string[];
    current:string;
}

export interface Topic {
    id: string;
    name:string;
    status:number;
    questions:QuestionDTO[];
    current:string;
}
export class NTopic implements Topic {
    id= "";
    name= "";
    status=0;
    questions= [];
    current="";

}