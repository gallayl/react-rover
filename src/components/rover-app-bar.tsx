import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  ClickAwayListener
} from '@material-ui/core';
import ControlCamera from '@material-ui/icons/ControlCamera';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import Games from '@material-ui/icons/Games';
import React, { useState, useContext } from 'react';
import { useTheme } from '../hooks/use-theme';
import Warning from '@material-ui/icons/Warning';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import Done from '@material-ui/icons/Done';
import SettingsInputComponent from '@material-ui/icons/SettingsInputComponent';
import { WebSocketContext } from '../context/websocket-context';

export const RoverAppBar: React.FunctionComponent = props => {
  const theme = useTheme();
  const wsContext = useContext(WebSocketContext);
  const [wsUrlInput, setWsUrlInput] = useState(wsContext.socket.url);
  const [wsUrl, setWsUrl] = useState(wsContext.socket.url);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6">
          <span role="img" aria-label="car">
            🚓
          </span>
        </Typography>
        {isEditing ? (
          <ClickAwayListener
            onClickAway={() => {
              setIsEditing(false);
              setWsUrlInput(wsUrl);
            }}
          >
            <form
              onSubmit={ev => {
                ev.preventDefault();
                wsContext.setUrl(wsUrlInput);
                setWsUrl(wsUrlInput);
                setIsEditing(false);
              }}
            >
              <TextField
                type="url"
                style={{
                  marginLeft: '1em'
                }}
                InputProps={{
                  autoFocus: true,
                  endAdornment:
                    wsUrl === wsUrlInput ? (
                      wsContext.socket.readyState === WebSocket.CLOSED ||
                      wsContext.socket.readyState === WebSocket.CLOSING ? (
                        <Warning />
                      ) : wsContext.socket.readyState === WebSocket.OPEN ? (
                        <Done />
                      ) : (
                        <HourglassEmpty />
                      )
                    ) : (
                      undefined
                    ),
                  style: {
                    color:
                      wsContext.socket.readyState === WebSocket.CLOSED ||
                      wsContext.socket.readyState === WebSocket.CLOSING
                        ? 'red'
                        : undefined
                  }
                }}
                onChange={ev => setWsUrlInput(ev.target.value)}
                value={wsUrlInput}
              />
              {wsUrl !== wsUrlInput ? <Button type="submit">set</Button> : null}
            </form>
          </ClickAwayListener>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <span style={{ marginRight: '1em' }}>{wsUrl}</span>
            {wsContext.socket.readyState === WebSocket.CLOSED ||
            wsContext.socket.readyState === WebSocket.CLOSING ? (
              <Warning />
            ) : wsContext.socket.readyState === WebSocket.OPEN ? (
              <Done />
            ) : (
              <HourglassEmpty />
            )}
          </Button>
        )}

        <div style={{ flex: 1 }}></div>
        <a href="#/">
          <IconButton title="Movement">
            <Games />
          </IconButton>
        </a>
        <a href="#/cam">
          <IconButton title="Camera">
            <ControlCamera />
          </IconButton>
        </a>
        <a href="#/setup">
          <IconButton title="Settings">
            <SettingsInputComponent />
          </IconButton>
        </a>
        <IconButton
          title="Restart"
          onClick={() => {
            wsContext.safeSend('restart');
            window.location.reload();
          }}
        >
          <PowerSettingsNew />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
