// @flow
import * as React from "react";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "material-ui/ExpansionPanel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "material-ui/Typography";

import type { FdbStatus } from "../../api/cluster";

import ProcessesTable from "./ProcessesTable";
import Workload from "./Workload";

type Props = {
  classes: any,
  status: FdbStatus,
  connection: string
};

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class SyntheticView extends React.Component<Props> {
  render() {
    const { classes, status, connection } = this.props;

    return (
      <div style={{ position: "relative", padding: 50 }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  Connection string
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography style={{ textAlign: "center" }}>
                  {connection}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item xs={12}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Workload</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Workload workload={status.cluster.workload} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item xs={12}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Processes</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ProcessesTable
                  machines={status.cluster.machines}
                  processes={status.cluster.processes}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SyntheticView);
