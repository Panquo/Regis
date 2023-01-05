import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const teams = [
  {
    id: 1,
    name: 'Team Uno',
    score: 0,
  },
  {
    id: 2,
    name: 'Team Dos',
    score: 0,
  },
  {
    id: 3,
    name: 'Team Tres',
    score: 0,
  },
  {
    id: 4,
    name: 'Team Quatro',
    score: 0,
  },
];

const Round1 = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Scoreboard</div>
      <div>Numéro question</div>
      <div>Intitulé question</div>
      <div>Réponse question</div>
      {teams.map((team) => (
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
      {teams.map((team) => (
        <Button key={team.id} variant='contained'>
          {team.name}
        </Button>
      ))}
      <Button variant='contained'>Valider</Button>
      <Button variant='contained'>Prochaine question</Button>
    </>
  );
};

export default Round1;
