import { useEffect, useState } from 'react';

export default function useAudio(src: string): [() => void, boolean, () => void] {
  const [audio] = useState(new Audio(src));
  const [playing, setPlaying] = useState(false);

  const playAudio = () => {
    audio.currentTime = 0;
    audio.play();
  };
  const pauseAudio = () => setPlaying(false);

  useEffect(() => {
    if (!playing) {
      audio.pause();
    }
  }, [playing, audio]);

  useEffect(() => {
    const handleEnded = () => setPlaying(false);

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [audio]);

  return [playAudio, playing, pauseAudio];
}
