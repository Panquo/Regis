import { useNavigate } from 'react-router-dom';

export const Round2 = (props: any) => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ici le Round2</h1>
      <button onClick={()=>navigate(-1)}>back</button>
    </>
  );
};
