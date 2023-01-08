import { ButtonBase, Grid, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useEffect, useState } from 'react';
import TopicDTO, { extractTopic } from '../../Classes/Topic';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';

import SchoolIcon from '@mui/icons-material/School';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import TrophyIcon from '@mui/icons-material/EmojiEvents';

const Round2 = () => {
  const navigate = useNavigate();

  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());

  const initRound = () => {
    const q = query(collection(db, 'rounds'), where('index', '==', 2));

    onSnapshot(q, (querySnapshot) => {
      const doc = querySnapshot.docs[0];

      setRound(extractRound(doc));
    });
  };

  const initTopics = (currentRound: RoundDTO) => {
    const q = query(
      collection(db, 'topics'),
      where(documentId(), 'in', currentRound.topics || ['RRusahKVlHevy5NgBXW7']),
    );

    onSnapshot(q, (querySnapshot) => {
      const topics = querySnapshot.docs.map(extractTopic);

      setAllTopics(topics.sort((t1, t2) => t1.index - t2.index));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, 'teams'), orderBy('name', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      setAllTeams(querySnapshot.docs.map(extractTeam));
    });
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
    <Grid
      container
      sx={{
        padding: 2,
        gap: 2,
        justifyContent: 'stretch',
        height: window.innerHeight,
      }}
    >
      <Grid item container sx={{ alignItems: 'center', color: 'white' }}>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton size='large' onClick={() => navigate('/presentator')}>
            <HomeIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 30, lineHeight: '30px' }}>Round 2</Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton size='large' onClick={() => navigate('/presentator')}>
            <HomeIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
        </Grid>
      </Grid>

      <Grid item container direction='column' alignItems='stretch' sx={{ gap: 2, paddingX: 4 }}>
        {allTopics?.map((topic) => (
          <Grid item key={topic.id} sx={{ display: 'flex', gap: 2 }}>
            <TopicDisplay {...{ topic, allTeams }} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const TopicDisplay = (props: any) => {
  const { topic, allTeams } = props;
  const navigate = useNavigate();

  const wasPlayed = topic.teamId !== '';
  const team = allTeams.find((team: TeamDTO) => team.id === topic.teamId);

  return (
    <>
      <ButtonBase
        key={topic.id}
        disabled={wasPlayed}
        onClick={() => navigate(`topic/${topic.id}`)}
        sx={{
          fontSize: 25,
          fontFamily: 'Ubuntu',
          padding: 3,
          borderRadius: 4,
          gap: 2,
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'left',
          backgroundColor: wasPlayed ? 'gray' : 'lightgray',
          color: wasPlayed ? 'lightgray' : 'black',
        }}
      >
        <SchoolIcon />
        {topic.name}
      </ButtonBase>
      {topic.teamId && <TeamDisplay {...{ team }} />}
    </>
  );
};

const TeamDisplay = (props: any) => {
  const { team } = props;

  return (
    <ButtonBase
      key={team.id}
      disabled
      sx={{
        backgroundColor: '#DAB239',
        fontSize: 20,
        fontFamily: 'Ubuntu',
        padding: 3,
        borderRadius: 4,
        width: 250,
        gap: 2,
      }}
    >
      <TrophyIcon sx={{ fontSize: 25 }} />
      {team.name}
    </ButtonBase>
  );
};

export default Round2;
