import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import { fetchQuestion, updateQuestion } from '../../Services/QuestionService';

import { ButtonBase, Grid, IconButton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';

const Round1 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentPhase, setPhase] = useState<1 | 2>(1);
  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return (
      allQuestions.find((question) => question.index === currentQuestionIndex) || new NQuestion()
    );
  }, [allQuestions, currentQuestionIndex]);

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

  const initQuestions = async (currentRound: RoundDTO) => {
    const questions = await Promise.all(
      currentRound.questions!.map((questionId: string) => fetchQuestion(questionId)),
    );

    setAllQuestions(questions.sort((q1, q2) => q1.index - q2.index));
  };

  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const phaseTeams = useMemo(() => {
    return allTeams.filter((team) => team.phase === currentPhase);
  }, [allTeams, currentPhase]);

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
          <Typography sx={{ fontSize: 30, lineHeight: '30px' }}>
            Round 1 - Poule {currentPhase}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size='large'
            onClick={() => setPhase(currentPhase === 1 ? 2 : 1)}
            sx={{ fontSize: 40, color: 'white' }}
          >
            {currentPhase === 2 && <NavigateBeforeIcon sx={{ fontSize: 40, color: 'white' }} />}
            🐔
            {currentPhase === 1 && <NavigateNextIcon sx={{ fontSize: 40, color: 'white' }} />}
          </IconButton>
        </Grid>
      </Grid>

      <Grid item justifyContent='stretch' sx={{ flexGrow: 1 }}>
        <QuestionDisplay {...{ allTeams, currentQuestion }} />
      </Grid>

      <Grid
        item
        container
        direction='row'
        justifyContent='space-around'
        alignItems='stretch'
        sx={{
          padding: 4,
        }}
      >
        {phaseTeams.map((team) => (
          <Grid item key={team.id}>
            <TeamButton
              key={team.id}
              {...{ team, selectedTeam, setSelectedTeam, currentQuestion }}
            />
          </Grid>
        ))}
      </Grid>

      <Grid item container direction='row' alignItems='center'>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size='large'
            onClick={() => setCurrentQuestionIndex(currentQuestion?.index - 1)}
            disabled={currentQuestion?.index === 0}
            sx={{ color: 'white' }}
          >
            <NavigateBeforeIcon sx={{ fontSize: 40 }} />
            <HelpOutlineIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonBase
            onClick={() => {
              updateQuestion({
                ...currentQuestion,
                teamId: selectedTeam,
              });
              setSelectedTeam('');
            }}
            disabled={!selectedTeam}
            sx={{
              width: 300,
              height: 60,
              backgroundColor: !selectedTeam ? 'gray' : 'lightgray',
              borderRadius: 4,
              transition: 'background 500ms',
              fontSize: 25,
              color: !selectedTeam ? 'lightgray' : 'black',
            }}
          >
            <Box
              sx={{
                fontFamily: 'Ubuntu',
              }}
            >
              Valider
            </Box>
          </ButtonBase>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size='large'
            onClick={() => setCurrentQuestionIndex(currentQuestion?.index + 1)}
            disabled={currentQuestion?.index + 1 === currentRound?.questions?.length}
            sx={{ color: 'white' }}
          >
            <HelpOutlineIcon sx={{ fontSize: 40 }} />
            <NavigateNextIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

const TeamButton = (props: any) => {
  const { team, selectedTeam, setSelectedTeam, currentQuestion } = props;

  const isSelected = selectedTeam === team.id,
    isWinner = currentQuestion?.teamId === team.id,
    isQualified = team.score[0] === 3;
  const backgroundColor = isQualified ? '#1a9b71' : isSelected ? 'lightgreen' : 'lightgray';
  const winnerGlow = { boxShadow: '0px 4px 20px 2px #DAB239' };

  return (
    <ButtonBase
      onClick={() => setSelectedTeam(isSelected ? '' : team.id)}
      disabled={isQualified}
      sx={{
        height: 150,
        width: 150,
        backgroundColor,
        borderRadius: 2,
        transition: 'background 500ms',
        padding: 1,
        overflowWrap: 'anywhere',
        ...(isWinner && winnerGlow),
      }}
    >
      {isWinner && (
        <Box
          sx={{
            backgroundColor: '#DAB239',
            position: 'absolute',
            top: -30,
            height: 60,
            width: 60,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <TrophyIcon sx={{ fontSize: 45 }} />
        </Box>
      )}
      <Stack>
        <Box
          sx={{
            fontSize: 20,
            fontFamily: 'Ubuntu',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {team.name}
        </Box>
        <Stack
          direction='row'
          sx={{
            fontFamily: 'Ubuntu',
            gap: 1,
            alignSelf: 'center',
            alignItems: 'center',
            margin: 1,
          }}
        >
          {[1, 2, 3].map((wins) => {
            return team.score[0] >= wins ? (
              <VerifiedIcon key={wins} sx={{ fontSize: 35, color: 'darkgreen' }} />
            ) : (
              <HelpOutlineIcon key={wins} />
            );
          })}
        </Stack>
      </Stack>
    </ButtonBase>
  );
};

const QuestionDisplay = (props: any) => {
  const { allTeams, currentQuestion } = props;

  const areaStyle = (additionalStyles: any = {}) => {
    return {
      backgroundColor: 'lightgray',
      borderRadius: 4,
      fontSize: 20,
      padding: 2,
      gap: 2,
      justifyContent: 'center',
      display: 'flex',
      fontWeight: 800,
      minHeight: 24,
      ...additionalStyles,
    };
  };

  return (
    <Grid
      container
      direction='column'
      alignItems='stretch'
      justifyContent='stretch'
      spacing={2}
      sx={{ paddingX: 2 }}
    >
      <Grid item>
        <Box sx={{ fontSize: 20, color: 'white' }}>Question n°{currentQuestion?.index}</Box>
      </Grid>
      <Grid item container direction='row' justifyContent='space-between'>
        <Grid item xs={5.85} sx={areaStyle()}>
          <SchoolIcon />
          <Box>{currentQuestion?.flavor}</Box>
        </Grid>
        {currentQuestion?.teamId && (
          <Grid item xs={5.85} sx={areaStyle({ backgroundColor: '#DAB239' })}>
            <TrophyIcon />
            <Box>{allTeams.find((team: TeamDTO) => currentQuestion?.teamId === team.id).name}</Box>
          </Grid>
        )}
      </Grid>
      <Grid item>
        <Box
          sx={{
            backgroundColor: 'lightgray',
            borderRadius: 4,
            fontSize: 24,
            padding: 2,
            height: 180,
            alignContent: 'center',
            flexWrap: 'wrap',
            display: 'flex',
            lineHeight: 1.5,
          }}
        >
          {currentQuestion?.statement}
        </Box>
      </Grid>
      <Grid item>
        <Box
          sx={areaStyle({
            backgroundColor: 'lightgreen',
            fontSize: 24,
          })}
        >
          <VerifiedIcon />
          {currentQuestion?.answer}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Round1;
