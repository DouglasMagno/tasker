import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#41B3A3',  // tom de turquesa
        },
        secondary: {
            main: '#E27D60',  // coral
        },
        background: {
            default: '#011627',  // fundo bem escuro (inspirado no Oceanic)
            paper: '#1D2D44',
        },
        text: {
            primary: '#d6deeb',
            secondary: '#a8b4c2',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;
