import { IconAdjust, IconMuted, IconUnmuted } from 'assets/images';
import { TextPopup } from 'components';
import styles from 'styles/pages/Game/Controls.module.scss';

interface Props {
  audioMuted: boolean;
  isCustomizing: boolean;
  onAudioToggle: () => void;
  onCustomizeToggle: () => void;
}

export default function Controls(props: Props) {
  const { audioMuted, isCustomizing, onAudioToggle, onCustomizeToggle } = props;

  return (
    <div className={styles.controls}>
      <TextPopup
        text={audioMuted ? 'unmute' : 'mute'}
        position="right"
        showOnHover
        offset={10}
      >
        <button
          className={`${styles['controls__button']} ${styles['controls__audio']}`}
          onClick={onAudioToggle}
        >
          {audioMuted ? <IconMuted /> : <IconUnmuted />}
        </button>
      </TextPopup>

      <TextPopup text={'customize'} position="right" showOnHover offset={10}>
        <button
          className={`${styles['controls__button']} ${
            styles['controls__customize']
          } ${isCustomizing ? styles['controls--active'] : ''}`}
          onClick={onCustomizeToggle}
        >
          <IconAdjust />
        </button>
      </TextPopup>
    </div>
  );
}
