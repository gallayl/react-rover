import React, { useState, useCallback, useEffect } from "react";
import { WebSocketContext } from "../context/websocket-context";
import { useContext } from "react";
import { Switch, Slider } from "@material-ui/core";
import { ServoService } from "../services/servo-service";
import { useInjector } from "../hooks/use-injector";
import { sleepAsync, debounce } from "@sensenet/client-utils";

export const Camera: React.FC = () => {
  const ctx = useContext(WebSocketContext);
  const [imgUrl] = useState("http://" + new URL(ctx.socket.url).host + "/cam");
  const [imgLoadUrl, setImgLoadUrl] = useState(imgUrl);

  const injector = useInjector();
  const servoService = injector.getInstance(ServoService);
  const socket = useContext(WebSocketContext);

  const [horizontalServo, setHorizontalServo] = useState(
    servoService.getServoForChannel(0)
  );

  const [gamepad, setGamePad] = useState<Gamepad | null>(null);

  const onGamepadConnected = useCallback(g => {
    console.log(g);
    setGamePad(g.gamepad);
  }, []);

  useEffect(() => {
    const gp = navigator.getGamepads()[0];
    if (gp) {
      window.requestAnimationFrame(() => {
        setGamePad(gp);
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("gamepadconnected", onGamepadConnected);
    return () =>
      window.removeEventListener("gamepadconnected", onGamepadConnected);
  }, [onGamepadConnected, gamepad]);

  const updateHorizontalServoValue = useCallback(
    debounce((_event: React.ChangeEvent<{}>, value: number | number[]) => {
      if (!Array.isArray(value)) {
        setHorizontalServo({
          ...servoService.setValue(socket.socket, {
            channel: horizontalServo.channel,
            percent: -value
          })[0]
        });
      }
    }, 10),
    [horizontalServo.channel, servoService, socket.socket]
  );

  const [verticalServo, setVerticalServo] = useState(
    servoService.getServoForChannel(1)
  );

  const updateVerticalServoValue = useCallback(
    debounce((_event: React.ChangeEvent<{}>, value: number | number[]) => {
      if (!Array.isArray(value)) {
        setVerticalServo({
          ...servoService.setValue(socket.socket, {
            channel: verticalServo.channel,
            percent: -value
          })[0]
        });
      }
    }, 10),
    [servoService, socket.socket, verticalServo.channel]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Switch
          onChange={(_ev, val) => {
            ctx.safeSend(`flashlight ${val ? "on" : "off"}`);
          }}
        />
        <Slider
          min={-1}
          max={1}
          step={0.01}
          value={-horizontalServo.percentage}
          onChange={updateHorizontalServoValue}
          valueLabelDisplay="auto"
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          style={{ width: "55%", transform: "rotate(90deg)" }}
          src={imgLoadUrl}
          alt="cameraImage"
          onLoad={async () => {
            const newUrl = imgUrl + "?d=" + Math.random();
            setImgLoadUrl(newUrl);
          }}
          onError={async () => {
            const newUrl = imgUrl + "?d=" + Math.random();
            await sleepAsync(1500);
            setImgLoadUrl(newUrl);
          }}
        />
        <Slider
          min={-1}
          max={1}
          step={0.01}
          value={-verticalServo.percentage}
          onChange={updateVerticalServoValue}
          valueLabelDisplay="auto"
          orientation="vertical"
        />
      </div>
    </div>
  );
};
