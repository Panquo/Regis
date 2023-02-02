import { Button } from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { AnswerStatus, extractQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, Round } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import { updateQuestion } from '../../Services/QuestionService';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';
import PlayerDisplaySwitcher from './PlayerDisplaySwitcher';

const round: Round = {
  id: '',
  name: '',
  topics: [],
  current: '',
};

const Round1 = () => {
  const initState = {
    round: round,
    teams: [],
  };
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const [teams, setTeams] = useState<TeamDTO[]>();
  const [rounds, setRounds] = useState<RoundDTO[]>();
  const [questions, setQuestions] = useState<QuestionDTO[]>();
  const [state, setState] = useState<{
    round: Round;
    teams: TeamDTO[];
  }>(initState);

  useEffect(() => {
    initTeams();
    initQuestions();
    initRounds();
    setSelected('');
  }, []);

  useEffect(() => {
    init();
  }, [teams, questions, rounds]);

  useEffect(() => {
    if (rounds) {
      const round = rounds[0];

      round.current = selected;
      updateRound(round);
    }
  }, [selected]);

  function initTeams() {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setTeams(querySnapshot.docs.map(extractTeam));
    });
  }
  function initQuestions() {
    const q = query(collection(db, QUESTIONS_COLLECTION));

    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map(extractQuestion));
    });
  }
  function initRounds() {
    const q = query(collection(db, ROUNDS_COLLECTION));

    onSnapshot(q, (querySnapshot) => {
      setRounds(querySnapshot.docs.map(extractRound));
    });
  }

  function init() {
    const rd = rounds?.find((item: RoundDTO) => item.id === '5Jv20rWadBAd4ZmKxNBq');

    const qst: QuestionDTO = {
      id: '',
      statement: '',
      answer: '',
      flavor: '',
      points: 0,
      teamId: '',
      status: 0,
      index: -1,
      answerStatus: AnswerStatus['not-answered'],
    };

    if (questions) {
      const qsts =
        rd?.questions?.map(
          (item: string) => questions.find((question: QuestionDTO) => question.id === item) || qst,
        ) || [];
      const tms: TeamDTO[] = teams || [];
      const round: Round = {
        id: rd?.id || '',
        name: rd?.name || '',
        questions: qsts,
        current: rd?.current || '',
      };

      setState({
        round: round,
        teams: tms,
      });
    }
  }

  function getIndexOfQuestion(id: string) {
    const question = state.round.questions?.find((item: any) => item.id === id);

    if (question) return state.round.questions?.indexOf(question);
  }

  function handlePreviousQuestion() {
    if (state.round.questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion !== 0) {
        setSelected(state.round.questions[actQuestion - 1].id);
      }
    }
  }
  function handleNextQuestion() {
    if (state.round.questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion < state.round.questions.length) {
        setSelected(state.round.questions[actQuestion + 1].id);
      }
    }
  }

  function handleShowQuestion() {
    if (state.round.questions) {
      const question = state.round.questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 1;
        updateQuestion(question);
      }
    }
  }
  function handleShowAnswer() {
    if (state.round.questions) {
      const question = state.round.questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 2;
        updateQuestion(question);
      }
    }
  }
  function handleShowWinner() {
    if (state.round.questions) {
      const question = state.round.questions[getIndexOfQuestion(selected) || 0];

      if (question && question.teamId) {
        question.status = 3;
        updateQuestion(question);
        updateTeams();
      }
    }
  }
  function updateTeams() {
    if (state.round.questions) {
      for (const team of state.teams) {
        team.score[0] = state.round.questions
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
    if (teams) {
      const scores = teams.sort((a, b) => {
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

  return (
    <>
      <div className='row wrapper'>
        <div className='col content'>
          <button onClick={() => navigate(-1)}>back</button>
          <div className='teams'>
            {teams?.map((team: TeamDTO) => (
              <div key={team.id} className='team-item'>
                <span>{team.name}</span>
                <span>{team.score}</span>
              </div>
            ))}
          </div>

          <h1>Ici le {state.round.name}</h1>
          <div className='table-content grow1'>
            <div>
              {state.teams.map((item: TeamDTO) => (
                <div key={item.id}>
                  <span>Vies : {item.life}</span>
                  <Button onClick={() => handleRemoveLife(item)}>-</Button>
                </div>
              ))}
            </div>
          </div>
          <span>Stream</span>
          <div className='nav-question row'>
            <Button variant='contained' onClick={handlePreviousQuestion} className='nav'>
              Question Précédente
            </Button>
            <div className='grow1 row stream-board-list'>
              <Button variant='outlined' onClick={handleShowQuestion}>
                Afficher Question
              </Button>
              <Button variant='outlined' onClick={handleShowAnswer}>
                Afficher Réponse
              </Button>
              <Button variant='outlined' onClick={handleShowWinner}>
                Afficher Vainqueur
              </Button>
            </div>
            <Button variant='contained' onClick={handleNextQuestion} className='nav'>
              Question Suivante
            </Button>
          </div>
          <PlayerDisplaySwitcher />
        </div>
        <div className='col side-panel'>
          <div className='soundboard'></div>
          <div className='nav-panel'>
            <Button onClick={handlePreviousRound}>Manche Précédente</Button>
            <Button onClick={handleNextRound}>Manche Suivante</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Round1;
