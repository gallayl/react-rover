import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { RoverAppBar } from './components/rover-app-bar';
import { useTheme } from '@material-ui/core';
import { Servos } from './pages/servos';
import { WebSocketProvider } from './context/websocket-context';
import { Movement } from './pages/movement';
import { Setup } from './pages/setup';
import { Camera } from './pages/camera';

export const MainRouter: React.FunctionComponent = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <WebSocketProvider>
        <RoverAppBar />
        <HashRouter>
          <Switch>
            <Route path="/servos" exact={true}>
              <Servos />
            </Route>
            <Route path="/setup" exact={true}>
              <Setup />
            </Route>
            <Route path="/cam" exact={true}>
              <Camera />
            </Route>

            <Route>
              <Movement />
            </Route>
          </Switch>
        </HashRouter>
      </WebSocketProvider>
    </div>
  );
};
