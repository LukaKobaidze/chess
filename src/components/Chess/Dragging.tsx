import { useEffect, useState } from 'react';
import { PieceColor, PieceInterface, PieceMoveIndexes } from 'types';
import { pieceSets } from 'data';
import { getPieceLetter, getSquareByCoords } from 'helpers';
import styles from 'styles/Chess/Pieces.module.scss';

type Coords = { x: number; y: number };

interface Props {
  playerColor: PieceColor;
  boardSize: number;
  pieceSet: number;
  piece: PieceInterface | null;
  pieceSize: number;
  onArrowEnd: (coords: Coords) => void;
  setActivePieceIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setFocusedSquare: React.Dispatch<React.SetStateAction<number>>;
  setPieceDragging: React.Dispatch<React.SetStateAction<number | null>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  getPointerWindowCoords: (e: any) => Coords;
  getPointerBoardCoords: (e: any) => Coords | null;
  onMove: (indexes: PieceMoveIndexes) => void;
  activePieceIndex: number | null;
}

export default function Dragging(props: Props) {
  const {
    playerColor,
    boardSize,
    pieceSet,
    piece,
    pieceSize,
    onArrowEnd,
    setFocusedSquare,
    setPieceDragging,
    setIsDragging,
    getPointerWindowCoords,
    getPointerBoardCoords,
    activePieceIndex,
    setActivePieceIndex,
    onMove,
  } = props;

  const [pieceDragCoords, setPieceDragCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const pieceHalf = pieceSize / 2;

  useEffect(() => {
    const handlePieceDrag = (e: any) => {
      setIsDragging(true);
      setPieceDragCoords(getPointerWindowCoords(e));

      const pieceBoardCoords = getPointerBoardCoords(e);
      if (!pieceBoardCoords) return;

      setFocusedSquare(
        getSquareByCoords(pieceBoardCoords, boardSize, playerColor) || -1
      );
    };

    if (piece) {
      document.addEventListener('mousemove', handlePieceDrag);
      document.addEventListener('touchmove', handlePieceDrag);
    } else {
      document.removeEventListener('mousemove', handlePieceDrag);
      document.removeEventListener('touchmove', handlePieceDrag);
    }

    return () => {
      document.removeEventListener('mousemove', handlePieceDrag);
      document.removeEventListener('touchmove', handlePieceDrag);
    };
  }, [
    piece,
    boardSize,
    getPointerBoardCoords,
    getPointerWindowCoords,
    playerColor,
    setFocusedSquare,
    setIsDragging,
  ]);

  useEffect(() => {
    const handlePieceUp = (e: any) => {
      setPieceDragging(null);
      setIsDragging(false);
      setFocusedSquare(-1);

      const boardCoords = getPointerBoardCoords(e);
      if (!boardCoords || !activePieceIndex) return;
      const moveTo = getSquareByCoords(boardCoords, boardSize, playerColor);
      if (!moveTo) return;

      onMove({
        from: activePieceIndex,
        to: moveTo,
      });

      if (pieceDragCoords === null && moveTo !== activePieceIndex) {
        setActivePieceIndex(null);
      }

      setPieceDragCoords(null);
    };

    document.addEventListener('mouseup', handlePieceUp);
    document.addEventListener('touchend', handlePieceUp);

    return () => {
      document.removeEventListener('mouseup', handlePieceUp);
      document.removeEventListener('touchend', handlePieceUp);
    };
  }, [
    activePieceIndex,
    boardSize,
    getPointerBoardCoords,
    onArrowEnd,
    onMove,
    playerColor,
    setFocusedSquare,
    setPieceDragging,
    setIsDragging,
    pieceDragCoords,
    setActivePieceIndex,
  ]);

  return pieceDragCoords && piece ? (
    <img
      id="piece"
      src={require(`assets/images/piece/${pieceSets[pieceSet]}/${piece.color[0]}${
        getPieceLetter(piece.type) || 'P'
      }.svg`)}
      alt={`${piece.color} ${piece.type}`}
      className={styles['dragging-image']}
      draggable={false}
      style={{
        width: pieceSize,
        height: pieceSize,
        transform: `translate(${pieceDragCoords.x - pieceHalf}px, ${
          pieceDragCoords.y - pieceHalf
        }px)`,
      }}
    />
  ) : (
    <></>
  );
}
