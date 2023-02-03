import { Grid, Paper, styled } from '@mui/material';
import { collection, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, ROUNDS_COLLECTION, TOPICS_COLLECTION } from '../../../firebase';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TopicDTO, { extractTopic, NTopic } from '../../Classes/Topic';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Round2 = () => {
  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 2));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  const initTopics = (currentRound: RoundDTO) => {
    const q = query(
      collection(db, TOPICS_COLLECTION),
      where(documentId(), 'in', currentRound.topics || ['5CCFsRQqEtRRMhv1x1BN']),
    );

    onSnapshot(q, (querySnapshot) => {
      const topics: TopicDTO[] = querySnapshot.docs.map(extractTopic);

      if (currentRound.current) {
        setCurrentTopic(
          topics.find((topic: TopicDTO) => topic.id === currentRound.current) || new NTopic(),
        );
      }
      setAllTopics(topics);
    });
  };

  useEffect(() => {
    initRound();
  }, []);

  useEffect(() => {
    console.log(currentRound);

    if (currentRound.topics?.length) {
      initTopics(currentRound);
    }
  }, [currentRound]);

  return (
    <>
      <h1>Manche 2</h1>
      <div className='players-topics'>
        {currentRound.current ? (
          <div className='players-current-topic' data-topic={currentTopic.name}>
            {currentTopic.name}
          </div>
        ) : (
          <div className='players-topic-grid'>
            {allTopics.map((item: TopicDTO) => (
              <div
                key={item.id}
                className={
                  item.status === 2
                    ? 'players-topic players-topic__answered'
                    : item.id === currentRound.current
                    ? 'players-topic players-topic__chosen'
                    : item.gold
                    ? 'players-topic players-topic__mistery'
                    : 'players-topic players-topic__default'
                }
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Round2;
