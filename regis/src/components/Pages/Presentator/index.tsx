import { ButtonBase, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { default as PresentatorRound1 } from './Round1';
import { default as PresentatorRound2 } from './Round2';
import { default as PresentatorRound2Topic } from './Round2Topic';
import { default as PresentatorRound25 } from './Round25';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const buttonStyles = {
  width: 500,
  backgroundColor: 'lightgray',
  fontSize: 35,
  fontFamily: 'Ubuntu',
  padding: 3,
  borderRadius: 4,
  gap: 2,
};

const Presentator = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      direction='column'
      sx={{
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: window.innerHeight,
      }}
    >
      <Grid container item direction='column' alignItems='center' sx={{ display: 'flex', gap: 4 }}>
        <Grid item>
          <ButtonBase onClick={() => navigate('/')} sx={buttonStyles}>
            <HomeIcon sx={{ fontSize: 40 }} />
            Home
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={() => navigate('/presentator/round1')} sx={buttonStyles}>
            Manche 1
            <NavigateNextIcon sx={{ fontSize: 40 }} />
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={() => navigate('/presentator/round2')} sx={buttonStyles}>
            Manche 2
            <NavigateNextIcon sx={{ fontSize: 40 }} />
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={() => navigate('/presentator/round25')} sx={buttonStyles}>
            Manche 2.5
            <NavigateNextIcon sx={{ fontSize: 40 }} />
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={() => navigate('/presentator/round3')} sx={buttonStyles}>
            Manche 3
            <NavigateNextIcon sx={{ fontSize: 40 }} />
          </ButtonBase>
        </Grid>
      </Grid>
    </Grid>
  );
};

export {
  Presentator,
  PresentatorRound1,
  PresentatorRound2,
  PresentatorRound2Topic,
  PresentatorRound25,
};
