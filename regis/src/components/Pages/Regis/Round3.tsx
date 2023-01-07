import { useNavigate } from 'react-router-dom';

export const Round3 = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ici le Round3</h1>
      <button onClick={() => navigate(-1)}>back</button>
    </>
  );
};
