import { createContext, useState, useEffect } from 'react';
import { SideType } from 'types';

interface GlobalContextInterface {
  side: SideType;
  changeSide: (side: SideType) => void;
}

export const GlobalContext = createContext<GlobalContextInterface>({
  side: 'white',
  changeSide: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export function GlobalContextProvider(props: Props) {
  const { children } = props;

  const [side, setSide] = useState<SideType>(() => {
    return (localStorage.getItem('chess-side') as SideType) || 'white';
  });

  const changeSide = (side: SideType) => setSide(side);

  useEffect(() => {
    localStorage.setItem('chess-side', side);
  }, [side]);

  return (
    <GlobalContext.Provider value={{ side, changeSide }}>
      {children}
    </GlobalContext.Provider>
  );
}
