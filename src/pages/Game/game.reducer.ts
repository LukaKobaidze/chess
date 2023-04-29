import {
  getMoveNotation,
  getPieceMoves,
  initializePieces,
  isPromotable,
  pieceMove,
  piecePromotion,
} from 'helpers';
import {
  ChessPieces,
  ChessWinner,
  PieceColor,
  PieceMoveIndexes,
  PieceMoves,
  PiecePromotionType,
  TimelineMove,
} from 'types';

interface ReducerState {
  turn: PieceColor;
  pieces: ChessPieces;
  movesTimeline: TimelineMove[];
  movesTimelineNotation: string[];
  replay: number;
  piecePromoting: number | null;
  winner: ChessWinner | null;
  playerColor: PieceColor | null;
  pieceMoves: PieceMoves;
  latestMove: PieceMoveIndexes | null;
  isCustomizing: boolean;
  latestPieceMoveDate: number;
  alwaysPromoteToQueen: boolean;
  audioMute: boolean;
}

type Audio = {
  move: () => void;
  capture: () => void;
};

type ReducerAction =
  | {
      type: 'Set';
      payload: (state: ReducerState) => ReducerState;
    }
  | {
      type: 'PieceMove';
      payload: {
        move: PieceMoveIndexes;
        audio: Audio;
      };
    }
  | { type: 'PiecePromotion'; payload: PiecePromotionType }
  | { type: 'Replay'; payload: { replay: number; audio: Audio } }
  | { type: 'Winner'; payload: ChessWinner }
  | { type: 'CheckWinner' }
  | { type: 'ToggleAlwaysPromoteToQueen' }
  | { type: 'Mute' }
  | { type: 'Unmute' }
  | { type: 'ToggleAudio' };

const initialPieces = initializePieces();

export const initialState: ReducerState = {
  turn: 'white',
  pieces: initialPieces,
  movesTimeline: [],
  movesTimelineNotation: [],
  replay: -1,
  piecePromoting: null,
  winner: null,
  playerColor: 'white',
  pieceMoves: Object.keys(initialPieces).reduce<PieceMoves>((acc, key) => {
    const index = Number(key);
    const pieceMoves = getPieceMoves(index, null, initialPieces);

    if (initialPieces[index].color === 'white' && pieceMoves.length !== 0) {
      acc[index] = pieceMoves;
    }

    return acc;
  }, {}),
  latestMove: null,
  isCustomizing: false,
  latestPieceMoveDate: new Date().getTime(),
  alwaysPromoteToQueen: !!localStorage.getItem('alwaysPromoteToQueen'),
  audioMute: true,
};

export const gameReducer = (
  state: ReducerState,
  action: ReducerAction
): ReducerState => {
  switch (action.type) {
    case 'Set':
      return action.payload(state);
    case 'PieceMove':
      return handlePieceMove(state, action.payload);
    case 'PiecePromotion':
      return handlePiecePromotion(state, action.payload);
    case 'Replay':
      return handleReplay(state, action.payload);
    case 'Winner':
      return handleWinner(state, action.payload);
    case 'CheckWinner':
      return handleCheckWinner(state);
    case 'ToggleAlwaysPromoteToQueen':
      return handleToggleAlwaysPromoteToQueen(state);
    case 'Mute':
      return handleMute(state);
    case 'Unmute':
      return handleUnmute(state);
    case 'ToggleAudio':
      return handleToggleAudio(state);
  }
};

function handlePieceMove(
  state: ReducerState,
  payload: {
    move: PieceMoveIndexes;
    audio: Audio;
  }
): ReducerState {
  if (state.replay !== state.movesTimeline.length - 1) {
    return state;
  }

  const movingPiece = state.pieces[payload.move.from];
  const isPromoting = isPromotable(payload.move.to, movingPiece.type);

  let pieces = pieceMove(payload.move, state.pieces);

  if (isPromoting && state.alwaysPromoteToQueen) {
    pieces = piecePromotion(payload.move.to, 'queen', pieces);
  }

  const turn: PieceColor =
    isPromoting && !state.alwaysPromoteToQueen
      ? state.turn
      : state.movesTimeline.length % 2 === 0
      ? 'black'
      : 'white';

  let output: ReducerState = {
    ...state,
    turn,
    pieces,
    latestMove: payload.move,
    piecePromoting:
      isPromoting && !state.alwaysPromoteToQueen ? payload.move.to : null,
    pieceMoves: {},
  };

  if (output.piecePromoting) {
    return output;
  }

  const piecesKeys = Object.keys(pieces);

  if (
    piecesKeys.length === 2 &&
    piecesKeys.every((key) => pieces[Number(key)].type === 'king')
  ) {
    output.winner = { type: 'draw', reason: 'Insufficient Material' };
    return output;
  }

  const move: TimelineMove =
    isPromoting && state.alwaysPromoteToQueen
      ? { ...payload.move, promotion: 'queen' }
      : payload.move;

  output.movesTimeline = [...output.movesTimeline, move];
  output.movesTimelineNotation = [
    ...output.movesTimelineNotation,
    getMoveNotation(move, state.pieces, state.latestMove),
  ];
  output.replay = state.movesTimeline.length;

  if (!state.audioMute) {
    const isCapture: boolean = !!state.pieces[payload.move.to];
    if (isCapture) {
      payload.audio.capture();
    } else {
      payload.audio.move();
    }
  }

  return output;
}

