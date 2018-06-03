// @flow
import * as React from "react";
import { withStyles } from "material-ui/styles";

import type { FdbWorkloadStatus } from "../../api/cluster";

type Props = {
  classes: any,
  workload: FdbWorkloadStatus
};

const styles = theme => ({});

class Workload extends React.Component<Props> {
  render() {
    const { classes, workload } = this.props;

    return <div>{JSON.stringify(workload)}</div>;
  }
}

export default withStyles(styles)(Workload);
