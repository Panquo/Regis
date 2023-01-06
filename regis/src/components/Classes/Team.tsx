interface TeamDTO {
  id: string;
  name: string;
  eliminated: boolean;
  life?: number;
  score: number[];
}

export default TeamDTO;
