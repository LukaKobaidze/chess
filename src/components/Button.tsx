import { forwardRef } from 'react';
import styles from 'styles/Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
type Ref = HTMLButtonElement;

export default forwardRef<Ref, Props>(function Button(props, ref) {
  const { className, children, disabled, ...rest } = props;

  return (
    <button
      className={`${styles.button} ${
        disabled ? styles['button--disabled'] : ''
      } ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
});
