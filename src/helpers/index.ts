import { FILES, PIECE_LETTERS, RANKS } from 'data';
import {
  ChessPieces,
  ChessWinner,
  PieceColor,
  PieceMoveIndexes,
  PieceMoves,
  PiecePromotionType,
  PieceType,
  TimelineMove,
} from 'types';

export function globalCSSVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * @param milliseconds Number of milliseconds
 * @returns Formatted string (only minutes and seconds) | 600000 => '10:00'
 */
export function formatMilliseconds(milliseconds: number): string {
  // const minutes = ('0' + Math.floor(milliseconds / 60000)).slice(-2);
  let minutes = Math.floor(milliseconds / 60000);
  let seconds = Math.floor((milliseconds % 60000) / 1000);

  // if (seconds === 60) {
  //   minutes += 1;
  //   seconds = 0;
  // }

  return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

export const getSquareByCoords = (
  { x, y }: { x: number; y: number },
  boardSize: number,
  playerColor: PieceColor
): number | null => {
  if ([x, y].some((coords) => coords < 0 || coords > boardSize)) {
    return null;
  }

  const squareSize = boardSize / 8;
  let col = Math.trunc(Math.ceil(x / squareSize));
  let row = Math.trunc(9 - Math.ceil(y / squareSize));

  const output =
    playerColor === 'white' ? 8 * (row - 1) + (9 - col) : 8 * (8 - row) + col;

  return output;
};

export const getCoordsBySquare = (
  index: number,
  playerColor: PieceColor,
  squareSize: number
): { x: number; y: number } => {
  const col = getColumn(index, playerColor);
  const row = getRow(index, playerColor);

  return { x: squareSize * (col - 1), y: squareSize * (8 - row) };
};

export function initializePieces(): ChessPieces {
  return {
    9: { type: 'pawn', color: 'white', movedBefore: false },
    10: { type: 'pawn', color: 'white', movedBefore: false },
    11: { type: 'pawn', color: 'white', movedBefore: false },
    12: { type: 'pawn', color: 'white', movedBefore: false },
    13: { type: 'pawn', color: 'white', movedBefore: false },
    14: { type: 'pawn', color: 'white', movedBefore: false },
    15: { type: 'pawn', color: 'white', movedBefore: false },
    16: { type: 'pawn', color: 'white', movedBefore: false },
    49: { type: 'pawn', color: 'black', movedBefore: false },
    50: { type: 'pawn', color: 'black', movedBefore: false },
    51: { type: 'pawn', color: 'black', movedBefore: false },
    52: { type: 'pawn', color: 'black', movedBefore: false },
    53: { type: 'pawn', color: 'black', movedBefore: false },
    54: { type: 'pawn', color: 'black', movedBefore: false },
    55: { type: 'pawn', color: 'black', movedBefore: false },
    56: { type: 'pawn', color: 'black', movedBefore: false },
    7: { type: 'knight', color: 'white', movedBefore: false },
    2: { type: 'knight', color: 'white', movedBefore: false },
    58: { type: 'knight', color: 'black', movedBefore: false },
    63: { type: 'knight', color: 'black', movedBefore: false },
    3: { type: 'bishop', color: 'white', movedBefore: false },
    6: { type: 'bishop', color: 'white', movedBefore: false },
    59: { type: 'bishop', color: 'black', movedBefore: false },
    62: { type: 'bishop', color: 'black', movedBefore: false },
    1: { type: 'rook', color: 'white', movedBefore: false },
    8: { type: 'rook', color: 'white', movedBefore: false },
    57: { type: 'rook', color: 'black', movedBefore: false },
    64: { type: 'rook', color: 'black', movedBefore: false },
    5: { type: 'queen', color: 'white', movedBefore: false },
    61: { type: 'queen', color: 'black', movedBefore: false },
    4: { type: 'king', color: 'white', movedBefore: false },
    60: { type: 'king', color: 'black', movedBefore: false },
  };
}

export function getRobotMove(
  pieces: ChessPieces,
  pieceMoves: PieceMoves
): PieceMoveIndexes | null {
  const movablePieceKeys = Object.keys(pieceMoves);
  if (movablePieceKeys.length === 0) return null;

  const capturePriority: { [key: string]: number } = {
    pawn: 0,
    knight: 1,
    bishop: 2,
    rook: 3,
    queen: 4,
  };

  const captureMove = movablePieceKeys.reduce<PieceMoveIndexes | null>(
    (acc, key) => {
      const index = Number(key);
      let moveCapturing: number;

      pieceMoves[index].forEach((move) => {
        const capturing = pieces[move];
        if (capturing) {
          if (
            moveCapturing === undefined ||
            capturePriority[capturing.type] >
              capturePriority[pieces[moveCapturing].type]
          ) {
            moveCapturing = move;
          }
        }
      });

      if (
        moveCapturing! &&
        (!acc ||
          capturePriority[pieces[moveCapturing].type] >
            capturePriority[pieces[acc.to].type])
      ) {
        return { from: index, to: moveCapturing };
      }
      return acc;
    },
    null
  );

  if (captureMove) {
    return captureMove;
  }

  const randomPieceIndex = Number(
    movablePieceKeys[Math.floor(Math.random() * movablePieceKeys.length)]
  );
  const randomPieceMoves = pieceMoves[randomPieceIndex];

  if (randomPieceMoves.length === 0) return null;

  const randomMove =
    randomPieceMoves[
      Math.floor(Math.random() * Object.keys(randomPieceMoves).length)
    ];

  return { from: randomPieceIndex, to: randomMove };
}

export function getSquareRank(index: number): string {
  return RANKS[getRow(index) - 1];
}

export function getSquareFile(index: number): string {
  return FILES[getColumn(index) - 1];
}

export function getSquareCoords(index: number): string {
  return getSquareFile(index) + getSquareRank(index);
}

export function getPieceLetter(piece: PieceType): string {
  return PIECE_LETTERS[piece];
}

export function getMoveNotation(
  move: TimelineMove,
  piecesBeforeMove: ChessPieces,
  previousMove: PieceMoveIndexes | null
): string {
  const movingPiece = piecesBeforeMove[move.from];
  if (!movingPiece) return '';
  const isCapture = !!piecesBeforeMove[move.to];
  const opponentColor = movingPiece.color === 'white' ? 'black' : 'white';
  const movingPieceLetter = getPieceLetter(movingPiece.type);
  const squareCoords = getSquareCoords(move.to);
  const piecesKeys = Object.keys(piecesBeforeMove);

  let output = movingPieceLetter;

  const pieceCanMoveToSameSquare = Number(
    piecesKeys.find((key) => {
      const index = Number(key);
      const piece = piecesBeforeMove[index];

      return (
        index !== move.from &&
        piece.type === movingPiece.type &&
        getPieceMoves(index, previousMove, piecesBeforeMove).includes(move.to)
      );
    })
  );

  // castling
  if (
    movingPiece.type === 'king' &&
    [move.from + 2, move.from - 2].includes(move.to)
  ) {
    const toCol = getColumn(move.to);
    if (toCol === 3) return '0-0-0';
    return '0-0';
  }

  const isEnPassant =
    movingPiece.type === 'pawn' &&
    correctDirection([7, 9], movingPiece.color)
      .map((index) => move.from + index)
      .includes(move.to) &&
    !piecesBeforeMove[move.to];

  if (isEnPassant) {
    output += getSquareFile(move.from) + 'x';
  } else if (pieceCanMoveToSameSquare) {
    const movingPieceFile = getSquareFile(move.from);

    if (movingPieceFile !== getSquareFile(pieceCanMoveToSameSquare)) {
      output += movingPieceFile;
    } else {
      output += getSquareRank(move.from);
    }
  }

  output += (isCapture ? 'x' : '') + squareCoords;

  if (move.promotion) output += `=${getPieceLetter(move.promotion)}`;

  const pieces = pieceMove(move, piecesBeforeMove);
  if (
    isKingInCheck(getKingIndex(opponentColor, pieces), opponentColor, move, pieces)
  ) {
    output += '+';
  }

  return output;
}

export function getKingIndex(color: PieceColor, pieces: ChessPieces): number {
  return Number(
    Object.keys(pieces).find((key) => {
      const piece = pieces[Number(key)];
      return piece.type === 'king' && piece.color === color;
    })
  );
}

export function pieceMove(move: TimelineMove, pieces: ChessPieces): ChessPieces {
  const piecesOutput: ChessPieces = {};
  const movingPiece = pieces[move.from];

  if (!movingPiece) return pieces;

  delete Object.assign(piecesOutput, pieces, {
    [move.to]: {
      ...movingPiece,
      type: move.promotion || movingPiece.type,
      movedBefore: true,
    },
  })[move.from];

  // Castling
  if (
    movingPiece.type === 'king' &&
    (move.from - 2 === move.to || move.from + 2 === move.to)
  ) {
    if (move.from > move.to) {
      const rookIndex = movingPiece.color === 'white' ? 1 : 57;

      delete Object.assign(piecesOutput, {
        [move.to + 1]: {
          ...pieces[rookIndex],
          movedBefore: true,
        },
      })[rookIndex];
    } else {
      const rookIndex = movingPiece.color === 'white' ? 8 : 64;

      delete Object.assign(piecesOutput, {
        [move.to - 1]: {
          ...pieces[rookIndex],
          movedBefore: true,
        },
      })[rookIndex];
    }
    return piecesOutput;
  }

  // En-Passant
  const enPassantCapturing = move.to + correctDirection([-8], movingPiece.color)[0];

  const isPawnCaptureMove = correctDirection([7, 9], movingPiece.color)
    .map((capture) => move.from + capture)
    .includes(move.to);

  if (
    movingPiece.type === 'pawn' &&
    !pieces.hasOwnProperty(move.to) &&
    isPawnCaptureMove &&
    pieces[enPassantCapturing]?.type === 'pawn'
  ) {
    delete piecesOutput[enPassantCapturing];
  }

  return piecesOutput;
}

export function piecePromotion(
  index: number,
  promotion: PiecePromotionType,
  pieces: ChessPieces
): ChessPieces {
  const piecesCopy = Object.keys(pieces).reduce((obj: ChessPieces, key) => {
    const index = Number(key);
    obj[index] = pieces[index];
    return obj
  }, {});

  piecesCopy[index].type = promotion;
  return piecesCopy;
}

export function getPieceMoves(
  index: number,
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): number[] {
  const pseudoLegalMoves = getPseudoLegalMoves(index, latestMove, pieces);

  let kingIndex =
    pieces[index].type !== 'king' && getKingIndex(pieces[index].color, pieces);

  return pseudoLegalMoves.filter((move) => {
    const piecesAfterMove = pieceMove({ from: index, to: move }, pieces);

    return !isKingInCheck(
      kingIndex === false ? move : kingIndex,
      pieces[index].color,
      latestMove,
      piecesAfterMove
    );
  });
}

function isKingInCheck(
  kingIndex: number,
  kingColor: PieceColor,
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): boolean {
  const keys = Object.keys(pieces);

  return keys.some((key) => {
    if (pieces[Number(key)].color === kingColor) return false;

    return getPseudoLegalMoves(Number(key), latestMove, pieces).includes(kingIndex);
  });
}

function getPseudoLegalMoves(
  index: number,
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): number[] {
  switch (pieces[index]?.type) {
    case 'pawn':
      return getPawnMoves(index, latestMove, pieces);
    case 'knight':
      return getKnightMoves(index, pieces);
    case 'rook':
      return getRookMoves(index, pieces);
    case 'bishop':
      return getBishopMoves(index, pieces);
    case 'queen':
      return getQueenMoves(index, pieces);
    case 'king':
      return getKingMoves(index, pieces);
    default:
      return [];
  }
}

export function getPawnMoves(
  index: number,
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): number[] {
  const movingPiece = pieces[index];
  if (!movingPiece) return [];

  let moves = correctDirection([8, 16], movingPiece.color).map(
    (move) => move + index
  );
  if (movingPiece.movedBefore || pieces[moves[1]]) moves.pop();
  if (pieces[moves[0]]) moves = [];

  const rowPiece = getRow(index);
  let captures = correctDirection([7, 9], movingPiece.color).flatMap((move) => {
    const squareIndex = move + index;
    const row = getRow(squareIndex);
    const piece = pieces[squareIndex];

    if (
      piece &&
      piece.color !== movingPiece.color &&
      row !== rowPiece &&
      [row - 1, row + 1].includes(rowPiece)
    ) {
      return squareIndex;
    }
    return [];
  });

  return moves.concat(captures, getEnPassant(index, latestMove, pieces) || []);
}

export function getKnightMoves(index: number, pieces: ChessPieces): number[] {
  const moves = [17, 15, 6, 10, -17, -15, -6, -10];
  const knight = pieces[index];
  const knightCol = getColumn(index);

  return moves.flatMap((move) => {
    const squareIndex = move + index;
    const piece = pieces[squareIndex];
    const col = getColumn(squareIndex);

    if (
      !squareIndexExists(squareIndex) ||
      (piece && piece.color === knight.color) ||
      ![knightCol - 2, knightCol - 1, knightCol + 1, knightCol + 2].includes(col)
    ) {
      return [];
    }
    return squareIndex;
  });
}

export function getRookMoves(index: number, pieces: ChessPieces): number[] {
  const directions = [8, 1, -8, -1];

  return directions.reduce((acc: number[], direction) => {
    let i = index + direction;
    let moves: number[] = [];
    if (direction === 1 || direction === -1) {
      while (!pieces[i] && squareIndexExists(i) && getRow(i) === getRow(index)) {
        moves.push(i);
        i += direction;
      }
      if (
        getRow(i) === getRow(index) &&
        pieces[i] &&
        pieces[index] &&
        pieces[i].color !== pieces[index].color
      ) {
        moves.push(i);
      }
    } else {
      while (!pieces[i] && squareIndexExists(i)) {
        moves.push(i);
        i += direction;
      }
      if (pieces[i] && pieces[index] && pieces[i].color !== pieces[index].color) {
        moves.push(i);
      }
    }

    return acc.concat(moves);
  }, []);
}

export function getBishopMoves(index: number, pieces: ChessPieces): number[] {
  const directions = [7, 9, -7, -9];

  const pieceRow = getRow(index);
  return directions.reduce((acc: number[], direction) => {
    let moves: number[] = [];
    let i = index + direction;

    while (squareIndexExists(i) && !pieces[i]) {
      const squareRow = getRow(i);
      const prevSquareRow = getRow(i - direction);
      if (
        pieceRow === squareRow ||
        squareRow - 2 === prevSquareRow ||
        squareRow + 2 === prevSquareRow
      ) {
        break;
      }
      moves.push(i);
      if (
        Array.from({ length: 8 }, (_, i) => i + 1).includes(i) ||
        Array.from({ length: 8 }, (_, i) => i + 57).includes(i) ||
        i % 8 === 0 ||
        i % 8 === 1
      )
        break;
      i += direction;
    }
    const squareRow = getRow(i);
    const prevSquareRow = getRow(i - direction);

    if (
      pieces[i] &&
      pieces[index] &&
      pieces[i].color !== pieces[index].color &&
      squareRow !== prevSquareRow &&
      squareRow - 2 !== prevSquareRow &&
      squareRow + 2 !== prevSquareRow
    ) {
      moves.push(i);
    }

    return acc.concat(moves);
  }, []);
}

export function getQueenMoves(index: number, pieces: ChessPieces): number[] {
  return getRookMoves(index, pieces).concat(getBishopMoves(index, pieces));
}

export function getKingMoves(index: number, pieces: ChessPieces): number[] {
  const king = pieces[index];

  const validMoves = [7, 8, 9, 1, -9, -8, -7, -1].flatMap((move) => {
    const squareIndex = move + index;
    const piece = pieces[squareIndex];

    const kingCol = getColumn(index);
    const col = getColumn(squareIndex);
    if (
      !squareIndexExists(squareIndex) ||
      (kingCol !== col && kingCol - 1 !== col && kingCol + 1 !== col) ||
      (piece && piece.color === king.color)
    ) {
      return [];
    }

    return squareIndex;
  });

  const castlings = [2, -2].flatMap((castling) => {
    if (king.movedBefore) return [];

    const squareIndex = index + castling;
    const rookIndex = [
      squareIndex - 2,
      squareIndex - 1,
      squareIndex + 1,
      squareIndex + 2,
    ].find((index) => pieces[index] && pieces[index].type === 'rook');

    if (!rookIndex || pieces[rookIndex].movedBefore) return [];

    let between = Array.from(
      { length: Math.abs(index - rookIndex) - 1 },
      (_, i) => Math.min(index, rookIndex) + i + 1
    );

    if (between.some((index) => pieces.hasOwnProperty(index))) return [];

    return squareIndex;
  });

  return validMoves.concat(castlings);
}

export function getWinner(
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): ChessWinner | null {
  const piecesKeys = Object.keys(pieces);

  let indexKingWhite = -1;
  let indexKingBlack = -1;

  const allMoves = piecesKeys.reduce<{ white: number[]; black: number[] }>(
    (acc, key) => {
      const index = Number(key);
      const piece = pieces[index];
      const moves = getPieceMoves(index, latestMove, pieces);

      if (piece.type === 'king') {
        if (piece.color === 'white') {
          indexKingWhite = index;
        } else {
          indexKingBlack = index;
        }
      }

      acc[piece.color].push(...moves);
      return acc;
    },
    { white: [], black: [] }
  );

  if (indexKingWhite === -1) return { type: 'black', reason: 'Checkmate' };
  if (indexKingBlack === -1) return { type: 'white', reason: 'Checkmate' };

  // Stalemate
  if (
    [indexKingWhite, indexKingBlack].some((kingIndex) => {
      const king = pieces[kingIndex];
      const myMoves = allMoves[king.color];
      const opponentMoves = allMoves[king.color === 'white' ? 'black' : 'white'];

      return myMoves.length === 0 && !opponentMoves.includes(kingIndex);
    })
  ) {
    return { type: 'draw', reason: 'Stalemate' };
  }

  // Checkmate
  const checkmated = [indexKingWhite, indexKingBlack].find((kingIndex) => {
    const king = pieces[kingIndex];
    const myMoves = allMoves[king.color];
    const opponentMoves = allMoves[king.color === 'white' ? 'black' : 'white'];

    return myMoves.length === 0 && opponentMoves.includes(kingIndex);
  });

  if (checkmated)
    return {
      type: pieces[checkmated].color === 'white' ? 'black' : 'white',
      reason: 'Checkmate',
    };

  return null;
}

function getEnPassant(
  index: number,
  latestMove: PieceMoveIndexes | null,
  pieces: ChessPieces
): number | null {
  if (
    !latestMove ||
    pieces[index]?.type !== 'pawn' ||
    pieces[latestMove.to]?.type !== 'pawn' ||
    Math.abs(latestMove.from - latestMove.to) !== 16
  )
    return null;

  const pawnRow = getRow(index);
  const latestMoveToRow = getRow(latestMove.to);

  if (
    pawnRow === latestMoveToRow &&
    [index - 1, index + 1].includes(latestMove.to)
  ) {
    return latestMove.to + correctDirection([-8], pieces[latestMove.to].color)[0];
  }

  return null;
}

export function isPromotable(index: number, pieceType: PieceType): boolean {
  return (
    pieceType === 'pawn' &&
    [1, 2, 3, 4, 5, 6, 7, 8, 57, 58, 59, 60, 61, 62, 63, 64].includes(index)
  );
}

export function squareIndexExists(index: number): boolean {
  return index > 0 && index < 65;
}

export function getColumn(
  squareIndex: number,
  playerColor: PieceColor = 'white'
): number {
  const output = 9 - (squareIndex % 8 || 8);

  if (playerColor === 'black') return 9 - output;

  return output;
}
export function getRow(
  squareIndex: number,
  playerColor: PieceColor = 'white'
): number {
  const output = Math.ceil(squareIndex / 8);

  if (playerColor === 'black') return 9 - output;

  return output;
}

function correctDirection(moves: number[], color: 'white' | 'black'): number[] {
  return color === 'white'
    ? moves
    : moves.map((index) => (index < 0 ? Math.abs(index) : index * -1));
}
