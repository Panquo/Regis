import { useNavigate } from 'react-router-dom';

export const Regis = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ici Regis :3</h1>
      <button onClick={() => navigate('/regis/round1')}>Round1</button>
      <button onClick={() => navigate('/regis/round2')}>Round2</button>
      <button onClick={() => navigate('/regis/round3')}>Round3</button>
      <button onClick={() => navigate(-1)}>back</button>
    </>
  );
};
