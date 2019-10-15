import { useContext, useState, useEffect } from 'react';
import { WebSocketContext } from '../context/websocket-context';

export const useMovement = () => {
  const socket = useContext(WebSocketContext);

  const [steering, setSteering] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [steeringSensitivity, setSteeringSensitivity] = useState(4096);
  const [throttleSensitivity, setThrottleSensitivity] = useState(4096);
  const [sensitivity, setSensitivity] = useState(1);

  const [motorsValue, setMotorsValue] = useState('');
  const [lastSentMotorsValue, setLastSentMotorsValue] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSentMotorsValue !== motorsValue) {
        setLastSentMotorsValue(motorsValue);
        socket.safeSend(motorsValue);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastSentMotorsValue, motorsValue, socket]);

  useEffect(() => {
    // front left
    const values = [
      {
        channel: 0,
        value:
          (throttle * throttleSensitivity + steering * steeringSensitivity) *
          sensitivity
      },
      //back left
      {
        channel: 1,
        value:
          (throttle * throttleSensitivity + steering * steeringSensitivity) *
          sensitivity
      },
      // back right
      {
        channel: 2,
        value:
          (throttle * throttleSensitivity - steering * steeringSensitivity) *
          sensitivity
      },
      // front right
      {
        channel: 3,
        value:
          (throttle * throttleSensitivity - steering * steeringSensitivity) *
          sensitivity
      }
    ];

    setMotorsValue(
      'motor ' +
        values.map(v => `${v.channel}=${Math.round(v.value)}`).join(';')
    );
  }, [
    sensitivity,
    socket,
    steering,
    steeringSensitivity,
    throttle,
    throttleSensitivity
  ]);

  return {
    steering,
    setSteering,
    throttle,
    setThrottle,
    throttleSensitivity,
    setThrottleSensitivity,
    steeringSensitivity,
    setSteeringSensitivity,
    sensitivity,
    setSensitivity
  };
};
