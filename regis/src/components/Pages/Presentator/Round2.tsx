import { ButtonBase, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { collection, documentId, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION, TOPICS_COLLECTION } from '../../../firebase';
import { useEffect, useState } from 'react';
import TopicDTO, { extractTopic } from '../../Classes/Topic';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';

import SchoolIcon from '@mui/icons-material/School';
import TeamDTO, { extractTeam, NTeam } from '../../Classes/Team';

import GroupIcon from '@mui/icons-material/Group';
import { updateTopic } from '../../Services/TopicService';

const Round2 = () => {
  const navigate = useNavigate();

  const [allTopics, setAllTopics] = useState<TopicDTO[]>([]);
  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentTeam, setTeam] = useState<TeamDTO>(new NTeam());

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
      where(documentId(), 'in', currentRound.topics || ['RRusahKVlHevy5NgBXW7']),
    );

    onSnapshot(q, (querySnapshot) => {
      const topics = querySnapshot.docs.map(extractTopic);

      setAllTopics(topics.sort((t1, t2) => t1.index - t2.index));
    });
  };

  const initTeams = () => {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('name', 'asc'));

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

      <Grid item justifyContent='center' alignItems='center' sx={{ display: 'flex', flex: 1 }}>
        <Select
          label='Équipe'
          value={currentTeam.id}
          onChange={(event) => {
            const team = allTeams.find((team) => team.id === event?.target.value);

            setTeam(team || new NTeam());
          }}
          sx={{
            width: 400,
            backgroundColor: 'lightgray',
            borderRadius: 4,
            fontSize: 20,
          }}
        >
          {allTeams?.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item container direction='column' alignItems='stretch' sx={{ gap: 2, paddingX: 4 }}>
        {allTopics?.map((topic) => (
          <Grid item key={topic.id} sx={{ display: 'flex', gap: 2 }}>
            <TopicDisplay {...{ topic, allTeams, currentTeam }} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const TopicDisplay = (props: any) => {
  const { topic, allTeams, currentTeam } = props;
  const navigate = useNavigate();

  const wasPlayed = topic.teamId !== '';
  const team = allTeams.find((team: TeamDTO) => team.id === topic.teamId);

  return (
    <>
      <ButtonBase
        key={topic.id}
        disabled={wasPlayed || currentTeam.id === ''}
        onClick={() => {
          updateTopic({ ...topic, teamId: currentTeam.id }); // TODO: topic upate doesn't work
          navigate(`${currentTeam.id}/topic/${topic.id}`);
        }}
        sx={{
          fontSize: 25,
          fontFamily: 'Ubuntu',
          padding: 2.5,
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
        padding: 2.5,
        borderRadius: 4,
        width: 250,
        gap: 2,
        justifyContent: 'left',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      <GroupIcon sx={{ fontSize: 25 }} />
      {team.name}
    </ButtonBase>
  );
};

export default Round2;
