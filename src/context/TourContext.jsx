import React, { createContext, useContext, useState, useCallback } from 'react';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [currentPageTour, setCurrentPageTour] = useState(null);
  const [runTour, setRunTour] = useState(false);

  const startTour = useCallback(() => {
    setRunTour(true);
  }, []);

  const stopTour = useCallback(() => {
    setRunTour(false);
  }, []);

  const setPageTour = useCallback((pageName) => {
    setCurrentPageTour(pageName);
  }, []);

  return (
    <TourContext.Provider value={{ currentPageTour, setPageTour, runTour, startTour, stopTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within TourProvider');
  }
  return context;
};
