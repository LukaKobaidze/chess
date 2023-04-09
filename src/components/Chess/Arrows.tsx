import { useEffect, useRef } from 'react';
import { globalCSSVariable } from 'helpers';
import { ArrowDataType } from 'types';
import styles from 'styles/Chess/Arrows.module.scss';

interface Props {
  data: ArrowDataType[];
  boardSize: number;
}

export default function Arrows(props: Props) {
  const { data, boardSize } = props;

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');

    if (!c || !ctx) return;
    const squareSize = boardSize / 8;
    const squareSizeHalf = squareSize / 2;
    const colorLine = globalCSSVariable('--clr-arrow-line');
    const colorHead = globalCSSVariable('--clr-arrow-head');
    ctx.clearRect(0, 0, c.width, c.height);

    const headlen = 20;

    data.forEach(([[colFrom, rowFrom], [colTo, rowTo]]) => {
      let fromX = squareSize * colFrom - squareSizeHalf;
      let toX = squareSize * colTo - squareSizeHalf;
      let fromY = squareSize * rowFrom - squareSizeHalf;
      let toY = squareSize * rowTo - squareSizeHalf;
      const diffX = Math.abs(fromX - toX);
      const diffY = Math.abs(fromY - toY);

      if (diffX > diffY) {
        const squareSizeThird = squareSize / 3;
        toX += fromX < toX ? -squareSizeThird : squareSizeThird;
      } else if (diffY > diffX) {
        const squareSizeThird = squareSize / 3;
        toY += fromY < toY ? -squareSizeThird : squareSizeThird;
      } else {
        const squareSizeFourth = squareSize / 4;
        toX += fromX < toX ? -squareSizeFourth : squareSizeFourth;
        toY += fromY > toY ? squareSizeFourth : -squareSizeFourth;
      }

      var angle = Math.atan2(toY - fromY, toX - fromX);

      // starting path of the arrow from the start square to the end square and drawing the stroke
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.lineCap = 'round';
      ctx.strokeStyle = colorLine;
      ctx.lineWidth = boardSize / 73;
      ctx.stroke();

      // starting a new path from the head of the arrow to one of the sides of the point
      ctx.beginPath();
      ctx.moveTo(toX, toY);

      const pi7 = Math.PI / 7;
      ctx.lineTo(
        toX - headlen * Math.cos(angle - pi7),
        toY - headlen * Math.sin(angle - pi7)
      );

      // path from the side point of the arrow, to the other side point
      ctx.lineTo(
        toX - headlen * Math.cos(angle + pi7),
        toY - headlen * Math.sin(angle + pi7)
      );

      // path from the side point back to the tip of the arrow, and then again to the opposite side point
      ctx.lineTo(toX, toY);
      ctx.lineTo(
        toX - headlen * Math.cos(angle - pi7),
        toY - headlen * Math.sin(angle - pi7)
      );

      // draws the paths created above
      ctx.strokeStyle = colorHead;
      ctx.lineWidth = boardSize / 60.75;
      ctx.stroke();
      ctx.fillStyle = colorHead;
      ctx.fill();
    });
  }, [data, boardSize]);

  return (
    <canvas
      ref={ref}
      className={styles.container}
      width={boardSize}
      height={boardSize}
    />
  );
}
