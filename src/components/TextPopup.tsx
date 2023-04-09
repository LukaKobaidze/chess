import styles from 'styles/TextPopup.module.scss';

interface Props {
  text: React.ReactNode;
  position: 'top' | 'top-right' | 'right' | 'bottom' | 'left';
  show?: boolean;
  showOnHover?: boolean;
  offset?: number;
  width?: number;
  className?: string;
  classNamePopup?: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function TextPopup(props: Props) {
  const {
    text,
    position,
    show,
    showOnHover,
    offset = 6,
    width = 'auto',
    className,
    classNamePopup,
    backgroundColor,
    children,
  } = props;

  const textStyle = {
    '--offset': `${offset}px`,
    backgroundColor: backgroundColor,
    width,
  } as React.CSSProperties;

  return (
    <div className={className}>
      <div
        className={`${styles.wrapper} ${
          showOnHover ? styles['wrapper--hover'] : ''
        } ${show ? styles['wrapper--show'] : ''}`}
      >
        {children}

        <div
          className={`${styles.text} ${
            styles[`text--${position}`]
          } ${classNamePopup}`}
          style={textStyle}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
