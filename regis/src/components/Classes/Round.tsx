import QuestionDTO from "./Question";
import { Topic } from "./Topic";

export default interface RoundDTO {
    id:string;
    name:string;
    status:number;
    questions:string[]
    current:number;
}

export interface Round {
    id:string;
    name:string;
    status:number;
    questions?:QuestionDTO[],
    topics?:Topic[],
    current:number;
}
