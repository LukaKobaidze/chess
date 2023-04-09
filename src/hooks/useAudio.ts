import { useState } from 'react';

export default function useAudio(src: string) {
  const [audio] = useState(new Audio(src));

  const playAudio = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return playAudio;
}
