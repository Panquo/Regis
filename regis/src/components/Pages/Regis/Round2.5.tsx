import { Button } from '@mui/material';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { AnswerStatus, extractQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound, Round } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import { updateTeam } from '../../Services/TeamService';
import PlayerDisplaySwitcher from './PlayerDisplaySwitcher';

const Round25 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>();
  const [round, setRound] = useState<RoundDTO>(new NRound());

  useEffect(() => {
    initTeams();
    initRound();
  }, []);

  function initTeams() {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
  }

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 2.5));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  function eliminateTeams() {
    if (allTeams) {
      const scores = allTeams.sort((a, b) => {
        return (a.life || 0) - (b.life || 0);
      });
      const winner = scores.splice(-1, 1);

      updateTeam({ ...winner[0], eliminated: false });
    }
  }

  function handlePreviousRound() {
    navigate('/regis/round2');
  }
  function handleNextRound() {
    eliminateTeams();
    navigate('/regis/round3');
  }

  function handleRemoveLife(team: TeamDTO) {
    if (team.life) {
      team.life -= 1;
      updateTeam(team);
    }
  }

  function handleAddLife(team: TeamDTO) {
    if (team.life) {
      team.life += 1;
      updateTeam(team);
    }
  }

  return (
    <>
      <div className='row wrapper'>
        <div className='col content'>
          <button onClick={() => navigate(-1)}>back</button>

          <h1>Ici le {round.name}</h1>
          <div className='table-content grow1'>
            <div className='remove-life'>
              {allTeams
                ?.filter((team) => team.eliminated)
                .map((item: TeamDTO) => (
                  <div key={item.id} className='remove-life--item'>
                    <span className='remove-life--item--name'>{item.name}</span>
                    <span>Vies : {item.life}</span>
                    <Button className='remove-life--button' onClick={() => handleRemoveLife(item)}>
                      -
                    </Button>
                    <Button className='remove-life--button' onClick={() => handleAddLife(item)}>
                      +
                    </Button>
                  </div>
                ))}
            </div>
          </div>
          <PlayerDisplaySwitcher />
        </div>
        <div className='col side-panel'>
          <div className='soundboard'></div>
          <div className='nav-panel'>
            <Button onClick={handlePreviousRound}>Manche Précédente</Button>
            <Button onClick={handleNextRound}>Manche Suivante</Button>
          </div>
          <div className='teams'>
            {allTeams?.map((team: TeamDTO) => (
              <div key={team.id} className='team-item'>
                <span>{team.name}</span>
                <span>{team.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Round25;
