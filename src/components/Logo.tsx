import { ReactComponent as PawnWhite } from 'assets/images/piece/cburnett/wP.svg';
import { ReactComponent as PawnBlack } from 'assets/images/piece/cburnett/bP.svg';
import { ReactComponent as KnightWhite } from 'assets/images/piece/cburnett/wN.svg';
import { ReactComponent as KnightBlack } from 'assets/images/piece/cburnett/bN.svg';
import styles from 'styles/Logo.module.scss';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <h1 className={styles.text}>Chess App</h1>
      <div className={styles.pieces}>
        <div>
          <PawnWhite />
          <KnightBlack />
        </div>
        <div>
          <PawnBlack />
          <KnightWhite />
        </div>
      </div>
    </div>
  );
}
