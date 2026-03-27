import { createContext, useContext, useState, type ReactNode } from 'react';

interface DrawerContextType {
  leftOpen: boolean;
  rightOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  feedActive: boolean;
  setFeedActive: (active: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [feedActive, setFeedActive] = useState(false);

  return (
    <DrawerContext.Provider value={{ leftOpen, rightOpen, setLeftOpen, setRightOpen, feedActive, setFeedActive }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
}
