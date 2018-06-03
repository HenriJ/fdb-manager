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
import Typography from "material-ui/Typography";

import Directory from "./Directory";

type Props = {
  classes: any,
  location: { pathname: string },
  match: { path: string },
  history: { push: (to: string) => any }
};

type State = {};

const styles = theme => ({});

class DirectoryTuple extends React.Component<Props, State> {
  state = {};

  onSelectDirectory = (directory: Array<string>) => {
    const { match, history } = this.props;
    history.push(
      `${match.path}/${encodeURIComponent(JSON.stringify(directory))}`
    );
  };

  render() {
    const { match, location, classes } = this.props;

    const directoryMatch = matchPath(location.pathname, {
      path: `${match.path}/:directory`,
      strict: false
    });
    let directory = [];

    try {
      if (directoryMatch) {
        directory = JSON.parse(
          decodeURIComponent(directoryMatch.params.directory)
        );
      }
    } catch (e) {
      // NOOP
    }

    return (
      <div style={{ position: "relative" }}>
        <Directory directory={directory} onSelect={this.onSelectDirectory} />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(DirectoryTuple));
