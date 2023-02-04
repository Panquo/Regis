import { Button } from '@mui/material';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { AnswerStatus, extractQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound, Round } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import { updateQuestion } from '../../Services/QuestionService';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';
import PlayerDisplaySwitcher from './PlayerDisplaySwitcher';

const Round25 = () => {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>();
  const [round, setRound] = useState<RoundDTO>(new NRound());
  const [questions, setQuestions] = useState<QuestionDTO[]>();

  useEffect(() => {
    initTeams();
    initQuestions();
    initRound();
    setSelected('');
  }, []);

  function initTeams() {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
  }
  function initQuestions() {
    const q = query(collection(db, QUESTIONS_COLLECTION));

    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map(extractQuestion));
    });
  }

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 2));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  function getIndexOfQuestion(id: string) {
    const question = round.questions?.find((item: any) => item.id === id);

    if (question) return round.questions?.indexOf(question);
  }

  function handlePreviousQuestion() {
    if (questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion !== 0) {
        setSelected(questions[actQuestion - 1].id);
      }
    }
  }
  function handleNextQuestion() {
    if (questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion < questions.length) {
        setSelected(questions[actQuestion + 1].id);
      }
    }
  }

  function handleShowQuestion() {
    if (questions) {
      const question = questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 1;
        updateQuestion(question);
      }
    }
  }
  function handleShowAnswer() {
    if (questions) {
      const question = questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 2;
        updateQuestion(question);
      }
    }
  }
  function handleShowWinner() {
    if (round.questions) {
      const question = questions![getIndexOfQuestion(selected) || 0];

      if (question && question.teamId) {
        question.status = 3;
        updateQuestion(question);
        updateTeams();
      }
    }
  }
  function updateTeams() {
    if (questions) {
      for (const team of allTeams!) {
        team.score[0] = questions
          .filter((item: QuestionDTO) => item.teamId === team.id)
          .map((item: QuestionDTO) => item.points)
          .reduce((acc, cur) => {
            return acc + cur;
          }, 0);
        updateTeam(team);
      }
    }
  }

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
