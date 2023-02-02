import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { NQuestion } from '../../Classes/Question';
import RoundDTO, { NRound } from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';
import { fetchQuestion, updateQuestion } from '../../Services/QuestionService';
import { updatePhaseRound, updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';

const Round1 = () => {
  const navigate = useNavigate();
  //  TODO update score on phase end
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return allQuestions[currentQuestionIndex] || new NQuestion();
  }, [allQuestions, currentQuestionIndex]);

  const phaseTeams = useMemo(() => {
    return allTeams.filter((team) => team.phase === currentRound.phase);
  }, [allTeams, currentRound]);

  useEffect(() => {
    initRound();
    initTeams();
  }, []);

  useEffect(() => {
    if (currentRound.questions?.length) {
      initQuestions(currentRound);
    }
  }, [currentRound]);

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 1));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound({
        id: doc.id,
        name: doc.data().name,
        phase: doc.data().phase,
        questions: doc.data().questions,
        current: doc.data().current,
      });
    });
  };

  const initTeams = () => {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

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

  const initQuestions = async (currentRound: RoundDTO) => {
    const questions = await Promise.all(
      currentRound.questions!.map((questionId: string) => fetchQuestion(questionId)),
    );

    setAllQuestions(questions.sort((q1, q2) => q1.index - q2.index));
  };

  function handlePreviousQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  function handleNextQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleResetQuestion() {
    currentQuestion.status = 0;
    updateQuestion(currentQuestion);
    updateRound({ ...currentRound, current: currentQuestion.id });
  }
  function handleShowQuestion() {
    currentQuestion.status = 1;
    updateQuestion(currentQuestion);
  }

  function handleShowAnswer() {
    currentQuestion.status = 2;
    updateQuestion(currentQuestion);
  }
  function handleShowWinner() {
    updateTeams();
  }
  function handleHideQuestion() {
    currentQuestion.status = 3;
    updateQuestion(currentQuestion);
  }
  function updateTeams() {
    for (const team of phaseTeams) {
      team.score[0] = allQuestions
        .filter((item: QuestionDTO) => item.teamId === team.id)
        .map((item: QuestionDTO) => item.points)
        .reduce((acc, cur) => {
          return acc + cur;
        }, 0);
      updateTeam(team);
    }
  }

  function eliminateTeams() {
    for (const team of allTeams) {
      team.score[0] === 3
        ? updateTeam({ ...team, eliminated: false })
        : updateTeam({ ...team, eliminated: true });
    }
  }

  function handlePreviousRound() {
    if (currentRound.phase === 2) {
      updatePhaseRound(1, currentRound);
    }
  }
  function handleNextRound() {
    if (currentRound.phase === 1) {
      updatePhaseRound(2, currentRound);
    } else {
      eliminateTeams();
      navigate('/regis/round2');
    }
  }

  return (
    <>
      <div className='row wrapper'>
        <div className='col content'>
          <button onClick={() => navigate(-1)}>back</button>
          <div className='teams'>
            {allTeams?.map((team: TeamDTO) => (
              <div key={team.id} className='team-item'>
                <span>{team.name}</span>
                <span>{team.score}</span>
              </div>
            ))}
          </div>

          <h1>
            Ici le {currentRound.name} (Phase {currentRound.phase})
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
                  {allQuestions.map((question: QuestionDTO | undefined) => (
                    <TableRow
                      key={question?.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      selected={
                        allQuestions
                          ? allQuestions[currentQuestionIndex || 0].id === question?.id
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
                      <TableCell align='right'>{question?.teamId}</TableCell>
                      <TableCell align='right'>{question?.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <span>Stream</span>
          <div className='nav-question col'>
            <div className='grow1 row stream-board-list'>
              <Button variant='outlined' onClick={handleResetQuestion}>
                Reset Question
              </Button>
              <Button variant='outlined' onClick={handleShowQuestion}>
                Afficher Question
              </Button>
              <Button variant='outlined' onClick={handleShowAnswer}>
                Afficher Réponse
              </Button>
              <Button variant='outlined' onClick={handleShowWinner}>
                Afficher Vainqueur
              </Button>
              <Button variant='outlined' onClick={handleHideQuestion}>
                Cacher Question
              </Button>
            </div>
            <div>
              <Button variant='contained' onClick={handlePreviousQuestion} className='nav'>
                Question Précédente
              </Button>
              <Button variant='contained' onClick={handleNextQuestion} className='nav'>
                Question Suivante
              </Button>
            </div>
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
