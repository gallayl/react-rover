import React from 'react';
import './App.css';
import { ThemeContext } from './context/theme-context';
import { ThemeProvider } from '@material-ui/styles';
import { MainRouter } from './main-router';

const App: React.FC = () => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      )}
    </ThemeContext.Consumer>
  );
};

export default App;
