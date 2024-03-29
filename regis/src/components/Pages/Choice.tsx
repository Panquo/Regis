import { useNavigate } from 'react-router-dom';

export const Choice = () => {
  const navigate = useNavigate();

  return (
    <div className='background'>
      <div className='choice'>
        <h1>Qui va là ?</h1>
        <button onClick={() => navigate('/presentator')}>Les Présentateurs</button>
        <button onClick={() => navigate('/regis')}>La Régie</button>
        <button onClick={() => navigate('/show')}>Le Stream</button>
        <button onClick={() => navigate('/players')}>Les Joueurs</button>
      </div>
    </div>
  );
};
