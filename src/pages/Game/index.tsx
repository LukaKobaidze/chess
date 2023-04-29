import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from 'context/global.context';
import { AudioCapture, AudioMove } from 'assets/audio';
import { IconTrophy } from 'assets/images';
import { PieceColor, PieceMoveIndexes, PiecePromotionType } from 'types';
import { pieceSets } from 'data';
import { getRobotMove } from 'helpers';
import { useAudio, useLocalStorageState, useWindowDimensions } from 'hooks';
import { gameReducer, initialState } from './game.reducer';
import { Button, Chess, AlertOutsideClick } from 'components';
import Sidebar from './Sidebar';
import Controls from './Controls';
import Winner from './Winner';
import styles from 'styles/pages/Game/Game.module.scss';

export default function Game() {
  const navigate = useNavigate();
  const { gamemode } = useParams();
  const { side } = useContext(GlobalContext);

  const [boardSize, setBoardSize] = useState(0);
  const [winnerMinimize, setWinnerMinimize] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const chessWrapperRef = useRef<HTMLDivElement>(null);
  const resignConfirmRef = useRef<HTMLButtonElement>(null);

  const playMoveSound = useAudio(AudioMove);
  const playCaptureSound = useAudio(AudioCapture);

  const [windowWidth, windowHeight] = useWindowDimensions();

  const [boardType, setBoardType] = useLocalStorageState('chess-board', 1);
  const [pieceSet, setPieceSet] = useLocalStorageState('chess-pieceset', 0);
  const [highlightMoves, setHighlightMoves] = useLocalStorageState(
    'chess-highligtmoves',
    true
  );
  const [boardSizePercentage, setBoardSizePercentage] = useLocalStorageState(
    'boardSizePercentage',
    100
  );

  const [reducerState, dispatch] = useReducer(gameReducer, initialState);

  const audio = useMemo(
    () => ({
      move: playMoveSound,
      capture: playCaptureSound,
    }),
    [playCaptureSound, playMoveSound]
  );

  const isReplaying = reducerState.replay !== reducerState.movesTimeline.length - 1;

  const handleResign = () => {
    if (reducerState.winner || !reducerState.playerColor) return;
    dispatch({
      type: 'Winner',
      payload: {
        type: reducerState.playerColor === 'white' ? 'black' : 'white',
        reason: 'Resignation',
      },
    });
  };

  const handleCustomizeToggle = () => {
    dispatch({
      type: 'Set',
      payload: (state) => ({ ...state, isCustomizing: !state.isCustomizing }),
    });
  };

  const handleCustomizeClose = () => {
    dispatch({
      type: 'Set',
      payload: (state) => ({ ...state, isCustomizing: false }),
    });
  };

  const handleWinnerOutsideClick = () => {
    setWinnerMinimize(true);
  };

  useEffect(() => {
    const colors: PieceColor[] = ['white', 'black'];
    const playerColor =
      side === 'random' ? colors[Math.floor(Math.random() * 2)] : side;

    dispatch({ type: 'Set', payload: (state) => ({ ...state, playerColor }) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const element = chessWrapperRef.current;

    if (!element) return;
    if (windowWidth > 960) {
      setBoardSize((windowHeight - 100) * (boardSizePercentage / 100));
    } else {
      setBoardSize(
        Math.min(windowWidth - 35, windowHeight - 100) * (boardSizePercentage / 100)
      );
    }
  }, [windowWidth, windowHeight, boardSizePercentage]);

  const handleLeave = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleInteract = () => {
      setUserHasInteracted(true);
      document.removeEventListener('mousedown', handleInteract);
      document.removeEventListener('touchstart', handleInteract);
    };

    document.addEventListener('mousedown', handleInteract);
    document.addEventListener('touchstart', handleInteract);

    return () => {
      document.removeEventListener('mousedown', handleInteract);
      document.removeEventListener('touchstart', handleInteract);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (gamemode === 'game' && reducerState.turn !== reducerState.playerColor) {
      timeout = setTimeout(() => {
        const move = getRobotMove(reducerState.pieces, reducerState.pieceMoves);
        if (move) {
          dispatch({
            type: 'PieceMove',
            payload: { audio, move },
          });
        }
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reducerState.turn,
    gamemode,
    reducerState.pieceMoves,
    reducerState.playerColor,
  ]);

  useLayoutEffect(() => {
    dispatch({ type: 'CheckWinner' });
  }, [reducerState.movesTimeline]);

  useEffect(() => {
    if (
      gamemode === 'game' &&
      reducerState.turn !== reducerState.playerColor &&
      reducerState.piecePromoting !== null
    ) {
      dispatch({ type: 'PiecePromotion', payload: 'queen' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducerState.piecePromoting]);

  useEffect(() => {
    const audioMutedLocalStorage = !!localStorage.getItem('mute');
    if (userHasInteracted && !audioMutedLocalStorage) {
      dispatch({ type: 'Unmute' });
    }
  }, [userHasInteracted]);

  useEffect(() => {
    if (reducerState.alwaysPromoteToQueen) {
      localStorage.setItem('alwaysPromoteToQueen', '1');
    } else {
      localStorage.removeItem('alwaysPromoteToQueen');
    }
  }, [reducerState.alwaysPromoteToQueen]);

  const handlePieceMove = useCallback(
    (indexes: PieceMoveIndexes) => {
      dispatch({
        type: 'PieceMove',
        payload: { move: indexes, audio },
      });
    },
    [audio]
  );

  const handlePiecePromotion = useCallback((promotion: PiecePromotionType) => {
    dispatch({ type: 'PiecePromotion', payload: promotion });
  }, []);

  const chessStyle = useMemo(
    () => ({ width: boardSize, height: boardSize }),
    [boardSize]
  );

  return (
    <div className={styles.container}>
      {reducerState.playerColor && reducerState.winner && winnerMinimize && (
        <div className={styles['winner-minimized']}>
          <Button onClick={handleLeave}>Leave</Button>
        </div>
      )}

      <div ref={chessWrapperRef} className={styles['chess-wrapper']}>
        <div className={styles['chess-turn']}>
          {reducerState.winner ? (
            <>
              {reducerState.winner.type === 'white' ||
              reducerState.winner.type === 'black' ? (
                <>
                  <p>
                    Winner:{' '}
                    {reducerState.winner.type[0].toUpperCase() +
                      reducerState.winner.type.slice(1)}
                  </p>
                  <IconTrophy className={styles['winner-trophy']} />
                </>
              ) : (
                <p>Draw!</p>
              )}
            </>
          ) : (
            <>
              <p className={styles['chess-turn__p']}>
                <span className={styles['chess-turn__span']}>Turn: </span>
                {reducerState.turn[0].toUpperCase() + reducerState.turn.slice(1)}
              </p>
              <img
                src={require(`assets/images/piece/${pieceSets[pieceSet]}/${reducerState.turn[0]}P.svg`)}
                alt=""
                className={styles['chess-turn__img']}
              />
            </>
          )}
        </div>
        <Chess
          pieces={reducerState.pieces}
          pieceSet={pieceSet}
          boardType={boardType}
          pieceMoves={reducerState.pieceMoves}
          latestMove={reducerState.latestMove}
          piecePromoting={reducerState.piecePromoting}
          boardSize={boardSize}
          onPieceMove={handlePieceMove}
          onPiecePromotion={handlePiecePromotion}
          turn={reducerState.turn}
          disable={isReplaying || !!reducerState.winner}
          highlightMoves={highlightMoves}
          playerColor={reducerState.playerColor}
          controlBoth={gamemode === 'freeplay'}
          style={chessStyle}
        />

        {reducerState.playerColor && reducerState.winner && !winnerMinimize && (
          <AlertOutsideClick
            shouldHandle={!!reducerState.winner}
            onOutsideClick={handleWinnerOutsideClick}
            ignore={[resignConfirmRef]}
          >
            <Winner
              textWinner={
                gamemode === 'freeplay'
                  ? reducerState.winner.type === 'draw'
                    ? 'Draw!'
                    : `${
                        reducerState.winner.type[0].toUpperCase() +
                        reducerState.winner.type.slice(1)
                      } Won!`
                  : reducerState.winner
                  ? reducerState.winner.type === reducerState.playerColor
                    ? 'You Won!'
                    : reducerState.winner.type === 'draw'
                    ? 'Draw'
                    : 'You Lost!'
                  : ''
              }
              reason={reducerState.winner.reason}
            />
          </AlertOutsideClick>
        )}
      </div>

      <Controls
        audioMuted={reducerState.audioMute}
        isCustomizing={reducerState.isCustomizing}
        onAudioToggle={() => dispatch({ type: 'ToggleAudio' })}
        onCustomizeToggle={handleCustomizeToggle}
      />
      <Sidebar
        movesTimelineNotation={reducerState.movesTimelineNotation}
        replay={reducerState.replay}
        handleReplay={(val) =>
          dispatch({ type: 'Replay', payload: { replay: val, audio } })
        }
        winner={reducerState.winner}
        onResign={handleResign}
        isCustomizing={reducerState.isCustomizing}
        onCustomizeClose={handleCustomizeClose}
        pieceSet={pieceSet}
        setPieceSet={setPieceSet}
        boardType={boardType}
        setBoardType={setBoardType}
        boardSizePercentage={boardSizePercentage}
        setBoardSizePercentage={setBoardSizePercentage}
        highlightMoves={highlightMoves}
        setHighlightMoves={setHighlightMoves}
        alwaysPromoteToQueen={reducerState.alwaysPromoteToQueen}
        toggleAlwaysPromoteToQueen={() =>
          dispatch({ type: 'ToggleAlwaysPromoteToQueen' })
        }
        resignConfirmRef={resignConfirmRef}
    />
    </div>
  );
}
