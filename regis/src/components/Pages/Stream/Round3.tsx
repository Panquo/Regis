import { Grid, Paper, styled } from '@mui/material';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../../firebase';
import QuestionDTO, { extractQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { NTopic } from '../../Classes/Topic';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Round2 = () => {
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[][]>([]);

  const [teamsQuestion, setTeamsQuestion] = useState<
    {
      question: QuestionDTO;
      team: TeamDTO | undefined | null;
    }[]
  >([]);

  const [currentQuestions, setCurrentQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const initRound = () => {
    const q = query(collection(db, 'rounds'), where('index', '==', 3));

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
        gold: doc.data().gold,
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
      const result = querySnapshot.docs.map(extractQuestion);

      console.log(result);

      setTeamsQuestion(
        result.map((question: QuestionDTO) => ({
          question: question,
          team: currentTeams.find((team: TeamDTO) => team.id === question.teamId),
        })),
      );

      setCurrentQuestions(result);
    });
  };

  useEffect(() => {
    initAllQuestions(allTopics);
  }, [allTopics]);
  useEffect(() => {
    console.log(currentTopic);

    if (currentTopic.questions?.length) {
      initCurrentQuestions(currentTopic);
    }
  }, [currentTopic]);

  console.log(teamsQuestion);

  const currentTeams = useMemo(() => {
    return allTeams.filter((team) => !team.eliminated);
  }, [allTeams, currentRound]);

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

  return (
    <>
      <div className='display-teams-stream'>
        {currentTeams.map((team: TeamDTO) => {
          if (!teamsQuestion.find((item: any) => item.team === team))
            return (
              <div key={team.id} className={'team-item col'}>
                <div className='team-name-div'>
                  <span className='team-name'>{team.name}</span>
                </div>
                <div className='team-score'>
                  {Array.from({ length: team.score[0] }, (_, index) => {
                    return <div key={index} className='valid-point point' />;
                  })}
                  {Array.from({ length: 3 - team.score[0] }, (_, index) => {
                    return <div key={index} className='empty-point point' />;
                  })}
                </div>
              </div>
            );
        })}
      </div>
      {currentRound.current ? (
        <>
          <div className='display-topics-stream'>
            <div className='stream-current-topic'>
              <div>{currentTopic.name}</div>
            </div>
            <div className='stream-current-topic-top'>
              <div>{currentTopic.name}</div>
            </div>
          </div>
          <div className='display-gauge-stream'>
            {Array.from({ length: 6 }, (_, index) => {
              return (
                <div key={index}>
                  <div className='gauge-item'>
                    <div className='empty-team' />
                    {teamsQuestion.length === 6 && teamsQuestion[index].team ? (
                      <div className='team-item col'>
                        <div className='team-name-div'>
                          <span className='team-name'>{teamsQuestion[index].team?.name}</span>
                        </div>
                        <div className='team-score'>
                          <div>{teamsQuestion[index].team?.score[3]}</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
};

export default Round2;
