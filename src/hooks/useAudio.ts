import { useCallback, useState } from 'react';

export default function useAudio(src: string) {
  const [audio] = useState(new Audio(src));

  const playAudio = useCallback(() => {
    audio.currentTime = 0;
    audio.play();
  }, [audio]);

  return playAudio;
}
