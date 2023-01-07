interface TeamDTO {
  id: string;
  name: string;
  eliminated: boolean;
  life?: number;
  score: number[];
  phase: 1 | 2;
}
export default TeamDTO;
