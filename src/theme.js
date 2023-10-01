import { createTheme } from '@mui/material/styles';

const JukeboxTheme = createTheme({
  typography: {
    h1: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 'bold',
        fontSize: '50px',
        letterSpacing: '0.16px',
        color: "var(--text-color)"
    },
    h2: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 'bold',
        fontSize: '30px',
        color: "var(--text-color)"
    },
    h3: {
        fontFamily: 'Fira Sans, sans-serif',
        fontWeight: 'bold',
        fontSize: '20px',
        color: "var(--text-color)"
    },
    h4: {
        fontFamily: 'Fira Sans, sans-serif',
        fontSize: '15px',
        color: "var(--text-color)"
    },
    p: {
        fontFamily: 'Fira Sans, sans-serif',
        fontSize: '15px',
        color: "var(--text-color)"
    },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
            fontFamily: 'Fira Sans, sans-serif',
            fontWeight: 'bold',
            letterSpacing: '0.01rem',
            color: "var(--text-color)"
            },
        },
    }
  },
  /*
  palette: {
    primary: {
      main: "#65350F", 
    },
    secondary: {
      main: "#FBE7BF", 
    },
},*/
});

export default JukeboxTheme;
