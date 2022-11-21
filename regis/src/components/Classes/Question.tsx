
export default interface QuestionDTO {
    id:string;
    statement:string;
    answer:string;
    points:number;
    bonus:number;
    teamId:number;
    status:number;
}