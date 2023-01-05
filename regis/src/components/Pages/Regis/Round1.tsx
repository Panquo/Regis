import {
  Button,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO from '../../Classes/Question';
import RoundDTO from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';
import { updateQuestion } from '../../Services/QuestionService';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';

const Round1 = (props: any) => {
  const initState = {
    roundName: 'damn',
    questions: [],
    teams: [],
  };
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);

  const [teams, setTeams] = useState<TeamDTO[]>();
  const [rounds, setRounds] = useState<RoundDTO[]>();
  const [questions, setQuestions] = useState<QuestionDTO[]>();
  const [state, setState] = useState<{
    roundName: string;
    questions: QuestionDTO[];
    teams: TeamDTO[];
  }>(initState);

  useEffect(() => {
    initTeams();
    initQuestions();
    initRounds();
    setSelected('');
  }, []);

  useEffect(() => {
    console.log(phase);
  }, [phase]);

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
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setTeams(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          eliminated: doc.data().eliminated,
          score: doc.data().score,
          phase: doc.data().phase,
        })),
      );
    });
  }

  function initQuestions() {
    const q = query(collection(db, 'questions'));

    onSnapshot(q, (querySnapshot) => {
      setQuestions(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          statement: doc.data().statement,
          answer: doc.data().answer,
          flavor: doc.data().flavor,
          points: doc.data().points,
          teamId: doc.data().teamId,
          status: doc.data().status,
        })),
      );
    });
  }

  function initRounds() {
    const q = query(collection(db, 'rounds'));

    onSnapshot(q, (querySnapshot) => {
      setRounds(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          status: doc.data().status,
          questions: doc.data().questions,
          current: doc.data().current,
        })),
      );
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
    };

    if (questions) {
      const qsts =
        rd?.questions.map(
          (item: string) => questions.find((question: QuestionDTO) => question.id === item) || qst,
        ) || [];
      const tms: TeamDTO[] = teams || [];

      setState({
        roundName: rd?.name || 'oups',
        questions: qsts,
        teams: tms,
      });
    }
  }

  function getIndexOfQuestion(id: string) {
    const question = state.questions.find((item: any) => item.id === id);

    if (question) return state.questions.indexOf(question);
  }

  function handlePreviousQuestion() {
    if (state.questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion !== 0) {
        setSelected(state.questions[actQuestion - 1].id);
      }
    }
  }
  function handleNextQuestion() {
    if (state.questions) {
      const actQuestion = getIndexOfQuestion(selected) || 0;

      if (actQuestion < state.questions.length) {
        setSelected(state.questions[actQuestion + 1].id);
      }
    }
  }

  function handleShowQuestion() {
    if (questions) {
      const question = state.questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 1;
        updateQuestion(question);
      }
    }
  }
  function handleShowAnswer() {
    if (questions) {
      const question = state.questions[getIndexOfQuestion(selected) || 0];

      if (question) {
        question.status = 2;
        updateQuestion(question);
      }
    }
  }
  function handleShowWinner() {
    if (questions) {
      const question = state.questions[getIndexOfQuestion(selected) || 0];

      if (question && question.teamId) {
        question.status = 3;
        updateQuestion(question);
        updateTeams();
      }
    }
  }
  function updateTeams() {
    if (state.questions) {
      for (const team of state.teams) {
        team.score[0] = state.questions
          .filter((item: QuestionDTO) => item.teamId === team.id)
          .map((item: QuestionDTO) => item.points)
          .reduce((acc, cur) => {
            return acc + cur;
          }, 0);
        updateTeam(team);
      }
    }
  }

  function handlePreviousRound() {
    if (phase === 2) {
      setPhase(1);
    }
  }
  function handleNextRound() {
    if (phase === 1) {
      setPhase(2);
    } else {
      navigate('/regis/round2');
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

          <h1>
            Ici le {state.roundName} (Phase {phase})
          </h1>
          <div className='table-content grow1'>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Réponse</TableCell>
                    <TableCell>Saveur</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Answered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.questions.map((question: QuestionDTO | undefined) => (
                    <TableRow
                      key={question?.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      selected={
                        questions
                          ? state.questions[getIndexOfQuestion(selected) || 0].id === question?.id
                          : false
                      }
                      className={question?.status ? 'answered' : 'not-answered'}
                    >
                      <TableCell component='th' scope='row'>
                        {question?.statement}
                      </TableCell>
                      <TableCell align='right'>{question?.answer}</TableCell>
                      <TableCell align='right'>{question?.flavor}</TableCell>
                      <TableCell align='right'>{question?.points}</TableCell>
                      <TableCell align='right'>
                        <InputLabel id='winnerTeam'>Gagnant</InputLabel>
                        <Select
                          labelId='winnerTeam'
                          value={
                            state.teams.find((item: TeamDTO) => question?.teamId === item.id)?.id
                          }
                          onChange={(event: any) => {
                            if (question) {
                              question.teamId = event.target.value;
                              console.log(event);

                              updateQuestion(question);
                            }
                          }}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {state.teams.map((item: TeamDTO) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {
                          state.teams.find((item: TeamDTO | undefined) => item?.id === question?.id)
                            ?.name
                        }
                      </TableCell>
                      <TableCell align='right'>{question?.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
