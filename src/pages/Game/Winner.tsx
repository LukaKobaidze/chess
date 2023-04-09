import { useNavigate } from 'react-router-dom';
import { Button } from 'components';
import styles from 'styles/pages/Game/Winner.module.scss';

interface Props {
  textWinner: string;
  reason: string;
}

export default function Winner(props: Props) {
  const { textWinner, reason } = props;

  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.reason}>{reason}</div> 
      <span className={styles.winner}>{textWinner}</span>
      <div className={styles.buttons}>
        <Button onClick={handleLeave}>Leave</Button>
      </div>
    </div>
  );
}
