import RoundDTO from './Round';

export default interface GameDTO {
    id:string,
    name:string;
    status:number;
    rounds:RoundDTO[];
    current:number;
}