function handlePiecePromotion(
  state: ReducerState,
  payload: PiecePromotionType
): ReducerState {
  if (!state.latestMove || state.piecePromoting === null) return state;

  const move: TimelineMove = { ...state.latestMove, promotion: payload };

  return {
    ...state,
    turn: state.movesTimeline.length % 2 === 0 ? 'black' : 'white',
    pieces: piecePromotion(move.to, payload, state.pieces),
    movesTimeline: [...state.movesTimeline, move],
    movesTimelineNotation: [
      ...state.movesTimelineNotation,
      getMoveNotation(
        move,
        pieceMove({ from: move.to, to: move.from }, state.pieces),
        state.movesTimeline[state.movesTimeline.length - 1]
      ),
    ],
    replay: state.movesTimeline.length,
    piecePromoting: null,
  };
}

function handleReplay(
  state: ReducerState,
  payload: { replay: number; audio: Audio }
): ReducerState {
  let pieces = initializePieces();

  if (payload.replay > -1) {
    // leaving last move for audio (to determine if piece captured)
    state.movesTimeline.slice(0, payload.replay).forEach((move) => {
      pieces = pieceMove(move, pieces);
    });

    const move = state.movesTimeline[payload.replay];
    const isCapture: boolean = !!pieces[move.to];

    pieces = pieceMove(move, pieces);

    if (!state.audioMute) {
      if (isCapture) {
        payload.audio.capture();
      } else {
        payload.audio.move();
      }
    }
  }

  const newLatestMove = state.movesTimeline[payload.replay];

  return {
    ...state,
    replay: payload.replay,
    pieces,
    latestMove:
      payload.replay === -1
        ? null
        : { from: newLatestMove.from, to: newLatestMove.to },
    piecePromoting: null,
  };
}

function handleWinner(state: ReducerState, payload: ChessWinner): ReducerState {
  return { ...state, winner: payload };
}

function handleCheckWinner(state: ReducerState): ReducerState {
  let kingIndex = -1;

  const latestMove =
    state.movesTimeline.length === 0
      ? null
      : state.movesTimeline[state.movesTimeline.length - 1];

  const { pieceMoves, opponentPieceMoves } = Object.keys(state.pieces).reduce(
    (acc: { pieceMoves: PieceMoves; opponentPieceMoves: PieceMoves }, key) => {
      const index = Number(key);
      const piece = state.pieces[index];
      const pieceMoves = getPieceMoves(index, latestMove, state.pieces);

      if (piece.color === state.turn && piece.type === 'king') {
        kingIndex = index;
      }

      if (pieceMoves.length !== 0) {
        if (piece.color === state.turn) {
          acc.pieceMoves[index] = pieceMoves;
        } else {
          acc.opponentPieceMoves[index] = pieceMoves;
        }
      }

      return acc;
    },
    { pieceMoves: {}, opponentPieceMoves: {} }
  );

  // Check for Checkmate or Stalemate
  let winner: ChessWinner | null = null;
  if (Object.keys(pieceMoves).length === 0) {
    const isKingInCheck = Object.keys(opponentPieceMoves).some((key) =>
      opponentPieceMoves[Number(key)].includes(kingIndex)
    );

    winner = isKingInCheck
      ? { type: state.turn, reason: 'Checkmate' }
      : { type: 'draw', reason: 'Stalemate' };
  }

  return {
    ...state,
    winner,
    pieceMoves,
  };
}

function handleToggleAlwaysPromoteToQueen(state: ReducerState): ReducerState {
  return {
    ...state,
    alwaysPromoteToQueen: !state.alwaysPromoteToQueen,
  };
}

function handleMute(state: ReducerState): ReducerState {
  localStorage.setItem('audioMute', '1');
  return { ...state, audioMute: true };
}

function handleUnmute(state: ReducerState): ReducerState {
  return { ...state, audioMute: false };
}

function handleToggleAudio(state: ReducerState): ReducerState {
  return { ...state, audioMute: !state.audioMute };
}
