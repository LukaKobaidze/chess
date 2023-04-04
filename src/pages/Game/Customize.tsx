import { useState } from 'react';
import { IconClose } from 'assets/images';
import { boards, pieceSets } from 'data';
import { Switch, Selection } from 'components';
import styles from 'styles/pages/Game/Customize.module.scss';

interface Props {
  onCustomizeClose: () => void;
  pieceSet: number;
  setPieceSet: React.Dispatch<React.SetStateAction<number>>;
  boardType: number;
  setBoardType: React.Dispatch<React.SetStateAction<number>>;
  highlightMoves: boolean;
  setHighlightMoves: React.Dispatch<React.SetStateAction<boolean>>;
  boardSizePercentage: number;
  setBoardSizePercentage: React.Dispatch<React.SetStateAction<number>>;
  alwaysPromoteQueen: boolean;
  toggleAlwaysPromoteToQueen: () => void;
}

export default function Customize(props: Props) {
  const {
    onCustomizeClose,
    pieceSet,
    setPieceSet,
    boardType,
    setBoardType,
    highlightMoves,
    setHighlightMoves,
    boardSizePercentage,
    setBoardSizePercentage,
    alwaysPromoteQueen,
    toggleAlwaysPromoteToQueen,
  } = props;

  const [boardSizePercentageRangeSlider, setBoardSizePercentageRangeSlider] =
    useState(boardSizePercentage);

  const toggleHighlightMoves = () => {
    setHighlightMoves((state) => !state);
  };

  const handlePieceSetSelect = (val: number) => {
    setPieceSet(val);
  };

  const handleBoardChange = (val: number) => {
    setBoardType(val);
  };

  const handleBoardSizePercentageInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;

    setBoardSizePercentageRangeSlider(Number(input.value));
  };

  const handleBoardSizePercentageEnd = () => {
    setBoardSizePercentage(boardSizePercentageRangeSlider);
  };

  return (
    <div className={styles.container}>
      <button onClick={onCustomizeClose} className={styles['button-close']}>
        <IconClose />
      </button>
      <h2 className={styles.heading}>Customize</h2>
      <div>
        <div className={styles.setting}>
          <span className={styles['setting__span']}>Pieces</span>
          <Selection
            data={pieceSets.slice(0).map((name) => ({
              name: name[0].toUpperCase() + name.slice(1),
              image: require(`assets/images/piece/${name}/wN.svg`),
            }))}
            selected={pieceSet}
            onSelection={handlePieceSetSelect}
            className={styles.selection}
          />
        </div>
        <div className={styles.setting}>
          <span className={styles['setting__span']}>Board</span>

          <Selection
            data={boards.map((board) => ({
              name: board.name,
              image: require(`assets/images/board/${board.thumbnail}`),
            }))}
            selected={boardType}
            onSelection={handleBoardChange}
            className={styles.selection}
          />
        </div>
        <div className={styles.setting}>
          <span>Board Size</span>
          <div className={styles.range}>
            <span className={styles['range__text']}>
              {boardSizePercentageRangeSlider}%
            </span>
            <input
              className={styles['range__input']}
              type="range"
              min="1"
              max="100"
              value={boardSizePercentageRangeSlider}
              onInput={handleBoardSizePercentageInput}
              onMouseUp={handleBoardSizePercentageEnd}
              onTouchEnd={handleBoardSizePercentageEnd}
              onKeyUp={handleBoardSizePercentageEnd}
            />
          </div>
        </div>
        <div
          className={`${styles.setting} ${
            !highlightMoves ? styles['setting--off'] : ''
          }`}
        >
          <span className={styles['setting__span']} onClick={toggleHighlightMoves}>
            Highlight Moves
          </span>
          <Switch state={highlightMoves} onToggle={toggleHighlightMoves} />
        </div>
        <div
          className={`${styles.setting} ${
            !alwaysPromoteQueen ? styles['setting--off'] : ''
          }`}
        >
          <span
            className={styles['setting__span']}
            onClick={toggleAlwaysPromoteToQueen}
          >
            Always promote to Queen
          </span>
          <Switch state={alwaysPromoteQueen} onToggle={toggleAlwaysPromoteToQueen} />
        </div>
      </div>
    </div>
  );
}
