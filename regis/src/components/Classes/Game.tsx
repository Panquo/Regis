import RoundDTO from './Round';

export default interface GameDTO {
    id:string,
    name:string;
    status:number;
    rounds:number[];
    current:number;
}
export interface Game {
    id:string,
    name:string;
    status:number;
    rounds:RoundDTO[];
    current:number;
}
