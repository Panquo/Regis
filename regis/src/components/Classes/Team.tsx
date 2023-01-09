import { DocumentData } from 'firebase/firestore';

export default TeamDTO;

interface TeamDTO {
  id: string;
  name: string;
  eliminated: boolean;
  life?: number;
  score: number[];
  phase: 1 | 2;
}

export class NTeam implements TeamDTO {
  id = '';
  name = '';
  eliminated = false;
  life = -1;
  score = [0, 0, 0, 0];
  phase = 1 as 1 | 2;
}

export const extractTeam = (doc: DocumentData): TeamDTO => {
  const { name, eliminated, score, phase, life } = doc.data() satisfies TeamDTO;

  return {
    id: doc.id,
    name,
    eliminated,
    score,
    phase,
    life,
  };
};
