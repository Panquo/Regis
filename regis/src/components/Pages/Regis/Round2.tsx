import {
  Button,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION, TOPICS_COLLECTION } from '../../../firebase';
import QuestionDTO from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { extractTopic, NTopic } from '../../Classes/Topic';
import { fetchQuestion } from '../../Services/QuestionService';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';
import { updateTopic } from '../../Services/TopicService';
import PlayerDisplaySwitcher from './PlayerDisplaySwitcher';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Round2 = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const navigate = useNavigate();

  const [chosenTopic, setChosenTopic] = useState<string | null>(null);
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[][]>([]);

  const [currentQuestions, setCurrentQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 2));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
  };

  const initTopics = (currentRound: RoundDTO) => {
    const q = query(
      collection(db, TOPICS_COLLECTION),
      where(documentId(), 'in', currentRound.topics || ['5CCFsRQqEtRRMhv1x1BN']),
    );

    onSnapshot(q, (querySnapshot) => {
      const topics: TopicDTO[] = querySnapshot.docs.map(extractTopic);

      if (currentRound.current) {
        setCurrentTopic(
          topics.find((topic: TopicDTO) => topic.id === currentRound.current) || new NTopic(),
        );
      }
      setAllTopics(topics);
    });
  };

  const getTopicQuestions = async (topic: TopicDTO) => {
    const questions = await Promise.all(
      (topic.questions as string[])!.map((questionId: string) => fetchQuestion(questionId)),
    );

    return questions.sort((q1, q2) => q1.index - q2.index);
  };

  const initAllQuestions = async (allTopics: TopicDTO[]) => {
    const questions: QuestionDTO[][] = [];

    for (const topic of allTopics) {
      const topicQuestions = await getTopicQuestions(topic);

      questions.push(topicQuestions);
    }
    setAllQuestions(questions);
  };

  const initCurrentQuestions = async (currentTopic: TopicDTO) => {
    const questions = await Promise.all(
      (currentTopic.questions as string[])!.map((questionId: string) => fetchQuestion(questionId)),
    );

    setCurrentQuestions(questions.sort((q1, q2) => q1.index - q2.index));
  };

  const currentTeams = useMemo(
    () => allTeams.filter((team) => !team.eliminated),
    [allTeams, currentRound],
  );

  useEffect(() => {
    initRound();
    initTeams();
  }, []);

  useEffect(() => {
    console.log(currentRound);

    if (currentRound.topics?.length) {
      initTopics(currentRound);
    }
  }, [currentRound]);

  useEffect(() => {
    initAllQuestions(allTopics);
  }, [allTopics]);
  useEffect(() => {
    console.log(currentTopic);

    if (currentTopic.questions?.length) {
      initCurrentQuestions(currentTopic);
    }
  }, [currentTopic]);

  function handlePreviousQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }
  function handleNextQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleShowTopic() {
    console.log(currentRound);

    updateRound({ ...currentRound, current: selectedTopic });
    if (allTopics) {
      const topic = allTopics.find((item: TopicDTO) => item.id === selectedTopic);

      if (topic) {
        topic.status = 1;
        topic.current = topic.questions[0];
        updateTopic(topic);
      }
    }
    setChosenTopic(selectedTopic);
    setSelectedTopic('');
  }

  function handleNextTopic() {
    console.log(currentRound);

    updateRound({ ...currentRound, current: '' });
    if (allTopics) {
      const topic = allTopics.find((item: TopicDTO) => item.id === chosenTopic);

      if (topic) {
        topic.status = 2;
        updateTopic(topic);
        updateTeams();
      }
    }
    setChosenTopic(null);
  }

  function updateTeams() {
    for (const team of currentTeams) {
      team.score[1] = allQuestions
        .map((top: QuestionDTO[]) =>
          top
            .filter((item: QuestionDTO) => item.teamId === team.id)
            .map((item: QuestionDTO) => {
              const pts = item.points;

              return pts;
            })
            .reduce((acc, cur) => acc + cur, 0),
        )
        .reduce((acc, cur) => acc + cur, 0);

      updateTeam(team);
    }
  }
  function eliminateTeams() {
    const scores = allTeams.sort((team1, team2) =>
      team1.score[1] < team2.score[1] ? 1 : team1.score[1] > team2.score[1] ? -1 : 0,
    );
    const eliminated = scores.splice(0, 2);

    for (const team of eliminated) {
      updateTeam({ ...team, eliminated: true });
    }
  }

  function handleGridClick(topic: TopicDTO) {
    if (topic.status !== 2) setSelectedTopic(topic.id);
  }

  function handlePreviousRound() {
    navigate('/regis/round1');
  }

  function handleNextRound() {
    eliminateTeams();
    navigate('/regis/round25');
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

          <h1>Ici le {currentRound.name}</h1>
          <div className='table-content grow1'>
            {chosenTopic ? (
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
                    {currentQuestions.map((question: QuestionDTO | undefined) => (
                      <TableRow
                        key={question?.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                        selected={currentQuestions[currentQuestionIndex].id === question?.id}
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
            ) : (
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {allTopics.map((item: TopicDTO) => {
                  return (
                    <Grid
                      key={item.id}
                      className={
                        item.status === 2
                          ? 'answeredTopic'
                          : selectedTopic === item.id
                          ? 'selectedTopic'
                          : ''
                      }
                      item
                      xs={4}
                      onClick={() => handleGridClick(item)}
                    >
                      <Item>{item.name}</Item>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </div>
          <span>Stream</span>
          <div className='nav-question row'>
            {chosenTopic ? (
              <>
                <Button variant='contained' onClick={handlePreviousQuestion} className='nav'>
                  Question Précédente
                </Button>
                <div className='grow1 row stream-board-list'>
                  <Button variant='outlined' onClick={handleNextTopic}>
                    Thème Suivant
                  </Button>
                </div>

                <Button variant='contained' onClick={handleNextQuestion} className='nav'>
                  Question Suivante
                </Button>
              </>
            ) : (
              <div className='grow1 row stream-board-list'>
                <Button variant='outlined' onClick={handleShowTopic}>
                  Afficher Theme
                </Button>
              </div>
            )}
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

export default Round2;
