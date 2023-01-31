import { DocumentData } from 'firebase/firestore';

export default TeamDTO;

export interface TeamData {
  name: string;
  eliminated: boolean;
  life?: number;
  score: number[];
  phase: 1 | 2;
}

interface TeamDTO extends TeamData {
  id: string;
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
