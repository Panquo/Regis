import { useNavigate } from "react-router-dom";

export const Show = (props: any) => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Ici le Show !</h1>
      <button onClick={()=>navigate(-1)}>back</button>
    </>
  );
};
