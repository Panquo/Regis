export default TeamDTO;

interface TeamDTO {
  id: string;
  name: string;
  eliminated: boolean;
  score: number[];
  phase: 1 | 2;
}
