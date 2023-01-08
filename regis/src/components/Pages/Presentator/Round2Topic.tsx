import { useNavigate, useParams } from 'react-router-dom';

const Round2Topic = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();

  return <>Round 2 topic {topicId}</>;
};

export default Round2Topic;
