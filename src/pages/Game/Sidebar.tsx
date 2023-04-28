import { useEffect, useRef, useState } from 'react';
import {
  IconArrowLeft,
  IconArrowRight,
  IconFlag,
  IconSkipBeginning,
  IconSkipEnding,
} from 'assets/images';
import { ChessWinner } from 'types';
import { useWindowDimensions } from 'hooks';
import { Button, TextPopup, AlertOutsideClick } from 'components';
import Customize from './Customize';
import styles from 'styles/pages/Game/Sidebar.module.scss';

interface Props {
  movesTimelineNotation: string[];
  replay: number;
  handleReplay: (value: number) => void;
  winner: ChessWinner | null;
  onResign: () => void;
  isCustomizing: boolean;
  onCustomizeClose: () => void;
  pieceSet: number;
  setPieceSet: React.Dispatch<React.SetStateAction<number>>;
  boardSizePercentage: number;
  setBoardSizePercentage: React.Dispatch<React.SetStateAction<number>>;
  boardType: number;
  setBoardType: React.Dispatch<React.SetStateAction<number>>;
  highlightMoves: boolean;
  setHighlightMoves: React.Dispatch<React.SetStateAction<boolean>>;
  alwaysPromoteToQueen: boolean;
  toggleAlwaysPromoteToQueen: () => void;
  resignConfirmRef: React.RefObject<HTMLButtonElement>;
}

