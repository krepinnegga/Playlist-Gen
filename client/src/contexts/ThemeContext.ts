import { createContext } from 'react';

interface ThemeContextProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const initialState: ThemeContextProps = {
  theme: 'system',
  setTheme: () => {},
};

export const ThemeProviderContext =
  createContext<ThemeContextProps>(initialState);
