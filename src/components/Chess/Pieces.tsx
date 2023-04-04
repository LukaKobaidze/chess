import { useRef, useState } from 'react';
import {
  ChessPieces,
  PieceColor,
  PieceMoveIndexes,
  PiecePromotionType,
} from 'types';
import { getPieceLetter, getCoordsBySquare } from 'helpers';
import { pieceSets } from 'data';
import Dragging from './Dragging';
import styles from 'styles/Chess/Pieces.module.scss';

type Coords = { x: number; y: number };

interface Props {
  pieces: ChessPieces;
  boardSize: number;
  squareSize: number;
  playerColor: PieceColor;
  turn: PieceColor;
  pieceSet: number;
  piecePromoting: number | null;
  controlBoth: boolean;
  onPromotion: (promotion: PiecePromotionType) => void;
  onMove: (indexes: PieceMoveIndexes) => void;
  activePieceIndex: number | null;
  setActivePieceIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setFocusedSquare: React.Dispatch<React.SetStateAction<number>>;
  onArrowStart: (coords: Coords) => void;
  onArrowEnd: (coords: Coords) => void;
  onArrowClear: () => void;
}

export default function Pieces(props: Props) {
  const {
    pieces,
    boardSize,
    squareSize,
    playerColor,
    pieceSet,
    turn,
    piecePromoting,
    controlBoth,
    onPromotion,
    onMove,
    activePieceIndex,
    setActivePieceIndex,
    setFocusedSquare,
    onArrowStart,
    onArrowEnd,
    onArrowClear,
  } = props;

  const [pieceDragging, setPieceDragging] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const piecesKeys = Object.keys(pieces);
  const pieceSize = squareSize * 0.87;

  const getPointerWindowCoords = (e: any): Coords => {
    let x = e.clientX;
    let y = e.clientY;

    if (x === undefined) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    }

    return { x, y };
  };

  const getPointerBoardCoords = (e: any): Coords | null => {
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return null;
    const { x, y } = getPointerWindowCoords(e);

    return {
      x: x - container.left,
      y: y - container.top,
    };
  };

  const handleBoardDown = (e: any) => {
    if (e?.which === 3 || e?.button === 2) {
      // Mouse RIGHT click
      const boardCoords = getPointerBoardCoords(e);
      if (boardCoords) {
        onArrowStart(boardCoords);
      }
    } else {
      onArrowClear();
      const index = Number(e.target.dataset.index);
      if (isNaN(index)) return;
      setPieceDragging(index);
      setActivePieceIndex(index);
    }
  };

  const handleBoardUp = (e: any) => {
    if (e?.which === 3 || e?.button === 2) {
      const boardCoords = getPointerBoardCoords(e);
      if (boardCoords) {
        onArrowEnd(boardCoords);
      }
    }
  };

  const piecePromotingCoords = piecePromoting
    ? getCoordsBySquare(piecePromoting, playerColor, squareSize)
    : null;

  const boardSizeHalf = boardSize / 2;

  return (
    <div
      ref={containerRef}
      className={styles.pieces}
      onMouseDown={handleBoardDown}
      onMouseUp={handleBoardUp}
      onTouchStart={handleBoardDown}
    >
      {piecesKeys.map((key) => {
        const index = Number(key);
        const piece = pieces[index];
        const { x, y } = getCoordsBySquare(index, playerColor, squareSize);

        return (
          <div
            key={index}
            className={styles['piece-double-wrapper']}
            style={{
              width: squareSize,
              height: squareSize,
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div
              className={`${styles['piece-wrapper']} ${
                (!controlBoth && playerColor === piece.color) ||
                (controlBoth && turn === piece.color)
                  ? styles['piece-wrapper-draggable']
                  : ''
              } ${
                index === pieceDragging && isDragging
                  ? styles['piece-wrapper-dragging']
                  : ''
              }`}
              tabIndex={-1}
              data-index={index}
            >
              <img
                id="piece"
                src={require(`assets/images/piece/${pieceSets[pieceSet]}/${
                  piece.color[0]
                }${getPieceLetter(piece.type) || 'P'}.svg`)}
                alt={`${piece.color} ${piece.type}`}
                className={styles.piece}
                style={{ width: pieceSize, height: pieceSize }}
                draggable={false}
              />
            </div>
          </div>
        );
      })}

      {piecePromoting && piecePromotingCoords && (
        <div
          className={styles.promotion}
          style={{
            top:
              piecePromotingCoords.y +
              (piecePromotingCoords.y < boardSizeHalf ? squareSize + 4 : -4),
            left: piecePromotingCoords.x + 5,
            transform: `translateY(${
              piecePromotingCoords.y > boardSizeHalf ? '-100%' : '0'
            })`,
          }}
        >
          {(['queen', 'knight', 'rook', 'bishop'] as PiecePromotionType[]).map(
            (piecePromote) => (
              <button
                key={piecePromote}
                className={styles['promotion__button']}
                onClick={() =>
                  onPromotion && onPromotion(piecePromote as PiecePromotionType)
                }
              >
                <img
                  src={require(`assets/images/piece/${pieceSets[pieceSet]}/${
                    pieces[piecePromoting].color[0]
                  }${getPieceLetter(piecePromote) || 'P'}.svg`)}
                  alt={`${playerColor} ${piecePromote}`}
                  style={{ width: pieceSize - 10, height: pieceSize - 10 }}
                />
              </button>
            )
          )}
        </div>
      )}

      <Dragging
        activePieceIndex={activePieceIndex}
        boardSize={boardSize}
        getPointerBoardCoords={getPointerBoardCoords}
        getPointerWindowCoords={getPointerWindowCoords}
        onArrowEnd={onArrowEnd}
        onMove={onMove}
        piece={pieceDragging ? pieces[pieceDragging] : null}
        pieceSet={pieceSet}
        pieceSize={pieceSize}
        playerColor={playerColor}
        setActivePieceIndex={setActivePieceIndex}
        setFocusedSquare={setFocusedSquare}
        setPieceDragging={setPieceDragging}
        setIsDragging={setIsDragging}
      />
    </div>
  );
}
