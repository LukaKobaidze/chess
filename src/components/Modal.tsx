import { createPortal } from 'react-dom';
import styles from 'styles/Modal.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  backdropOpacity?: number;
  onBackdropClick?: () => void;
  children?: React.ReactNode;
}

export default function Modal(props: Props) {
  const { backdropOpacity = 0.2, onBackdropClick, children, ...restProps } = props;

  return createPortal(
    <>
      <div
        className={styles.backdrop}
        style={{ opacity: backdropOpacity }}
        onClick={() => onBackdropClick && onBackdropClick()}
      />
      <div className={styles.modal}>
        <div {...restProps}>{children}</div>
      </div>
    </>,
    document.getElementById('modal') as HTMLDivElement
  );
}
