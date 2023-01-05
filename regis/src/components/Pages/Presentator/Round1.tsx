import { Button } from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import TeamDTO from '../../Classes/Team';

const Round1 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);

  const [currentPhase, setPhase] = useState<1 | 2>(1);

  const initTeams = () => {
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          eliminated: doc.data().eliminated,
          score: doc.data().score,
          phase: doc.data().phase,
        })),
      );
    });
  };

  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const phaseTeams = useMemo(
    () => allTeams.filter((team) => team.phase === currentPhase),
    [allTeams],
  );

  initTeams();

  return (
    <>
      <div>Scoreboard</div>
      <div>Numéro question</div>
      <div>Intitulé question</div>
      <div>Réponse question</div>
      {phaseTeams.map((team) => (
        <div key={team.id}>
          {team.name} : {team.score}
        </div>
      ))}
      <Button variant='outlined' onClick={() => navigate(-1)}>
        back
      </Button>
      <Button disabled variant='outlined' onClick={() => navigate('/presentator/round2')}>
        Round 2
      </Button>
      {phaseTeams.map((team) => {
        const isSelected = selectedTeam === team.id;

        return (
          <Button
            key={team.id}
            variant='contained'
            color={isSelected ? 'success' : 'info'}
            onClick={() => setSelectedTeam(isSelected ? '' : team.id)}
          >
            {team.name}
          </Button>
        );
      })}
      <Button
        variant='contained'
        onClick={() => {
          // Give +1 to selected team
          setSelectedTeam('');
        }}
      >
        Valider
      </Button>
      <Button variant='contained'>Prochaine question</Button>
    </>
  );
};

export default Round1;
