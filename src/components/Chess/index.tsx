import { useState, useEffect } from 'react';
import {
  ChessPieces,
  PieceMoveIndexes,
  PiecePromotionType,
  PieceMoves,
  PieceColor,
} from 'types';
import { getPieceMoves } from 'helpers';
import Board from './Board';
import Pieces from './Pieces';
import Arrows from './Arrows';
import styles from 'styles/Chess/Chess.module.scss';

interface Props {
  boardSize: number;
  boardType: number;
  pieceSet: number;
  pieces: ChessPieces;
  turn: PieceColor;
  latestMove: PieceMoveIndexes | null;
  piecePromoting: number | null;
  controlBoth: boolean;
  onPieceMove: (indexes: PieceMoveIndexes) => void;
  onPiecePromotion: (promotion: PiecePromotionType) => void;
  highlightMoves?: boolean;
  pieceMoves?: PieceMoves;
  playerColor?: PieceColor | null;
  disable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// [[fromColumn, fromRow], [toColumn, toRow]]
export type ArrowDataType = [[number, number], [number, number]];

let rightClickStartX = 0;
let rightClickStartY = 0;

export default function Chess(props: Props) {
  const {
    pieces,
    pieceMoves,
    latestMove,
    boardType,
    turn,
    piecePromoting,
    boardSize,
    controlBoth,
    onPieceMove,
    onPiecePromotion,
    highlightMoves = true,
    playerColor = 'white',
    pieceSet,
    disable = false,
    className,
    style,
  } = props;

  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [activePieceIndex, setActivePieceIndex] = useState<number | null>(null);
  const [focusedSquare, setFocusedSquare] = useState(-1);
  const [dataArrows, setDataArrows] = useState<ArrowDataType[]>([]);

  const squareSize = boardSize / 8;

  const handlePieceMove = (indexes: PieceMoveIndexes) => {
    if (!validMoves.includes(indexes.to)) return;

    setActivePieceIndex(null);
    setValidMoves([]);
    onPieceMove(indexes);
  };

  const handleBoardBlur = () => {
    setFocusedSquare(-1);
  };

  const handleArrowStart = (coords: { x: number; y: number }) => {
    rightClickStartX = coords.x;
    rightClickStartY = coords.y;
  };

  const handleArrowEnd = (coords: { x: number; y: number }) => {
    if (
      rightClickStartX === 0 ||
      rightClickStartY === 0 ||
      Object.values(coords).some((coord) => coord < 1 || coord > boardSize)
    ) {
      return;
    }
    const colFrom = Math.ceil(rightClickStartX / (boardSize / 8));
    const rowFrom = Math.ceil(rightClickStartY / (boardSize / 8));
    const colTo = Math.ceil(coords.x / (boardSize / 8));
    const rowTo = Math.ceil(coords.y / (boardSize / 8));

    if (colFrom === colTo && rowFrom === rowTo) return;

    setDataArrows((state) => {
      const filterDuplicate = state.filter(
        (arrow) =>
          arrow[0][0] !== colFrom ||
          arrow[0][1] !== rowFrom ||
          arrow[1][0] !== colTo ||
          arrow[1][1] !== rowTo
      );

      if (filterDuplicate.length !== state.length) return filterDuplicate;
      return [
        ...state,
        [
          [colFrom, rowFrom],
          [colTo, rowTo],
        ],
      ];
    });
  };

  const handleArrowClear = () => {
    setDataArrows([]);
    rightClickStartX = 0;
    rightClickStartY = 0;
  };

  useEffect(() => {
    if (disable) {
      setValidMoves([]);
      return;
    }

    if (
      activePieceIndex !== null &&
      piecePromoting === null &&
      pieces[activePieceIndex]?.color === turn
    ) {
      setValidMoves(
        (pieceMoves && pieceMoves[activePieceIndex]) ||
          getPieceMoves(activePieceIndex, latestMove, pieces)
      );
    } else {
      setValidMoves([]);
    }
  }, [
    pieces,
    activePieceIndex,
    pieceMoves,
    latestMove,
    disable,
    turn,
    piecePromoting,
  ]);

  return (
    <div className={className} style={style}>
      <div
        className={styles.container}
        onBlur={handleBoardBlur}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Board
          type={boardType}
          size={boardSize}
          activePieceIndex={activePieceIndex}
          latestMove={latestMove}
          playerColor={playerColor}
          focusedSquare={focusedSquare}
          validMoves={validMoves}
          highlightMoves={highlightMoves}
          pieces={pieces}
        />
        {playerColor && (
          <Pieces
            turn={turn}
            boardSize={boardSize}
            pieces={pieces}
            playerColor={playerColor}
            controlBoth={controlBoth}
            piecePromoting={piecePromoting}
            onPromotion={onPiecePromotion}
            pieceSet={pieceSet}
            squareSize={squareSize}
            activePieceIndex={activePieceIndex}
            onMove={handlePieceMove}
            setActivePieceIndex={setActivePieceIndex}
            setFocusedSquare={setFocusedSquare}
            onArrowStart={handleArrowStart}
            onArrowEnd={handleArrowEnd}
            onArrowClear={handleArrowClear}
          />
        )}
        <Arrows data={dataArrows} boardSize={boardSize} />
      </div>
    </div>
  );
}
