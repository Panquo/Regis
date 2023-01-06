import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { default as PresentatorRound1 } from './Round1';

const Presentator = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button variant='outlined' onClick={() => navigate(-1)}>
        back
      </Button>
      <Button variant='outlined' onClick={() => navigate('/presentator/round1')}>
        Round 1
      </Button>
      <Button disabled variant='outlined' onClick={() => navigate('/presentator/round2')}>
        Round 2
      </Button>
    </>
  );
};

export { Presentator, PresentatorRound1 };
