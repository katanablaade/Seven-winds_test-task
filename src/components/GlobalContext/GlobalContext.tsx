// GlobalContext.tsx
import { createContext, useState, useContext } from 'react';

// Создаем контекст
const GlobalContext = createContext<{
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  isBlocked: boolean;
  setIsBlocked: (value: boolean) => void;
}>({
  isHovered: false,
  setIsHovered: () => {},
  isBlocked: false,
  setIsBlocked: () => {},
});

// Провайдер для контекста
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <GlobalContext.Provider
      value={{ isHovered, setIsHovered, isBlocked, setIsBlocked }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Хук для использования контекста
export const useGlobal = () => {
  return useContext(GlobalContext);
};
