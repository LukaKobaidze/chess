import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from 'context/global.context';
import { IconGithub } from 'assets/images';
import { ReactComponent as PawnWhite } from 'assets/images/piece/cburnett/wP.svg';
import { ReactComponent as PawnBlack } from 'assets/images/piece/cburnett/bP.svg';
import { Logo, TextPopup } from 'components';
import styles from 'styles/pages/Home/Home.module.scss';

export default function Home() {
  const { side, changeSide } = useContext(GlobalContext);

  const sideStyle = {
    '--btn-active': side === 'white' ? 0 : side === 'random' ? 1 : 2,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      <TextPopup
        position="bottom"
        text="source code"
        showOnHover
        className={styles.github}
        classNamePopup={styles['github__popup']}
      >
        <a
          href="https://github.com/LukaKobaidze/chess"
          className={styles['github__anchor']}
          target="_blank"
          rel="noreferrer"
        >
          <IconGithub />
        </a>
      </TextPopup>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.content}>
        <div className={styles.side} style={sideStyle}>
          <p>Choose a side</p>
          <p className={styles['side__text']}>
            {side[0].toUpperCase() + side.slice(1)}
          </p>
          <div className={styles['side__buttons-wrapper']}>
            <button
              className={`${styles['side-button']} ${
                side === 'white' ? styles['side-button--active'] : ''
              }`}
              onClick={() => changeSide('white')}
            >
              <PawnWhite className={styles['side__pawn']} />
            </button>
            <button
              className={`${styles['side-button']} ${styles['side-button-random']} ${
                side === 'random' ? styles['side-button--active'] : ''
              }`}
              onClick={() => changeSide('random')}
            >
              <div className={styles['side-button-random-wrapper']}>
                <div>
                  <PawnWhite className={styles['side__pawn-random']} />
                </div>
                <div>
                  <PawnBlack
                    className={`${styles['side__pawn-random']} ${styles['side__pawn-random--black']}`}
                  />
                </div>
              </div>
            </button>
            <button
              className={`${styles['side-button']} ${
                side === 'black' ? styles['side-button--active'] : ''
              }`}
              onClick={() => changeSide('black')}
            >
              <PawnBlack className={styles['side__pawn']} />
            </button>
          </div>
        </div>
        <Link to="/game" className={`button ${styles['btn-play-cpu']}`}>
          New Game (vs CPU)
        </Link>
        <Link to="/freeplay" className={`button ${styles['btn-freeplay']}`}>
          Freeplay
        </Link>
      </div>
    </div>
  );
}
