// https://github.com/mutagen-d/react-native-zigzag-lines

import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Path, PathProps, SvgProps } from "react-native-svg";

export type ZigzagPathProps = {
  width?: number;
  height?: number;
  jagWidth?: number;
  jagBottom?: number;
};

export type ZigZagViewProps = ZigzagPathProps & {
  backgroundColor?: string;
  color?: string;
  position?: "top" | "bottom";
  style?: SvgProps["style"];
  pathProps?: Omit<PathProps, "fill" | "d">;
  svgProps?: Omit<SvgProps, "style" | "width" | "height" | "viewBox">;
};

const DEFAULTS = {
  WIDTH: 1000,
  HEIGHT: 5,
  JAG_BOTTOM: 0,
  JAG_WIDTH: 8,
  BACKGROUND_COLOR: "#CCCCCC",
  COLOR: "#FFFFFF",
  POSITION: "top",
};

const cache: Record<string, string> = {};

const toFixed = (value: number, precision = 3) => +value.toFixed(precision);
const getCacheKey = ({ width, height, jagWidth, jagBottom }: ZigzagPathProps) =>
  `${width}/${height}/${jagWidth}/${jagBottom}`;

export const createZigzagPath = (props: ZigzagPathProps) => {
  const key = getCacheKey(props);
  if (cache[key]) return cache[key];

  const {
    width = DEFAULTS.WIDTH,
    height = DEFAULTS.HEIGHT,
    jagBottom = DEFAULTS.JAG_BOTTOM,
    jagWidth = DEFAULTS.JAG_WIDTH,
  } = props;
  const count = Math.floor(width / jagWidth) || 1;
  const step = width / count / 2;
  let path = `M0 ${height}V0 H${width} V${height}`;

  for (let i = 0, next = step; i < count; i++) {
    path += ` L${toFixed(width - next, 2)} ${jagBottom}`;
    next += step;
    path += ` L${toFixed(width - next, 2)} ${height}`;
    next += step;
  }

  path += "Z";
  return (cache[key] = path);
};

const ZigZagView: React.FC<ZigZagViewProps> = (props) => {
  const window = useWindowDimensions();

  const {
    width = window.width,
    height = DEFAULTS.HEIGHT,
    backgroundColor = DEFAULTS.BACKGROUND_COLOR,
    color = DEFAULTS.COLOR,
    position = DEFAULTS.POSITION,
    style,
    jagWidth,
    jagBottom,
    pathProps,
    svgProps,
  } = props;

  const [layout, setLayout] = useState({ width, height });

  return (
    <Svg
      {...svgProps}
      onLayout={(e) => {
        svgProps?.onLayout?.(e);
        setLayout(e.nativeEvent.layout);
      }}
      height={height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={[
        { backgroundColor },
        position === "top" && { transform: [{ rotate: "180deg" }] },
        style,
      ]}
    >
      <Path
        {...pathProps}
        d={createZigzagPath({ width, height, jagWidth, jagBottom })}
        fill={color}
      />
    </Svg>
  );
};

export default ZigZagView;
