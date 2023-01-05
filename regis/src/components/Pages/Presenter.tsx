import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Presenter = (props: any) => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant='outlined' onClick={() => navigate(-1)}>
        back
      </Button>
    </>
  );
};
