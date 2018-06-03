// @flow
import * as React from "react";

import { THEME_WIDTH } from "./theme";

type Props = {
  style?: { [key: string]: any },
  children: React.Node
};

const Section = ({ style, children }: Props) => {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 10px",
        maxWidth: THEME_WIDTH,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Section;
