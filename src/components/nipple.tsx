import React, { useRef, useEffect, CSSProperties } from "react";
import {
  create,
  JoystickManagerOptions,
  EventData,
  JoystickOutputData
} from "nipplejs";

export const Nipple: React.FunctionComponent<
  JoystickManagerOptions & {
    style?: CSSProperties;
    onStart?: (evt: EventData, data: JoystickOutputData) => void;
    onEnd?: (evt: EventData, data: JoystickOutputData) => void;
    onDir?: (evt: EventData, data: JoystickOutputData) => void;
    onMove?: (evt: EventData, data: JoystickOutputData) => void;
  }
> = props => {
  const nippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nippleRef.current) {
      const manager = create({
        zone: nippleRef.current,
        ...props
      });

      props.onStart && manager.on("start", props.onStart);
      props.onEnd && manager.on("end", props.onEnd);
      props.onDir && manager.on("dir", props.onDir);
      props.onMove && manager.on("move", props.onMove);
      return () => manager.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nippleRef]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        ...props.style
      }}
      ref={nippleRef}
    ></div>
  );
};
