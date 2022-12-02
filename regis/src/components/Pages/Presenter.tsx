import { useNavigate } from "react-router-dom";

export const Presenter = (props: any) => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Ici les présentateurs</h1>
      <button onClick={()=>navigate(-1)}>back</button>
    </>
  );
};