export default function Sidebar(props: Props) {
  const {
    movesTimelineNotation,
    replay,
    handleReplay,
    winner,
    onResign,
    isCustomizing,
    onCustomizeClose,
    pieceSet,
    setPieceSet,
    boardType,
    setBoardType,
    boardSizePercentage,
    setBoardSizePercentage,
    highlightMoves,
    setHighlightMoves,
    alwaysPromoteToQueen,
    toggleAlwaysPromoteToQueen,
    resignConfirmRef,
  } = props;

  const [windowWidth] = useWindowDimensions();
  const [resignConfirmation, setResignConfirmation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMoveReplay = (n: number) => {
    handleReplay(n);
  };

  const handleTimelineBeginning = () => {
    handleReplay(-1);
  };

  const handleTimelineBack = () => {
    handleReplay(Math.max(replay - 1, -1));
  };

  const handleTimelineForward = () => {
    handleReplay(Math.min(replay + 1, movesTimelineNotation.length - 1));
  };
  const handleTimelineEnding = () => {
    handleReplay(movesTimelineNotation.length - 1);
  };

  const handleResignClick = () => {
    if (!winner) {
      setResignConfirmation(true);
    }
  };

  const handleResignConfirm = () => {
    onResign();
    setResignConfirmation(false);
  };

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [movesTimelineNotation]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (replay === -1) containerRef.current.scrollTop = 0;
  }, [replay]);

  useEffect(() => {
    if (resignConfirmation) {
      resignConfirmRef.current?.focus();
    }
  }, [resignConfirmation, resignConfirmRef]);

  const isTimelineBeginning = replay === -1;
  const isTimelineEnding = replay === movesTimelineNotation.length - 1;

  return (
    <div className={styles.sidebar}>
      {!isCustomizing && (
        <>
          <div className={styles['moves']} ref={containerRef}>
            {movesTimelineNotation.map((move, i) => {
              const nthA = i * 2;
              const nthB = i * 2 + 1;

              return <Button onClick={() => handleMoveReplay(i)}>{move}</Button>;

              // return (
              //   <div
              //     key={i}
              //     className={`${styles['moves__item']} ${
              //       (i + 1) % 2 === 0 ? styles['moves__item--even'] : ''
              //     }`}
              //   >
              //     <div className={styles['moves__item-num']}>{i + 1}.</div>
              //     <div
              //       className={styles['moves__item__buttons']}
              //       ref={(node) => {
              //         const container = containerRef.current;
              //         if (container && node && [nthA, nthB].includes(replay)) {
              //           container.scrollTop =
              //             node.offsetTop - container.offsetTop - node.clientHeight;
              //         }
              //       }}
              //     >
              //       <div className={styles['moves__item__white-wrapper']}>
              //         <Button
              //           className={`${styles['moves__item__btn']} ${
              //             nthA === replay ? styles['moves__item__btn--active'] : ''
              //           }`}
              //           onClick={() => handleMoveReplay(nthA)}
              //         >
              //           {moveA}
              //         </Button>
              //       </div>
              //       {moveB && (
              //         <Button
              //           className={`${styles['moves__item__btn']} ${
              //             nthB === replay ? styles['moves__item__btn--active'] : ''
              //           }`}
              //           onClick={() => handleMoveReplay(nthB)}
              //         >
              //           {moveB}
              //         </Button>
              //       )}
              //     </div>
              //   </div>
              // );
            })}
          </div>

          <div className={styles['drawresign-controls']}>
            <div className={styles.drawresign}>
              <AlertOutsideClick
                shouldHandle={resignConfirmation}
                onOutsideClick={() => setResignConfirmation(false)}
              >
                <TextPopup
                  text={
                    <div className={styles['textpopup']}>
                      <span>Are you sure you want to resign?</span>
                      <Button
                        className={styles['textpopup__button']}
                        onClick={handleResignConfirm}
                        tabIndex={resignConfirmation ? 0 : -1}
                        ref={resignConfirmRef}
                      >
                        Confirm
                      </Button>
                    </div>
                  }
                  position={windowWidth > 960 ? 'top' : 'top-right'}
                  show={resignConfirmation}
                  width={200}
                >
                  <Button
                    className={`${styles['drawresign__button']} ${
                      resignConfirmation ? styles['drawresign__button--active'] : ''
                    }`}
                    onClick={handleResignClick}
                    disabled={!!winner}
                  >
                    <span>Resign</span>
                    <IconFlag className={styles['drawresign__icon']} />
                  </Button>
                </TextPopup>
              </AlertOutsideClick>
            </div>

            <div className={styles['chessmoves-controls']}>
              <TextPopup
                position="top"
                text="Beginning"
                showOnHover={!isTimelineBeginning}
              >
                <button
                  className={`${styles['control-button']} ${
                    isTimelineBeginning ? styles['control-button--disable'] : ''
                  }`}
                  onClick={handleTimelineBeginning}
                  disabled={isTimelineBeginning}
                >
                  <IconSkipBeginning />
                </button>
              </TextPopup>
              <TextPopup
                position="top"
                text="Back"
                showOnHover={!isTimelineBeginning}
              >
                <button
                  className={`${styles['control-button']} ${
                    isTimelineBeginning ? styles['control-button--disable'] : ''
                  }`}
                  onClick={handleTimelineBack}
                  disabled={isTimelineBeginning}
                >
                  <IconArrowLeft className={styles['icon-arrow']} />
                </button>
              </TextPopup>
              <TextPopup
                position="top"
                text="Forward"
                showOnHover={!isTimelineEnding}
              >
                <button
                  className={`${styles['control-button']} ${
                    isTimelineEnding ? styles['control-button--disable'] : ''
                  }`}
                  onClick={handleTimelineForward}
                  disabled={isTimelineEnding}
                >
                  <IconArrowRight className={styles['icon-arrow']} />
                </button>
              </TextPopup>
              <TextPopup
                position="top"
                text="Latest"
                showOnHover={!isTimelineEnding}
              >
                <button
                  className={`${styles['control-button']} ${
                    isTimelineEnding ? styles['control-button--disable'] : ''
                  }`}
                  onClick={handleTimelineEnding}
                  disabled={isTimelineEnding}
                >
                  <IconSkipEnding />
                </button>
              </TextPopup>
            </div>
          </div>
        </>
      )}

      {isCustomizing && (
        <Customize
          pieceSet={pieceSet}
          setPieceSet={setPieceSet}
          boardType={boardType}
          setBoardType={setBoardType}
          boardSizePercentage={boardSizePercentage}
          setBoardSizePercentage={setBoardSizePercentage}
          onCustomizeClose={onCustomizeClose}
          highlightMoves={highlightMoves}
          setHighlightMoves={setHighlightMoves}
          alwaysPromoteQueen={alwaysPromoteToQueen}
          toggleAlwaysPromoteToQueen={toggleAlwaysPromoteToQueen}
        />
      )}
    </div>
  );
}
