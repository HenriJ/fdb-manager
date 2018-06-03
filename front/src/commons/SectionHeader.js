// @flow
import * as React from "react";

import { THEME_WIDTH_LARGE, THEME_RED } from "./theme";

const GOLD_COLOR = "#e4b96f";

type Props = {
  children: React.Node
};

const SectionHeader = ({ children }: Props) => {
  return (
    <div
      style={{
        maxWidth: THEME_WIDTH_LARGE,
        margin: "30px auto 15px auto",
        borderTop: "1px #000 solid",
        borderBottom: "1px #000 solid"
      }}
    >
      <div
        style={{
          margin: "3px 0",
          width: "100%",
          borderTop: `1px ${GOLD_COLOR} solid`,
          borderBottom: `1px ${GOLD_COLOR} solid`,
          color: THEME_RED,
          fontSize: 30,
          textAlign: "center",
          letterSpacing: 8,
          textTransform: "uppercase"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionHeader;
