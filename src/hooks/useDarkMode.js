import  { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = event => setIsDarkMode(event.matches);
    darkModeQuery.addEventListener('change', handleChange);

    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};


export default useDarkMode