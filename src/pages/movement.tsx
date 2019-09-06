import React, { useCallback } from "react";
import { Nipple } from "../components/nipple";
import { useMovement } from "../hooks/use-movement";
import { Slider } from "@material-ui/core";
import { JoystickOutputData } from "nipplejs";

export const Movement: React.FunctionComponent = () => {
  const m = useMovement();

  const setSteeringAndThrottle = useCallback(
    (_ev: any, dta: JoystickOutputData) => {
      const newSteering = Math.cos(dta.angle.radian) * Math.min(dta.force, 1);
      const newThrottle =
        Math.sin(dta.angle.radian) * Math.min(dta.force, 1) * m.sensitivity;
      m.setSteering(newSteering);
      m.setThrottle(newThrottle);
    },
    [m]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Slider
        min={0.01}
        max={1}
        step={0.01}
        value={m.sensitivity}
        onChange={(_ev, value) => {
          if (!Array.isArray(value)) {
            m.setSensitivity(value);
          }
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <Nipple
          size={192}
          style={{
            backgroundColor: "rgba(0,255,0,0.1)",
            overflow: "hidden"
          }}
          multitouch
          onMove={setSteeringAndThrottle}
          onEnd={() => {
            m.setSteering(0);
            m.setThrottle(0);
          }}
        />
      </div>
    </div>
  );
};
