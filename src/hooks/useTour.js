import { useState, useEffect, useCallback } from 'react';
import { TOUR_STORAGE_KEY, TOUR_FIRST_TIME_KEY, TOUR_AUTO_START_KEY } from '../Utils/TourConfig';

export const useTour = (pageName) => {
  const [runTour, setRunTour] = useState(false);
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);

  // Check if this is the first time user is seeing tours
  useEffect(() => {
    const firstTimeShown = localStorage.getItem(TOUR_FIRST_TIME_KEY);
    const completedTours = getCompletedTours();

    // Show popup if it's first time and user hasn't completed any tours
    if (!firstTimeShown && Object.keys(completedTours).length === 0) {
      setShowFirstTimePopup(true);
    }
  }, []);

  // Get completed tours from localStorage
  const getCompletedTours = useCallback(() => {
    try {
      const stored = localStorage.getItem(TOUR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading tour completion status:', error);
      return {};
    }
  }, []);

  // Check if tour for current page is completed
  const isTourCompleted = useCallback(() => {
    const completedTours = getCompletedTours();
    return completedTours[pageName] === true;
  }, [pageName, getCompletedTours]);

  // Mark tour as completed
  const markTourCompleted = useCallback(() => {
    const completedTours = getCompletedTours();
    completedTours[pageName] = true;
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(completedTours));
  }, [pageName, getCompletedTours]);

  // Start tour
  const startTour = useCallback(() => {
    setRunTour(true);
  }, []);

  // Stop tour
  const stopTour = useCallback(() => {
    setRunTour(false);
  }, []);

  // Handle first time popup acceptance
  const handleStartFirstTour = useCallback(() => {
    localStorage.setItem(TOUR_FIRST_TIME_KEY, 'true');
    localStorage.setItem(TOUR_AUTO_START_KEY, 'true'); // User wants auto-start
    setShowFirstTimePopup(false);
    setRunTour(true);
  }, []);

  // Handle first time popup skip
  const handleSkipFirstTour = useCallback(() => {
    localStorage.setItem(TOUR_FIRST_TIME_KEY, 'true');
    localStorage.setItem(TOUR_AUTO_START_KEY, 'false'); // User doesn't want auto-start
    setShowFirstTimePopup(false);
  }, []);

  // Auto-start tour if it's first time for this specific page
  useEffect(() => {
    if (!isTourCompleted() && pageName) {
      const autoStartEnabled = localStorage.getItem(TOUR_AUTO_START_KEY);

      // Only auto-start if user clicked "Start Tour" on first-time popup
      // and this specific page's tour hasn't been completed yet
      if (autoStartEnabled === 'true') {
        setTimeout(() => setRunTour(true), 800);
      }
    }
  }, [pageName, isTourCompleted]);

  return {
    runTour,
    startTour,
    stopTour,
    markTourCompleted,
    isTourCompleted: isTourCompleted(),
    showFirstTimePopup,
    handleStartFirstTour,
    handleSkipFirstTour,
  };
};
