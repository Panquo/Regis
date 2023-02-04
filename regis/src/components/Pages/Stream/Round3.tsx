import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { extractQuestion, NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { NTopic } from '../../Classes/Topic';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { fetchTopic } from '../../Services/TopicService';

interface TeamsQuestion {
  question: QuestionDTO;
  team: TeamDTO | undefined | null;
}

const Round3 = () => {
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[][]>([]);

  const [teamsQuestion, setTeamsQuestion] = useState<TeamsQuestion[]>([]);

  const [currentQuestions, setCurrentQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const currentQuestion: QuestionDTO = useMemo(() => {
    const curr =
      currentQuestions.find((question: QuestionDTO) => {
        const result = question.id === currentTopic.current;

        console.log(result);
        return result;
      }) || new NQuestion();

    console.log(curr);

    return curr;
  }, [currentQuestions, currentTopic.current]);

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

    if (currentRound.current) {
      setCurrentTopic(
        topics.find((topic: TopicDTO) => topic.id === currentRound.current) || new NTopic(),
      );
    }

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
      const result = querySnapshot.docs.map(extractQuestion);

      setTeamsQuestion(
        result
          .map((question: QuestionDTO) => ({
            question: question,
            team: currentTeams.find((team: TeamDTO) => team.id === question.teamId),
          }))
          .sort((tq1, tq2) => tq2.question.index - tq1.question.index),
      );
      console.log(result);

      setCurrentQuestions(result);
    });
  };

  useEffect(() => {
    initAllQuestions(allTopics);
  }, [allTopics]);

  useEffect(() => {
    if (currentTopic.questions?.length) {
      initCurrentQuestions(currentTopic);
    }
  }, [allQuestions, currentTopic]);

  const currentTeams = useMemo(() => {
    return allTeams.filter((team) => !team.eliminated);
  }, [allTeams, currentRound]);

  useEffect(() => {
    initRound();
    initTeams();
  }, []);

  useEffect(() => {
    if (currentRound.topics?.length) {
      initTopics(currentRound);
    }
  }, [currentRound]);

  return (
    <>
      <div className='display-teams-stream'>
        {currentTeams.map((team: TeamDTO) => {
          if (!teamsQuestion.find((item: TeamsQuestion) => item.team === team))
            return (
              <div key={team.id} className={'team-item col'}>
                <div className='team-name-div'>
                  <span className='team-name'>{team.name}</span>
                </div>
                <div className='team-score'>
                  <div className='team-round3'>{team.score[3]}</div>
                </div>
              </div>
            );
        })}
      </div>
      {currentRound.current ? (
        <>
          <QuestionDisplay
            currentQuestions={currentQuestions}
            currentQuestion={currentQuestion}
            currentTopic={currentTopic}
          />
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

const QuestionDisplay = (props: {
  currentTopic: TopicDTO;
  currentQuestion: QuestionDTO;
  currentQuestions: QuestionDTO[];
}) => {
  const { currentTopic, currentQuestion, currentQuestions } = props;

  if (currentTopic.current) {
    return (
      <div className='display-round3-topic'>
        <div className='display-round-3'>
          <div>{currentTopic.name}</div>
        </div>
        <div className='display-round-3-top'>
          <div>{currentTopic.name}</div>
        </div>
      </div>
    );
  }

  if (currentQuestion.status === 1) {
    return (
      <div className='display-round3-question'>
        <div className='display-round-3-topic-div'>
          <span className='display-round-3-topic'>{currentTopic.name}</span>
        </div>
        <div className='display-round-3-strength-div'>
          <span className='display-round-3-strength'>{`Question ${
            currentQuestions.indexOf(currentQuestion) + 1
          }`}</span>
        </div>
        <span className='display-round-3-statement'>{currentQuestion.statement}</span>
      </div>
    );
  }

  if (currentQuestion.status === 2) {
    return (
      <div className='display-round3-question'>
        <div className='display-round-3-topic-div'>
          <span className='display-round-3-topic'>{currentTopic.name}</span>
        </div>
        <div className='display-round-3-strength-div'>
          <span className='display-round-3-strength'>{`Question ${
            currentQuestions.indexOf(currentQuestion) + 1
          }`}</span>
        </div>
        <span className='question-statement'>{currentQuestion.statement}</span>
        <div className='question-answer-div'>
          <span className='question-answer'>
            <VerifiedRoundedIcon className='answer-icon' />
            {currentQuestion.answer}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default Round3;
