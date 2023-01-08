import { Button } from '@mui/material';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO, { extractQuestion, NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import { updateQuestion } from '../../Services/QuestionService';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HeartBrokenRoundedIcon from '@mui/icons-material/HeartBrokenRounded';

const Round1 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return allQuestions[currentQuestionIndex] || new NQuestion();
  }, [allQuestions, currentQuestionIndex]);

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
      setAllTeams(querySnapshot.docs.map(extractTeam));
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
    console.log(allTeams);
    return allTeams.filter((team) => team.eliminated);
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
        {phaseTeams.map((item: TeamDTO) => {
          return (
            <div
              key={item.id}
              className={`team-item col ${item.life === 0 ? 'team-eliminated' : ''}`}
            >
              <div className='team-name-div'>
                <span className='team-name'>{item.name}</span>
              </div>
              <div className='team-life'>
                {Array.from({ length: item.life || 0 }, (_, index) => {
                  return <FavoriteRoundedIcon key={item.id} className='life-left life' />;
                })}
                {Array.from({ length: 2 - (item.life || 0) }, (_, index) => {
                  return <HeartBrokenRoundedIcon key={index} className='life-empty life' />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Round1;
