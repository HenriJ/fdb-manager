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
import Tabs, { Tab } from "material-ui/Tabs";

import DirectoryTuple from "./DirectoryTuple";

type Props = {
  location: { pathname: string },
  match: { path: string },
  history: { push: (to: string) => any }
};

const styles = theme => ({});

class Explorer extends React.Component<Props> {
  onChangeTab = (event, value) => {
    const { history, match } = this.props;
    history.push(`${match.path}/${value}`);
  };

  render() {
    const { match, location } = this.props;

    const tabMatch = matchPath(location.pathname, {
      path: `${match.path}/:tab`,
      strict: false
    });
    const tab = tabMatch ? tabMatch.params.tab : "raw";

    return (
      <div style={{ position: "relative" }}>
        <Paper style={{ position: "fixed", width: "100%", zIndex: 500 }}>
          <Tabs
            value={tab}
            onChange={this.onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Raw" value="raw" />
            <Tab label="Directory" value="directories" />
            <Tab label="Query" value="queries" />
          </Tabs>
        </Paper>
        <div style={{ paddingTop: 48 }}>
          <Switch>
            <Redirect
              exact
              from={`${match.path}`}
              to={`${match.path}/directories`}
            />
            <Route path={`${match.path}/raw`} render={() => <div>TODO</div>} />
            <Route
              path={`${match.path}/directories`}
              render={() => <DirectoryTuple />}
            />
            <Route component={() => 404} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Explorer));
