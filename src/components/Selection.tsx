import { useLayoutEffect, useRef, useState } from 'react';
import { IconKeyboardArrowDown } from 'assets/images';
import { AlertOutsideClick } from 'components';
import styles from 'styles/Selection.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: { name: string; image?: string }[];
  selected: number;
  onSelection: (val: number) => void;
}

export default function Selection(props: Props) {
  const { data, selected, onSelection, className, style, ...restProps } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [list, setList] = useState<{ height: number; expandTo: 'top' | 'bottom' }>({
    height: 0,
    expandTo: 'bottom',
  });

  const listRef = useRef<HTMLUListElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const dataSelected = data[selected];

  useLayoutEffect(() => {
    if (!listRef.current || !mainButtonRef.current) return;

    const listWidth = listRef.current.clientWidth;
    const mainButtonWidth = mainButtonRef.current.clientWidth;
    if (listWidth > mainButtonWidth) {
      setContainerWidth(listWidth);
    }
  }, [data]);

  useLayoutEffect(() => {
    if (!isExpanded || !mainButtonRef.current) return;

    const buttonRect = mainButtonRef.current.getBoundingClientRect();
    const distanceTop = buttonRect.top;
    const distanceBottom = window.innerHeight - buttonRect.bottom;

    setList({
      height: Math.max(distanceTop - 30, distanceBottom - 30),
      expandTo: distanceTop > distanceBottom ? 'top' : 'bottom',
    });
  }, [isExpanded]);

  return (
    <AlertOutsideClick
      onOutsideClick={() => setIsExpanded(false)}
      shouldHandle={isExpanded}
    >
      <div
        className={`${styles.container} ${className}`}
        style={containerWidth ? { ...style, minWidth: containerWidth } : style}
        {...restProps}
      >
        <button
          ref={mainButtonRef}
          className={`${styles.button} ${styles['button--main']}`}
          onClick={() => setIsExpanded((state) => !state)}
        >
          <span className={styles['button__name']}>{dataSelected.name}</span>
          {dataSelected.image && (
            <img
              className={styles['button__image']}
              src={dataSelected.image}
              alt=""
            />
          )}
          <IconKeyboardArrowDown
            className={`${styles['button__arrow']} ${
              isExpanded ? styles['button__arrow--expanded'] : ''
            }`}
          />
        </button>

        <ul
          className={`${styles.list} ${isExpanded ? styles['list--expanded'] : ''} ${
            list.expandTo === 'top'
              ? styles['list--expanded-top']
              : styles['list--expanded-bottom']
          }`}
          ref={listRef}
          style={{ maxHeight: list.height }}
        >
          {data.map((item, i) => (
            <li className={styles.item} key={item.name}>
              <button
                className={`${styles.button} ${styles['item__button']} ${
                  selected === i ? styles['item__button--selected'] : ''
                } `}
                onClick={() => {
                  onSelection(i);
                  setIsExpanded(false);
                }}
                tabIndex={isExpanded ? 0 : -1}
              >
                <span className={styles['button__name']}>{item.name}</span>
                {item.image && (
                  <img className={styles['button__image']} src={item.image} alt="" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AlertOutsideClick>
  );
}
