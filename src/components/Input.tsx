import { forwardRef } from 'react';
import styles from 'styles/Input.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  styleVariant?: 'normal' | 'focused' | 'blurred';
}
type Ref = HTMLInputElement;

export default forwardRef<Ref, Props>(function Input(props, ref) {
  const { styleVariant = 'normal', className, ...rest } = props;

  return (
    <input
      className={`${styles.input} ${
        styleVariant !== 'normal' ? styles[`input--${styleVariant}`] : ''
      } ${className}`}
      {...rest}
      ref={ref}
    />
  );
});
