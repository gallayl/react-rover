import React, { useState, useContext, useCallback } from 'react';
import { ServoService } from '../services/servo-service';
import { useInjector } from '../hooks/use-injector';
import { Typography, Slider, useTheme } from '@material-ui/core';
import { WebSocketContext } from '../context/websocket-context';
import { debounce } from '@sensenet/client-utils';

export const ServoSetting: React.FunctionComponent<{
  channel: number;
  showAdvanced: boolean;
  hideTitles?: boolean;
  invert?: boolean;
}> = props => {
  const injector = useInjector();
  const servoService = injector.getInstance(ServoService);

  const socket = useContext(WebSocketContext);
  const theme = useTheme();

  const [servo, setServo] = useState(
    servoService.getServoForChannel(props.channel)
  );

  const updateServoValue = useCallback(
    debounce((_event: React.ChangeEvent<{}>, value: number | number[]) => {
      if (!Array.isArray(value)) {
        setServo({
          ...servoService.setValue(socket.socket, {
            channel: servo.channel,
            percent: value
          })[0]
        });
      }
    }, 10),
    []
  );

  return (
    <div>
      {props.hideTitles ? null : (
        <Typography variant="h6">Channel {props.channel}</Typography>
      )}
      {props.showAdvanced ? (
        <>
          <Typography gutterBottom>Range</Typography>
          <Slider
            title="Restrict minimum and maximum ranges"
            step={1}
            value={[servo.min, servo.max]}
            min={0}
            max={180}
            valueLabelDisplay="auto"
            onChange={(_ev, newValue) => {
              if (Array.isArray(newValue)) {
                setServo({
                  ...servoService.patch(
                    servo.channel,
                    {
                      min: newValue[0],
                      max: newValue[1]
                    },
                    socket.socket
                  )
                });
              }
            }}
          />
          <Typography gutterBottom>Center</Typography>
          <Slider
            title="center"
            value={servo.center}
            min={servo.min}
            max={servo.max}
            step={1}
            valueLabelDisplay="auto"
            onChange={(_ev, value) => {
              if (!Array.isArray(value)) {
                setServo({
                  ...servoService.patch(
                    servo.channel,
                    { center: value },
                    socket.socket
                  )
                });
              }
            }}
          />
        </>
      ) : null}
      {props.hideTitles ? null : (
        <Typography gutterBottom>Percentage Value</Typography>
      )}
      <Slider
        title="Percentage"
        value={servo.percentage}
        min={-1}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
        onChange={updateServoValue}
      />

      {props.showAdvanced ? (
        <>
          <Typography gutterBottom>Effective value (computed)</Typography>
          <Slider
            title="center"
            value={servo.plainValue}
            min={0}
            max={180}
            step={1}
            disabled
            ThumbComponent={props => (
              <div {...props}>
                <div
                  style={{
                    backgroundColor: theme.palette.grey[700],
                    padding: '0.5em',
                    borderRadius: '10%'
                  }}
                >
                  {servo.plainValue}°
                </div>
              </div>
            )}
          />
        </>
      ) : null}
    </div>
  );
};
