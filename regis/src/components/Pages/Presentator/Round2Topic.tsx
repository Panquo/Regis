import { ButtonBase, Grid, IconButton, Typography } from '@mui/material';
import { collection, documentId, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import QuestionDTO, { AnswerStatus, extractQuestion, NQuestion } from '../../Classes/Question';
import TopicDTO, { extractTopic } from '../../Classes/Topic';
import HomeIcon from '@mui/icons-material/Home';
import { Box } from '@mui/system';
import VerifiedIcon from '@mui/icons-material/Verified';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import TeamDTO, { extractTeam } from '../../Classes/Team';
import GroupIcon from '@mui/icons-material/Group';
import _ from 'lodash';
import { updateQuestion } from '../../Services/QuestionService';

const Round2Topic = () => {
  const navigate = useNavigate();
  const { teamId, topicId } = useParams();

  const [allQuestions, setAllQuestions] = useState<QuestionDTO[]>([]);

  const [currentTopic, setTopic] = useState<TopicDTO>();
  const [currentTeam, setTeam] = useState<TeamDTO>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion: QuestionDTO = useMemo(() => {
    return (
      allQuestions.find((question) => question.index === currentQuestionIndex) || new NQuestion()
    );
  }, [allQuestions, currentQuestionIndex]);

  const initTeam = () => {
    const q = query(collection(db, 'teams'), where(documentId(), '==', teamId));

    onSnapshot(q, (querySnapshot) => {
      const team = querySnapshot.docs[0];

      setTeam(extractTeam(team));
    });
  };

  const initTopic = () => {
    const q = query(collection(db, 'topics'), where(documentId(), '==', topicId));

    onSnapshot(q, (querySnapshot) => {
      const topic = querySnapshot.docs[0];

      setTopic(extractTopic(topic));
    });
  };

  const initQuestions = (currentTopic: TopicDTO) => {
    const q = query(
      collection(db, 'questions'),
      where(documentId(), 'in', currentTopic.questions || ['2tQ7pc86xY95eH4prdyM']),
    );

    onSnapshot(q, (querySnapshot) => {
      const questions = querySnapshot.docs.map(extractQuestion);

      setAllQuestions(questions.sort((q1, q2) => q1.index - q2.index));
    });
  };

  const nextQuestionIndex = useMemo(() => {
    let index = (currentQuestionIndex + 1) % allQuestions?.length,
      question = allQuestions.find((q) => q.index === index);

    while (question?.answerStatus === AnswerStatus['answered-right']) {
      index = (index + 1) % allQuestions?.length;
      question = allQuestions.find((q) => q.index === index);
    }

    return index;
  }, [currentQuestionIndex, allQuestions]);

  useEffect(() => {
    initTopic();
    initTeam();
  }, []);

  useEffect(() => {
    if (currentTopic?.questions?.length) {
      initQuestions(currentTopic);
    }
  }, [currentTopic]);

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
          <IconButton size='large' onClick={() => navigate(-1)}>
            <MenuOpenIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 30, lineHeight: '30px' }}>
            Round 2 - {currentTopic?.name}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton size='large' onClick={() => navigate('/presentator')}>
            <HomeIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
        </Grid>
      </Grid>

      <Grid
        item
        container
        sx={{
          alignItems: 'center',
          color: 'black',
          justifyContent: 'center',
          fontSize: 20,
          gap: 2,
        }}
      >
        <Grid item sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
              height: 60,
              width: 400,
              backgroundColor: 'lightgray',
              borderRadius: 4,
              alignItems: 'center',
              display: 'flex',
              paddingX: 2,
              gap: 2,
            }}
          >
            <GroupIcon />
            {currentTeam?.name}
          </Box>
        </Grid>
        <Grid item sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
              height: 60,
              width: 100,
              backgroundColor: 'lightgray',
              borderRadius: 4,
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <DoneIcon />
            {_.countBy(
              allQuestions,
              (question) => question.answerStatus === AnswerStatus['answered-right'],
            ).true || 0}
          </Box>
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction='column'
        alignItems='stretch'
        sx={{ gap: 1, paddingX: 4, display: 'flex', flexGrow: 1 }}
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
              height: 120,
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
            sx={{
              borderRadius: 4,
              padding: 2,
              gap: 2,
              justifyContent: 'center',
              display: 'flex',
              fontWeight: 800,
              minHeight: 24,
              backgroundColor: 'lightgreen',
              fontSize: 24,
            }}
          >
            <VerifiedIcon />
            {currentQuestion?.answer}
          </Box>
        </Grid>
      </Grid>

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
        <ButtonBase
          onClick={() => {
            currentQuestion.answerStatus = AnswerStatus['answered-wrong'];
            currentQuestion.teamId = currentTeam?.id || '';
            updateQuestion(currentQuestion);
            setCurrentQuestionIndex(nextQuestionIndex);
          }}
          sx={{
            height: 150,
            width: 150,
            backgroundColor: 'salmon',
            borderRadius: 2,
            padding: 1,
          }}
        >
          <CloseIcon
            sx={{
              fontSize: 60,
            }}
          />
        </ButtonBase>
        <ButtonBase
          onClick={() => {
            currentQuestion.answerStatus = AnswerStatus['answered-right'];
            currentQuestion.teamId = currentTeam?.id || '';
            updateQuestion(currentQuestion);
            if (
              (_.countBy(
                allQuestions,
                (question) => question.answerStatus === AnswerStatus['answered-right'],
              ).true || 0) === allQuestions.length
            ) {
              navigate('/presentator/round2');
            }
            setCurrentQuestionIndex(nextQuestionIndex);
          }}
          sx={{
            height: 150,
            width: 150,
            backgroundColor: 'lightgreen',
            borderRadius: 2,
            padding: 1,
          }}
        >
          <DoneIcon
            sx={{
              fontSize: 60,
            }}
          />
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default Round2Topic;
