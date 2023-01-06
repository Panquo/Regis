import { Button } from '@mui/material';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO, { NQuestion } from '../../Classes/Question';
import RoundDTO, { NRound } from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';
import { updateQuestion } from '../../Services/QuestionService';

const Round1 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentPhase, setPhase] = useState<1 | 2>(1);
  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return allQuestions[currentQuestionIndex] || new NQuestion();
  }, [allQuestions, currentQuestionIndex]);

  const initRound = () => {
    const q = query(collection(db, 'rounds'), where('index', '==', 1));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound({
        id: doc.id,
        name: doc.data().name,
        status: doc.data().status,
        questions: doc.data().questions,
        current: doc.data().current,
      });
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
      setAllQuestions(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          statement: doc.data().statement,
          answer: doc.data().answer,
          flavor: doc.data().flavor,
          points: doc.data().points,
          teamId: doc.data().teamId,
          status: doc.data().status,
        })),
      );
    });
  };

  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const phaseTeams = useMemo(
    () => allTeams.filter((team) => team.phase === currentPhase),
    [allTeams],
  );

  initRound();
  initTeams();

  useEffect(() => {
    if (currentRound.questions.length) {
      initQuestions(currentRound);
    }
  }, [currentRound]);

  return (
    <>
      <div>Round 1 - Poule {currentPhase}</div>
      <div>Scoreboard</div>
      <div>Numéro question : {currentQuestionIndex}</div>
      <div>Statement : {currentQuestion?.statement}</div>
      <div>Answer : {currentQuestion?.answer}</div>
      {phaseTeams.map((team) => (
        <div key={team.id}>
          {team.name} : {team.score}
        </div>
      ))}
      <Button variant='outlined' onClick={() => navigate(-1)}>
        back
      </Button>
      <Button disabled variant='outlined' onClick={() => navigate('/presentator/round2')}>
        Round 2
      </Button>

      <hr />

      {phaseTeams.map((team) => {
        const isSelected = selectedTeam === team.id;

        return (
          <Button
            key={team.id}
            variant='contained'
            color={isSelected ? 'success' : 'info'}
            onClick={() => setSelectedTeam(isSelected ? '' : team.id)}
          >
            {team.name}
          </Button>
        );
      })}

      <hr />

      <Button
        variant='contained'
        onClick={() => {
          // Give +1 to selected team
          updateQuestion({
            ...currentQuestion,
            teamId: selectedTeam,
          });
          setSelectedTeam('');
        }}
      >
        Valider
      </Button>
      <Button variant='contained' onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
        Prochaine question
      </Button>
      <Button
        variant='outlined'
        color='secondary'
        // disabled={currentPhase === 2}
        onClick={() => setPhase(currentPhase === 1 ? 2 : 1)}
      >
        {currentPhase === 2 ? 'Précédente' : 'Prochaine'}
      </Button>
    </>
  );
};

export default Round1;
