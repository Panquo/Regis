import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
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
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { extractQuestion, NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { NTopic } from '../../Classes/Topic';
import { updateQuestion } from '../../Services/QuestionService';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';
import { fetchTopic, updateTopic } from '../../Services/TopicService';
import PlayerDisplaySwitcher from './PlayerDisplaySwitcher';

const Round3 = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const navigate = useNavigate();

  const [chosenTopic, setChosenTopic] = useState<string | null>(null);
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[][]>([]);

  const [currentQuestions, setCurrentQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return currentQuestions[currentQuestionIndex] || new NQuestion();
  }, [allQuestions, currentQuestionIndex]);
  const currentTopic: TopicDTO = useMemo(() => {
    return allTopics[currentTopicIndex] || new NTopic();
  }, [allQuestions, currentTopicIndex]);

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 3));

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

  const initTopics = async (currentRound: RoundDTO) => {
    const topics = await Promise.all(
      currentRound.topics!.map((topicId: string) => fetchTopic(topicId)),
    );

    setAllTopics(topics);
  };

  const initAllQuestions = (allTopics: TopicDTO[]) => {
    const questions: QuestionDTO[][] = [];

    for (const topic of allTopics) {
      const q = query(
        collection(db, QUESTIONS_COLLECTION),
        where(documentId(), 'in', topic.questions || ['5CCFsRQqEtRRMhv1x1BN']),
      );

      onSnapshot(q, (querySnapshot) => {
        const result = querySnapshot.docs.map(extractQuestion);

        console.log(result);
        questions.push(result);
      });
    }

    setAllQuestions(questions);
  };
  const initCurrentQuestions = (currentTopic: TopicDTO) => {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where(documentId(), 'in', currentTopic.questions || ['5CCFsRQqEtRRMhv1x1BN']),
    );

    onSnapshot(q, (querySnapshot) => {
      setCurrentQuestions(querySnapshot.docs.map(extractQuestion));
    });
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
    if (currentRound.topics?.length) {
      initTopics(currentRound);
    }
  }, [currentRound]);

  function handlePreviousTopic() {
    setCurrentTopicIndex(currentTopicIndex - 1);
  }
  function handleNextTopic() {
    setCurrentTopicIndex(currentTopicIndex + 1);
  }

  useEffect(() => {
    initAllQuestions(allTopics);
  }, [allTopics]);
  useEffect(() => {
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
    updateRound({ ...currentRound, current: selectedTopic });
    if (allTopics) {
      const topic = allTopics.find((item: TopicDTO) => item.id === selectedTopic);

      if (topic) {
        topic.status = 1; // TODO: Use Enum value
        topic.current = (topic.questions[0] as QuestionDTO).id;
        updateTopic(topic);
      }
    }
    setChosenTopic(selectedTopic);
    setSelectedTopic('');
  }

  function handleNewTopic() {
    if (allTopics) {
      const topic = allTopics.find((item: TopicDTO) => item.id === chosenTopic);

      if (topic) {
        topic.status = 2; // TODO: Use Enum value
        updateTopic(topic);
        updateTeams();
      }
    }
    setChosenTopic(null);
    updateRound({ ...currentRound, current: '' });
  }

  function handleResetQuestion() {
    currentQuestion.status = 0; // TODO: Use Enum value
    updateQuestion(currentQuestion);
    updateTopic({ ...currentTopic, current: currentQuestion.id });
  }
  function handleShowQuestion() {
    currentQuestion.status = 1; // TODO: Use Enum value
    updateQuestion(currentQuestion);
  }

  function handleShowAnswer() {
    currentQuestion.status = 2; // TODO: Use Enum value
    updateQuestion(currentQuestion);
  }
  function handleShowWinner() {
    updateTeams();
  }
  function handleHideQuestion() {
    currentQuestion.status = 3; // TODO: Use Enum value
    updateQuestion(currentQuestion);
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

  function handleItemClick(topic: TopicDTO) {
    if (topic.status !== 2) setSelectedTopic(topic.id);
  }

  function handlePreviousRound() {
    navigate('/regis/round1');
  }

  function handleNextRound() {
    navigate('/regis/round25');
  }

  return (
    <>
      <div className='row wrapper'>
        <div className='col content'>
          <button onClick={() => navigate(-1)}>back</button>
          <div className='teams'>
            {currentTeams.map((team: TeamDTO) => (
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
                        <TableCell align='right'>
                          {currentTeams.find((item: TeamDTO) => item.id === question?.teamId)?.name}
                        </TableCell>
                        <TableCell align='right'>{question?.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <List>
                {allTopics.map((item: TopicDTO) => {
                  return (
                    <ListItem
                      key={item.id}
                      disablePadding
                      className={
                        item.status === 2
                          ? 'answeredTopic'
                          : selectedTopic === item.id
                          ? 'selectedTopic'
                          : ''
                      }
                    >
                      <ListItemButton
                        onClick={() => handleItemClick(item)}
                        selected={selectedTopic === item?.id}
                      >
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </div>
          <span>Stream</span>
          <div className='nav-question row'>
            {chosenTopic ? (
              <>
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
                  <div className='grow1 row'>
                    <Button
                      variant='contained'
                      onClick={handlePreviousQuestion}
                      className='nav'
                      disabled={currentQuestionIndex === 0}
                    >
                      Question Précédente
                    </Button>
                    <Button variant='outlined' onClick={handleNewTopic} className='nav'>
                      Nouveau Thème
                    </Button>
                    <Button
                      variant='contained'
                      onClick={handleNextQuestion}
                      className='nav'
                      disabled={currentQuestionIndex === currentQuestions.length - 1}
                    >
                      Question Suivante
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className='grow1 row stream-board-list'>
                <Button variant='outlined' onClick={handlePreviousTopic}>
                  Thème précédent
                </Button>
                <Button variant='outlined' onClick={handleShowTopic}>
                  Afficher Thème
                </Button>
                <Button variant='outlined' onClick={handleNextTopic}>
                  Thème suivant
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

export default Round3;
