import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect, useState } from 'react';
import AuthContext from 'context/auth';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <AuthContext>
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll>
                </AuthContext>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
