import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO from '../../Classes/Team';

const Round1 = () => {
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());

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

  const phaseTeams = useMemo(() => {
    console.log(currentRound);

    return allTeams.filter((team) => team.phase === currentRound.phase);
  }, [allTeams, currentRound]);

  useEffect(() => {
    initRound();
    initTeams();
  }, []);

  return (
    <>
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
    </>
  );
};

export default Round1;
