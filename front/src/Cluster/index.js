// @flow
import * as React from "react";
import {
  Redirect,
  Route,
  Switch,
  matchPath,
  withRouter
} from "react-router-dom";

import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";
import Tabs, { Tab } from "material-ui/Tabs";
import Typography from "material-ui/Typography";

import {
  status as loadStatus,
  connection as loadConnection
} from "../api/cluster";
import type { FdbStatus } from "../api/cluster";

import SyntheticView from "./SyntheticView";
import JsonView from "./JsonView";

type Props = {
  classes: any,
  location: { pathname: string },
  match: { path: string },
  history: { push: (to: string) => any }
};

type State = {
  loading: boolean,
  status: ?FdbStatus,
  connection: ?string
};

const styles = theme => ({});

class Cluster extends React.Component<Props, State> {
  state = {
    loading: false,
    status: null,
    connection: null
  };

  componentDidMount() {
    this.loadData();
  }

  onChangeTab = (event, value) => {
    const { history, match } = this.props;
    history.push(`${match.path}/${value}`);
  };

  loadData = async () => {
    this.setState({ loading: true });
    const [status, connection] = await Promise.all([
      loadStatus(),
      loadConnection()
    ]);
    this.setState({ loading: false, status, connection });
  };

  render() {
    const { match, location, classes } = this.props;
    const { loading, status, connection } = this.state;

    const hasData = status && connection;
    const tabMatch = matchPath(location.pathname, {
      path: `${match.path}/:tab`,
      strict: false
    });
    const tab = tabMatch ? tabMatch.params.tab : "synthetic";

    return (
      <div style={{ position: "relative" }}>
        {loading && (
          <CircularProgress
            style={{ position: "absolute", top: 50, right: 50 }}
          />
        )}
        <Paper style={{ position: "fixed", width: "100%", zIndex: 500 }}>
          <Tabs
            value={tab}
            onChange={this.onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Synthetic" value="synthetic" />
            <Tab label="JSON" value="json" />
            <Tab label="Graph (TODO)" value="graph" />
          </Tabs>
        </Paper>
        <div style={{ paddingTop: 48 }}>
          {hasData && (
            <Switch>
              <Redirect
                exact
                from={`${match.path}`}
                to={`${match.path}/synthetic`}
              />
              <Route
                path={`${match.path}/synthetic`}
                render={() => (
                  <SyntheticView status={status} connection={connection} />
                )}
              />
              <Route
                path={`${match.path}/json`}
                render={() => (
                  <JsonView status={status} connection={connection} />
                )}
              />
              <Route component={() => 404} />
            </Switch>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Cluster));
