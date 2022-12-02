import { useNavigate } from 'react-router-dom';

export const Regis = (props: any) => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ici Regis :3</h1>
      <button onClick={() => navigate(-1)}>back</button>
    </>
  );
};
