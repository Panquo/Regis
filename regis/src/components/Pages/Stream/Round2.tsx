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
import { db } from '../../../firebase';
import QuestionDTO, { extractQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { NTopic } from '../../Classes/Topic';
import { updateRound } from '../../Services/RoundService';
import { updateTeam } from '../../Services/TeamService';
import { updateTopic } from '../../Services/TopicService';

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
    const q = query(collection(db, 'rounds'), where('index', '==', 2));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
  };

  const initTopics = (currentRound: RoundDTO) => {
    const q = query(
      collection(db, 'topics'),
      where(documentId(), 'in', currentRound.topics || ['5CCFsRQqEtRRMhv1x1BN']),
    );

    onSnapshot(q, (querySnapshot) => {
      const topics: TopicDTO[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        status: doc.data().status,
        questions: doc.data().questions,
        current: doc.data().current,
      }));

      if (currentRound.current) {
        setCurrentTopic(
          topics.find((topic: TopicDTO) => topic.id === currentRound.current) || new NTopic(),
        );
      }
      setAllTopics(topics);
    });
  };

  const initAllQuestions = (allTopics: TopicDTO[]) => {
    const questions: QuestionDTO[][] = [];

    for (const topic of allTopics) {
      const q = query(
        collection(db, 'questions'),
        where(documentId(), 'in', topic.questions || ['5CCFsRQqEtRRMhv1x1BN']),
      );

      onSnapshot(q, (querySnapshot) => {
        questions.push(querySnapshot.docs.map(extractQuestion));
      });
    }
    setAllQuestions(questions);
  };
  const initCurrentQuestions = (currentTopic: TopicDTO) => {
    const q = query(
      collection(db, 'questions'),
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

  function handleGridClick(topic: TopicDTO) {
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
      <div className='display-teams-stream'>
        {currentTeams.map((item: TeamDTO) => {
          return (
            <div
              key={item.id}
              className={`team-item col ${item.score[0] === 3 ? 'team-selected' : ''}`}
            >
              <div className='team-name-div'>
                <span className='team-name'>{item.name}</span>
              </div>
              <div className='team-score'>
                {Array.from({ length: item.score[0] }, (_, index) => {
                  return <div key={index} className='valid-point point' />;
                })}
                {Array.from({ length: 3 - item.score[0] }, (_, index) => {
                  return <div key={index} className='empty-point point' />;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className='display-topics-stream'>
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
              >
                <Item>{item.name}</Item>
              </Grid>
            );
          })}
        </Grid>
        {currentRound.current ? <div>Round</div> : null}
      </div>
    </>
  );
};

export default Round2;
