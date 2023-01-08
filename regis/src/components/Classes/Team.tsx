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

export const extractTeam = (doc: DocumentData): TeamDTO => {
  const { name, eliminated, score, phase } = doc.data();

  return {
    id: doc.id,
    name,
    eliminated,
    score,
    phase,
  };
};
