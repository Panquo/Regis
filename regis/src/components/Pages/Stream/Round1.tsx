import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO, { extractQuestion, NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

const Round1 = () => {
  const navigate = useNavigate();

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
    const q = query(collection(db, 'rounds'), where('index', '==', 1));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));

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

  const initQuestions = (currentRound: RoundDTO) => {
    const q = query(
      collection(db, 'questions'),
      where(documentId(), 'in', currentRound.questions || ['5CCFsRQqEtRRMhv1x1BN']),
    );

    onSnapshot(q, (querySnapshot) => {
      setAllQuestions(querySnapshot.docs.map(extractQuestion));
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
      {currentQuestion.status === 1 ? (
        <div className='display-current-question col'>
          <div className='question-flavor-div'>
            <span className='question-flavor'>{currentQuestion.flavor}</span>
          </div>
          <span className='question-statement'>{currentQuestion.statement}</span>
        </div>
      ) : currentQuestion.status === 2 ? (
        <div className='display-current-question col'>
          <div className='question-flavor-div'>
            <span className='question-flavor'>{currentQuestion.flavor}</span>
          </div>
          <span className='question-statement'>{currentQuestion.statement}</span>
          <div className='question-answer-div'>
            <span className='question-answer'>
              <VerifiedRoundedIcon className='answer-icon' />
              {currentQuestion.answer}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Round1;
