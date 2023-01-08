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
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO, { NQuestion } from '../../Classes/Question';
import RoundDTO, { NRound, Round } from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';
import TopicDTO, { NTopic, Topic } from '../../Classes/Topic';
import { updateRound } from '../../Services/RoundService';
import { updateTopic } from '../../Services/TopicService';
import { getScores } from '../../utils/TeamUtils';

const round: Round = {
  id: '',
  name: '',
  topics: [],
  current: '',
};

const Round3 = () => {
  const initState = {
    round: round,
    teams: [],
  };
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const navigate = useNavigate();

  const [teams, setTeams] = useState<TeamDTO[]>();
  const [chosenTopic, setChosenTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicDTO[]>([]);
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
    initTopics();
    setSelectedQuestion('');
  }, []);

  useEffect(() => {
    init();
  }, [teams, questions, rounds]);

  useEffect(() => {
    if (rounds && topics && state.round.topics) {
      const round = rounds.find((item: any) => item.id === state.round.id);
      const topic = topics.find((item: TopicDTO) => item.id === chosenTopic);

      if (round && topic) {
        round.current = chosenTopic || '';
        setSelectedQuestion(topic.current);
      }
      console.log(state.round);

      updateRound(round || new NRound());
    }
  }, [chosenTopic]);

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
          index: doc.data().index,
        })),
      );
    });
  }
  function initTopics() {
    const q = query(collection(db, 'topics'));

    onSnapshot(q, (querySnapshot) => {
      setTopics(
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
  function initRounds() {
    const q = query(collection(db, 'rounds'));

    onSnapshot(q, (querySnapshot) => {
      setRounds(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          status: doc.data().status,
          questions: doc.data().questions,
          topics: doc.data().topics,
          current: doc.data().current,
        })),
      );
    });
  }

  function init() {
    const rd = rounds?.find((item: RoundDTO) => item.id === 'ZpImBTffpzTI2Tlv0AtE');

    if (topics) {
      const tpcs =
        rd?.questions?.map((questionId: string) => {
          const topic = topics.find((topic: TopicDTO) => topic.id === questionId);

          console.log(topics, questionId, topic);
          if (topic) {
            const tpc = {
              ...topic,
              questions: topic.questions.map(
                (topicQuestionId: string) =>
                  questions?.find((question: QuestionDTO) => topicQuestionId === question.id) ||
                  new NQuestion(),
              ),
            };

            return tpc;
          } else {
            return new NTopic();
          }
        }) || [];
      const round: Round = {
        id: rd?.id || '',
        name: rd?.name || '',
        topics: tpcs,
        current: rd?.current || '',
      };
      const tms: TeamDTO[] = teams || [];

      setState({
        round: round,
        teams: tms,
      });
    }
  }
  function getIndexOfQuestion(id: string) {
    if (state.round.topics) {
      const index = getIndexOfTopic(chosenTopic || '');
      const question = state.round.topics[index || 0].questions.find((item: any) => item.id === id);

      if (question) return state.round.topics[index || 0].questions.indexOf(question);
    }
  }

  function getIndexOfTopic(id: string) {
    const topic = state.round.topics?.find((item: any) => item.id === id);

    if (topic) return state.round.topics?.indexOf(topic);
  }

  function handlePreviousQuestion() {
    if (state.round.topics) {
      const actQuestion = getIndexOfQuestion(selectedQuestion);
      const actTopic = getIndexOfTopic(chosenTopic || '') || 0;

      if (actQuestion && actQuestion !== 0) {
        setSelectedQuestion(state.round.topics[actTopic].questions[actQuestion - 1].id);
      }
    }
  }
  function handleNextQuestion() {
    if (state.round.topics) {
      const actQuestion = getIndexOfQuestion(selectedQuestion);
      const actTopic = getIndexOfTopic(chosenTopic || '') || 0;

      if (
        actQuestion !== null &&
        actQuestion !== undefined &&
        actQuestion < state.round.topics.length
      ) {
        setSelectedQuestion(state.round.topics[actTopic].questions[actQuestion + 1].id);
      }
    }
  }

  function handleShowTopic() {
    if (topics) {
      const topic = topics.find((item: TopicDTO) => item.id === selectedTopic);

      if (topic) {
        topic.status = 1;
        topic.current = topic.questions[0];
        setSelectedQuestion(topic.current);

        updateTopic(topic);
      }
    }
    setChosenTopic(selectedTopic);
    setSelectedTopic('');
  }

  function handleNextTopic() {
    if (topics) {
      const topic = topics.find((item: TopicDTO) => item.id === chosenTopic);

      if (topic) {
        topic.status = 2;
        updateTopic(topic);
        updateTeams();
      }
    }
    setChosenTopic(null);
  }

  function updateTeams() {
    setTeams(
      teams?.map((team: TeamDTO) => ({
        ...team,
        score: [getScores(team.id, state.round), team.score[1], team.score[2], team.score[3]],
      })),
    );
  }

  function handleItemClick(item: any) {
    if (item.status !== 2) setSelectedTopic(item.id);
  }

  function handlePreviousRound() {
    navigate('/regis/round25');
  }

  function handleNextRound() {
    // navigate('/regis/endGame');
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
                    {state.round.topics
                      ?.find((item: Topic) => item.id === chosenTopic)
                      ?.questions.map((question: QuestionDTO | undefined) => (
                        <TableRow
                          key={question?.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                          selected={selectedQuestion === question?.id}
                          className={question?.status ? 'answered' : 'not-answered'}
                        >
                          <TableCell component='th' scope='row'>
                            {question?.statement}
                          </TableCell>
                          <TableCell align='right'>{question?.answer}</TableCell>
                          <TableCell align='right'>{question?.flavor}</TableCell>
                          <TableCell align='right'>{question?.points}</TableCell>
                          <TableCell align='right'>
                            {
                              state.teams.find((item: TeamDTO) => item.id === question?.teamId)
                                ?.name
                            }
                          </TableCell>
                          <TableCell align='right'>{question?.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <List>
                {state.round.topics?.map((item: Topic) => {
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
            <Button variant='contained' onClick={handlePreviousQuestion} className='nav'>
              Question Précédente
            </Button>
            <div className='grow1 row stream-board-list'>
              <Button variant='outlined' onClick={handleShowTopic}>
                Afficher Theme
              </Button>
              <Button variant='outlined' onClick={handleNextTopic}>
                Thème Suivant
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

export default Round3;
