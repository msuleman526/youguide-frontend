import React, { useEffect } from 'react';
import Joyride, { ACTIONS, STATUS } from 'react-joyride';
import { useTour } from '../hooks/useTour';
import { PAGE_TOURS } from '../Utils/TourConfig';
import FirstTimeTourPopup from './FirstTimeTourPopup';
import { useTourContext } from '../context/TourContext';

const PageTourWrapper = ({ pageName, children }) => {
  const {
    runTour,
    startTour,
    stopTour,
    markTourCompleted,
    showFirstTimePopup,
    handleStartFirstTour,
    handleSkipFirstTour,
  } = useTour(pageName);

  const { runTour: contextRunTour, setPageTour } = useTourContext();

  useEffect(() => {
    setPageTour(pageName);
  }, [setPageTour, pageName]);

  useEffect(() => {
    if (contextRunTour) {
      startTour();
    }
  }, [contextRunTour, startTour]);

  const handleJoyrideCallback = (data) => {
    const { action, status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      stopTour();
      markTourCompleted();
    } else if (action === ACTIONS.CLOSE) {
      stopTour();
      markTourCompleted();
    }
  };

  // Only render tour if this page has tour steps defined
  const tourSteps = PAGE_TOURS[pageName];
  if (!tourSteps) {
    return <>{children}</>;
  }

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        disableScrolling={false}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#29b8e3',
            zIndex: 10000,
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip All Tour',
        }}
      />

      <FirstTimeTourPopup
        visible={showFirstTimePopup}
        onStart={handleStartFirstTour}
        onSkip={handleSkipFirstTour}
      />

      {children}
    </>
  );
};

export default PageTourWrapper;
