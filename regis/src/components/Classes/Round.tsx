import QuestionDTO from "./Question";
import { Topic } from "./Topic";

export default interface RoundDTO {
    id:string;
    name:string;
    status:number;
    questions:string[]
    current:string;
}

export interface Round {
    id:string;
    name:string;
    status:number;
    questions?:QuestionDTO[],
    topics?:Topic[],
    current:string;
}

export class NRound implements Round {
    id="";
    name="";
    status=0;
    questions=[]
    topics=[]
    current="";
}
