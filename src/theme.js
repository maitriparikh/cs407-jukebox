import { createTheme } from '@mui/material/styles';

const JukeboxTheme = (darkMode) => {

  const isDarkMode = true;

  console.log("dark mode? " + isDarkMode)

  const backgroundColors = {
    light: '#ffffff', // light mode background
    dark: '#1A1A1A', // dark mode background
  };

  const textColors = {
    light: '#5a2005', // light mode text color 
    dark: '#FBE7BF', // dark mode text color 
  };

  const accentColors = {
    light: '#FBE7BF', // light mode accent color
    dark: '#5a2005', // dark mode accent color
  };

  //const lineColor = '#FFCB28';

  return createTheme({
    typography: {
      h1: {
          fontFamily: 'Fira Sans, sans-serif',
          fontWeight: 'bold',
          fontSize: '50px',
          letterSpacing: '0.16px',
          color: textColors[isDarkMode ? 'dark' : 'light'],
      },
      h2: {
          fontFamily: 'Fira Sans, sans-serif',
          fontWeight: 'bold',
          fontSize: '30px',
          color: textColors[isDarkMode ? 'dark' : 'light'],
      },
      h3: {
          fontFamily: 'Fira Sans, sans-serif',
          fontWeight: 'bold',
          fontSize: '20px',
          color: textColors[isDarkMode ? 'dark' : 'light'],
      },
      h4: {
          fontFamily: 'Fira Sans, sans-serif',
          fontSize: '15px',
          color: textColors[isDarkMode ? 'dark' : 'light'],
      },
      p: {
          fontFamily: 'Fira Sans, sans-serif',
          fontSize: '15px',
          color: textColors[isDarkMode ? 'dark' : 'light'],
      },
    },
    components: {
      MuiButton: {
          styleOverrides: {
              root: {
              fontFamily: 'Fira Sans, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '0.01rem',
              color: textColors[isDarkMode ? 'dark' : 'light'],
              },
          },
      }
    },
    
    palette: {
      type: isDarkMode ? 'dark' : 'light',
      primary: {
        main: textColors[isDarkMode ? 'dark' : 'light'],
      },
      secondary: {
        main: accentColors[isDarkMode ? 'dark' : 'light'],
      },
      background: {
        default: backgroundColors[isDarkMode ? 'dark' : 'light'],
      },
    },
  });
};

export default JukeboxTheme;
