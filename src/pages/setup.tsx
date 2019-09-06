import React, { useState } from 'react';
import { useInjector } from '../hooks/use-injector';
import { ServoService } from '../services/servo-service';
import { Card, Switch, FormControlLabel } from '@material-ui/core';
import { ServoSetting } from '../components/servo-setting';
export const Setup: React.FunctionComponent = () => {
  const injector = useInjector();
  const servoService = injector.getInstance(ServoService);

  const [servos] = useState(servoService.servos);

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card
      style={{
        padding: '1em',
        margin: '1em',
        overflow: 'auto',
        height: '100%'
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
            value="Show advanced"
          />
        }
        label="Secondary"
      />
      {servos.map(s => (
        <ServoSetting
          key={s.channel}
          channel={s.channel}
          showAdvanced={showAdvanced}
        />
      ))}
    </Card>
  );
};
