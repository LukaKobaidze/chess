export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PiecePromotionType = 'queen' | 'rook' | 'bishop' | 'knight';
export type PieceColor = 'white' | 'black';

export interface PieceInterface {
  type: PieceType;
  color: PieceColor;
  movedBefore: boolean;
}

export type ChessPieces = { [key: number]: PieceInterface };

export type PieceMoves = { [key: number]: number[] };

export type WinnerPlayerReason = 'Checkmate' | 'Resignation' | 'Timeout';
export type WinnerDrawReason =
  | 'Stalemate'
  | 'Mutual Agreement'
  | 'Threefold Repetition'
  | 'Insufficient Material';

export type ChessWinner =
  | { type: PieceColor; reason: WinnerPlayerReason }
  | { type: 'draw'; reason: WinnerDrawReason };

export type PieceMoveIndexes = { from: number; to: number };

export type TimelineMove = PieceMoveIndexes & { promotion?: PiecePromotionType };

export type SideType = 'white' | 'black' | 'random';

export type ArrowDataType = [[number, number], [number, number]];
