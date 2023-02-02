import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, ROUNDS_COLLECTION, TEAMS_COLLECTION } from '../../../firebase';
import QuestionDTO, { NQuestion } from '../../Classes/Question';
import RoundDTO, { extractRound, NRound } from '../../Classes/Round';
import TeamDTO, { extractTeam } from '../../Classes/Team';

import { ButtonBase, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { fetchQuestion } from '../../Services/QuestionService';

const Round25 = () => {
  const navigate = useNavigate();

  const [allTeams, setAllTeams] = useState<TeamDTO[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentRound, setRound] = useState<RoundDTO>(new NRound());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return (
      allQuestions.find((question) => question.index === currentQuestionIndex) || new NQuestion()
    );
  }, [allQuestions, currentQuestionIndex]);

  const initRound = () => {
    const q = query(collection(db, ROUNDS_COLLECTION), where('index', '==', 2.5));

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
          <Typography sx={{ fontSize: 30, lineHeight: '30px' }}>Round 2.5</Typography>
        </Grid>
      </Grid>

      <Grid item justifyContent='stretch' sx={{ flexGrow: 1 }}>
        <QuestionDisplay {...{ allTeams, currentQuestion }} />
      </Grid>

      <Grid item container direction='row' alignItems='center'>
        <Grid
          item
          container
          direction='row'
          justifyContent='space-around'
          alignItems='stretch'
          sx={{
            padding: 2,
          }}
        >
          <NavigationButton
            disabled={currentQuestionIndex === 0}
            onClick={() => {
              setCurrentQuestionIndex(currentQuestion.index - 1);
            }}
            Icon={ChevronLeftIcon}
          />
          <NavigationButton
            disabled={currentQuestionIndex === allQuestions.length - 1}
            onClick={() => {
              setCurrentQuestionIndex(currentQuestion.index + 1);
            }}
            Icon={ChevronRightIcon}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const NavigationButton = (props: any) => {
  const { disabled, onClick, Icon } = props;

  return (
    <ButtonBase
      disabled={disabled}
      onClick={onClick}
      sx={{
        height: 150,
        width: 150,
        backgroundColor: disabled ? 'gray' : 'lightgray',
        borderRadius: 2,
        padding: 1,
      }}
    >
      <Icon
        sx={{
          fontSize: 60,
        }}
      />
    </ButtonBase>
  );
};

const QuestionDisplay = (props: any) => {
  const { currentQuestion } = props;

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

export default Round25;
