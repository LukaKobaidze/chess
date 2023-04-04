import styles from 'styles/Switch.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state: boolean;
  onToggle: () => void;
}

export default function Switch(props: Props) {
  const { state, onToggle } = props;

  return (
    <button
      className={`${styles.switch} ${state === true ? styles['switch--on'] : ''}`}
      onClick={onToggle}
    >
      <span className={styles['switch__circle']} />
    </button>
  );
}
