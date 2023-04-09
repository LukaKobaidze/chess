import { useEffect, useState } from 'react';
import { ChessPieces, PieceColor, PieceMoveIndexes } from 'types';
import { boards, FILES, RANKS } from 'data';
import { getCoordsBySquare } from 'helpers';
import styles from 'styles/Chess/Board.module.scss';

interface Props {
  type: number;
  size: number;
  activePieceIndex: number | null;
  playerColor: PieceColor | null;
  latestMove: PieceMoveIndexes | null;
  focusedSquare: number;
  validMoves: number[];
  highlightMoves: boolean;
  pieces: ChessPieces;
}

export default function Board(props: Props) {
  const {
    type,
    size,
    activePieceIndex,
    latestMove,
    playerColor,
    focusedSquare,
    validMoves,
    highlightMoves,
    pieces,
  } = props;

  const [focusedSquareCoords, setFocusedSquareCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [highlights, setHighlights] = useState<number[]>([]);

  const squareSize = size / 8;

  useEffect(() => {
    if (!playerColor) return;

    setFocusedSquareCoords(
      focusedSquare !== -1
        ? getCoordsBySquare(focusedSquare, playerColor, squareSize)
        : null
    );
  }, [focusedSquare, playerColor, squareSize]);

  useEffect(() => {
    let arr = latestMove ? Object.values(latestMove) : [];
    if (activePieceIndex && !arr.includes(activePieceIndex)) {
      arr.push(activePieceIndex);
    }
    setHighlights(arr);
  }, [activePieceIndex, latestMove]);

  const containerStyle = {
    '--square-size': `${squareSize}px`,
    width: size,
    height: size,
  } as React.CSSProperties;

  const filesRender = playerColor === 'white' ? FILES : [...FILES].reverse();
  const ranksRender = playerColor === 'black' ? RANKS : [...RANKS].reverse();

  const coordsStyle = {
    '--font-size': squareSize / 5 + 'px',
  } as React.CSSProperties;

  const boardType = boards[type];

  return (
    <div className={styles.container} style={containerStyle}>
      <img
        src={require(`assets/images/board/${boardType.image}`)}
        alt=""
        style={{ width: size, height: size }}
      />

      <div style={coordsStyle}>
        <div className={styles.ranks}>
          {ranksRender.map((rank, i) => (
            <span key={rank} style={{ color: boardType.coords[i % 2] }}>
              {rank}
            </span>
          ))}
        </div>
        <div className={styles.files}>
          {filesRender.map((file, i) => (
            <span
              key={file}
              style={{ color: boardType.coords[i % 2 === 0 ? 1 : 0] }}
            >
              {file}
            </span>
          ))}
        </div>
      </div>

      {playerColor &&
        highlights.map((index) => {
          const { x, y } = getCoordsBySquare(index, playerColor, squareSize);

          return (
            <div
              key={index}
              className={`${styles.square} ${styles['square-highlight']}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            />
          );
        })}

      {focusedSquareCoords && (
        <div
          className={`${styles.square} ${styles['square-focused']}`}
          style={{
            transform: `translate(${focusedSquareCoords.x}px, ${focusedSquareCoords.y}px)`,
          }}
        />
      )}

      {highlightMoves &&
        playerColor &&
        validMoves.map((validMove) => {
          const { x, y } = getCoordsBySquare(validMove, playerColor, squareSize);

          return (
            <div
              key={validMove}
              className={`${styles.square} ${
                pieces[validMove]
                  ? styles['square-validCapture']
                  : styles['square-validMove']
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            />
          );
        })}
    </div>
  );
}
