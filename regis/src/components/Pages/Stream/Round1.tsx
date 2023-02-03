import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, QUESTIONS_COLLECTION, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { extractQuestion, NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

const Round1 = () => {
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());

  const currentQuestion: QuestionDTO = useMemo(() => {
    return (
      allQuestions.find((question: QuestionDTO) => question.id === currentRound.current) ||
      new NQuestion()
    );
  }, [allQuestions, currentRound.current]);

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 1));

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

  const initQuestions = async (currentRound: RoundDTO) => {
    const q = query(collection(db, QUESTIONS_COLLECTION));

    onSnapshot(q, (querySnapshot) => {
      setAllQuestions(
        querySnapshot.docs
          .map(extractQuestion)
          .filter((question: QuestionDTO) =>
            currentRound.questions?.find((item: string) => item === question.id),
          ),
      );
    });
  };

  const phaseTeams = useMemo(() => {
    console.log(currentRound);

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

  return (
    <>
      <div className='display-teams-stream'>
        <div className='display-pool'>
          <span className='pool-icon'>&#128020;</span>
          <span className='pool-text'>Poule {currentRound.phase}</span>
        </div>
        {phaseTeams.map((item: TeamDTO) => {
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
      <QuestionDisplay currentQuestion={currentQuestion} />
    </>
  );
};

const QuestionDisplay = (props: { currentQuestion: QuestionDTO }) => {
  const { currentQuestion } = props;

  if (currentQuestion.status >= 1) {
    return (
      <div className='display-current-question col'>
        <div className='question-flavor-div'>
          <span className='question-flavor'>{currentQuestion.flavor}</span>
        </div>
        <span className='question-statement'>{currentQuestion.statement}</span>
        {currentQuestion.status === 2 && (
          <div className='question-answer-div'>
            <span className='question-answer'>
              <VerifiedRoundedIcon className='answer-icon' />
              {currentQuestion.answer}
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Round1;
