
export default interface QuestionDTO {
    id:string;
    statement:string;
    answer:string;
    flavor:string;
    points:number;
    teamId:number;
    status:number;
}

export enum Status {
    "not-answered"=0,
    "selected"=1,
    "answered"=2,
}
