import { Grid, Paper, styled } from '@mui/material';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../../firebase';
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

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentTopic, setCurrentTopic] = useState<TopicDTO>(new NTopic());

  const initRound = () => {
    const q = query(collection(db, 'rounds'), where('index', '==', 2));

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
        index: doc.data().index,
        teamId: doc.data().teamId,
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

  const currentTeams = useMemo(
    () => allTeams.filter((team) => !team.eliminated),
    [allTeams, currentRound],
  );

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
        {currentTeams.map((item: TeamDTO) => {
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
      <div className='display-topics-stream'>
        {currentRound.current ? (
          <>
            <div className='stream-current-topic'>
              <div>{currentTopic.name}</div>
            </div>
            <div className='stream-current-topic-top'>
              <div>{currentTopic.name}</div>
            </div>
          </>
        ) : null}
        <Grid
          className={currentRound.current ? 'stream-topics' : ''}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 1 }}
        >
          {allTopics.map((item: TopicDTO) => {
            return (
              <Grid key={item.id} item xs={4}>
                <Item
                  className={
                    item.status === 2
                      ? 'stream-answered-topic'
                      : item.id === currentRound.current
                      ? 'stream-chosen-topic'
                      : item.gold
                      ? 'stream-mystery-topic'
                      : ''
                  }
                >
                  {item.name}
                </Item>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default Round2;
