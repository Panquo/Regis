import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TopicDTO, { NTopic } from '../../Classes/Topic';
import { fetchTopic } from '../../Services/TopicService';

const Round3 = () => {
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);

  const [currentRound, setCurrentRound] = useState<RoundDTO>(new NRound());
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 3));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setCurrentRound(extractRound(doc));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
  };

  const currentTeams = useMemo(() => {
    return allTeams.filter((team) => !team.eliminated);
  }, [allTeams, currentRound]);

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
      <div className='players-r3-header'>
        <h1>LA FINALE</h1>
        <h1>
          {currentTopic.name ? 'Thème : ' : ''}
          {currentTopic.name}
        </h1>
      </div>
      <div className='players-r3-wrapper'>
        {currentTeams.map((team: TeamDTO) => {
          return (
            <div key={team.id} className='players-r3-card'>
              <div className='players-r3-card--title'>{team.name}</div>
              <div className='players-r3-card--score'>{team.score[3]}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Round3;
