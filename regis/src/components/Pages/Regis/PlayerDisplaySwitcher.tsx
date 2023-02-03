import { Button } from '@mui/material';
import { updateContext } from '../../Services/ContextService';

const PlayerDisplaySwitcher = () => {
  return (
    <div className='player-display-switcher'>
      <Button variant='contained' onClick={() => updateContext(1)} className='nav'>
        Joueurs Round 1
      </Button>
      <Button variant='contained' onClick={() => updateContext(2)} className='nav'>
        Joueurs Round 2
      </Button>
      <Button variant='contained' onClick={() => updateContext(2.5)} className='nav'>
        Joueurs Round 2.5
      </Button>
      <Button variant='contained' onClick={() => updateContext(3)} className='nav'>
        Joueurs Round 3
      </Button>
    </div>
  );
};

export default PlayerDisplaySwitcher;
