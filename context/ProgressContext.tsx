import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ProgressContextProps {
  progress: number;
  isLoading: boolean;
  startProgress: () => void;
  updateProgress: (value: number) => void;
  endProgress: () => void;
  displayedProgress: number;
  loadingMessage: string;
setLoadingMessage: Function
}

const ProgressContext = createContext<ProgressContextProps | undefined>(
  undefined
);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<number>(0); // Nilai progress bar
  const [isLoading, setIsLoading] = useState<boolean>(false); // Status loading bar
  const [displayedProgress, setDisplayedProgress] = useState<number>(0);
 const [loadingMessage, setLoadingMessage] = useState<string>('')

  const startProgress = () => {
    setProgress(10); // Awal progress
    setIsLoading(true); // Tampilkan progress bar
  };

  const updateProgress = (value: number) => {
    setProgress(value); // Perbarui progress bar
  };

  const endProgress = () => {
    setProgress(100); // Selesaikan progress
    setTimeout(() => {
      setIsLoading(false); // Sembunyikan progress bar
      setProgress(0); // Reset progress
    }, 500); // Tambahkan jeda agar animasi terlihat
  };

  useEffect(() => {
    if (progress > displayedProgress) {
        const timer = setTimeout(() => {
            setDisplayedProgress((prev) => Math.min(prev + 1, progress));
        }, 20); // Adjust this value to control animation speed
        return () => clearTimeout(timer);
    } else if (progress < displayedProgress) {
        setDisplayedProgress(progress);
    }
}, [progress, displayedProgress]);

  return (
    <ProgressContext.Provider
      value={{ progress, isLoading, startProgress, updateProgress, endProgress, displayedProgress,loadingMessage,
        setLoadingMessage }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextProps => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
