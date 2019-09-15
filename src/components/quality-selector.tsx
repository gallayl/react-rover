import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { WebSocketContext } from '../context/websocket-context';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

export const QualitySelector: React.FC = () => {
  const sockets = useContext(WebSocketContext);

  const [resolution, setResolution] = useState(5);
  const [quality, setQuality] = useState(20);

  useEffect(() => {
    fetch(
      'http://' +
        new URL(sockets.socket.url).host +
        `/setupCam?framesize=${resolution}&quality=${quality}`
    );
  }, [quality, resolution, sockets.socket.url]);

  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <FormControl>
        <InputLabel htmlFor="age-simple">Resolution</InputLabel>
        <Select
          value={resolution}
          onChange={ev =>
            setResolution(parseInt(ev.target.value as string, 10))
          }
          inputProps={{
            name: 'age',
            id: 'age-simple'
          }}
        >
          <MenuItem value={0}>QQVGA(160x120)</MenuItem>
          <MenuItem value={1}>QQVGA2(128x160)</MenuItem>
          <MenuItem value={2}>QCIF(176x144)</MenuItem>
          <MenuItem value={3}>HQVGA(240x176)</MenuItem>
          <MenuItem value={4}>QVGA(320x240)</MenuItem>
          <MenuItem value={5}>CIF(400x296)</MenuItem>
          <MenuItem value={6}>VGA(640x480)</MenuItem>
          <MenuItem value={7}>SVGA(800x600)</MenuItem>
          <MenuItem value={8}>XGA(1024x768)</MenuItem>
          <MenuItem value={9}>SXGA(1280x1024)</MenuItem>
          <MenuItem value={10}>UXGA(1600x1200)</MenuItem>
          <MenuItem value={11}>QXGA(2048*1536)</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="age-simple">Quality</InputLabel>
        <Select
          value={quality}
          onChange={ev => setQuality(parseInt(ev.target.value as string, 10))}
          inputProps={{
            name: 'age',
            id: 'age-simple'
          }}
        >
          <MenuItem value={12}>Excellent</MenuItem>
          <MenuItem value={20}>Medium</MenuItem>
          <MenuItem value={30}>Poor</MenuItem>
          <MenuItem value={50}>Shitty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
