// @flow
import * as React from "react";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Switch from "material-ui/Switch";
import { FormControlLabel } from "material-ui/Form";
import JSONTree from "react-json-tree";

import type { FdbStatus } from "../api/cluster";

type Props = {
  classes: any,
  status: FdbStatus,
  connection: string
};

type State = {
  treeview: boolean
};

const styles = theme => ({});

class Synthetic extends React.Component<Props, State> {
  state = {
    treeview: true
  };

  onToggleTreeView = () => this.setState({ treeview: !this.state.treeview });

  render() {
    const { classes, status, connection } = this.props;
    const { treeview } = this.state;

    return (
      <div style={{ position: "relative", padding: 50 }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper style={{ padding: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={treeview}
                    onChange={this.onToggleTreeView}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="Tree view"
              />
              {treeview ? (
                <JSONTree
                  data={status}
                  shouldExpandNode={(keyName, data, level) => level < 2}
                />
              ) : (
                <pre style={{ overflow: "auto" }}>
                  {JSON.stringify(status, null, 2)}
                </pre>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Synthetic);
