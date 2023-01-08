import { useNavigate } from 'react-router-dom';

import { default as StreamRound1 } from './Round1';

const Stream = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ici le Show !</h1>
      <button onClick={() => navigate(-1)}>back</button>
      <button onClick={() => navigate('./round1')}>Round 1</button>
      <button onClick={() => navigate('./round2')}>Round 2</button>
      <button onClick={() => navigate('./round25')}>Round 2.5</button>
      <button onClick={() => navigate('./round3')}>Round 3</button>
    </>
  );
};

export { Stream, StreamRound1 };
