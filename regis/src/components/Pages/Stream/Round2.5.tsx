import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HeartBrokenRoundedIcon from '@mui/icons-material/HeartBrokenRounded';

const Round25 = () => {
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
      setAllTeams(querySnapshot.docs.map(extractTeam));
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

export default Round25;
