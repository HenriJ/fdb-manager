// @flow
import * as React from "react";
import { matchPath, withRouter } from "react-router-dom";

import { withStyles } from "material-ui/styles";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";

import { list as fetchList } from "../../../api/directories";
import type { DirectoryListResponse } from "../../../api/directories";

import type { TreeNodeType } from "./types";
import { findNode } from "./tree-utils";
import TreeNode from "./TreeNode";

type Props = {
  classes: any,
  location: { pathname: string },
  match: { path: string },
  history: { push: (to: string) => any },
  directory: Array<string>,
  onSelect: (directory: Array<string>) => any
};

type State = {
  loading: number,
  tree: Array<TreeNodeType>,
  softSelectedDirectory: Array<string>
};

const styles = theme => ({});

const buildChildren = (
  parent: Array<string>,
  subDirectories: Array<string>
) => {
  return subDirectories.map(sub => ({
    id: parent.concat(sub),
    name: sub,
    open: false,
    loading: false,
    key: null,
    children: null
  }));
};

class Directory extends React.Component<Props, State> {
  state = {
    loading: 0,
    tree: [],
    softSelectedDirectory: []
  };

  componentDidMount() {
    this.reset();
  }

  onChangeTab = (event, value) => {
    const { history, match } = this.props;
    history.push(`${match.path}/${value}`);
  };

  onSoftSelect = async (softSelectedDirectory: Array<string>) => {
    const { tree } = this.state;
    const node = findNode(softSelectedDirectory, tree);
    if (!node) return;

    node.open = !node.open;
    this.setState({ softSelectedDirectory, tree }); // Force re-render
    if (node.children === null && !node.loading) {
      node.loading = true;
      this.setState({ tree }); // Force re-render
      try {
        const subDirectoryList = await fetchList(softSelectedDirectory);
        const children = buildChildren(
          node.id,
          subDirectoryList.subDirectories
        );
        node.key = subDirectoryList.key;
        node.children = children;
        this.setState({ tree }); // Force re-render
      } finally {
        node.loading = false;
        this.setState({ tree }); // Force re-render
      }
    }
  };

  onHardSelect = (directory: Array<string>) => {
    this.props.onSelect(directory);
  };

  reset = async () => {
    this.setState({ loading: this.state.loading + 1 });
    const directoryList = await fetchList([]);
    const nodes = buildChildren([], directoryList.subDirectories);
    this.setState({ loading: this.state.loading - 1, tree: nodes });
  };

  render() {
    const { match, location, classes, directory } = this.props;
    const { loading, tree, softSelectedDirectory } = this.state;

    return (
      <div
        style={{
          position: "fixed",
          overflow: "auto",
          width: 300,
          height: "100%"
        }}
      >
        <Typography variant="title" color="inherit" style={{ padding: 10 }}>
          Directories
        </Typography>

        <List>
          {tree.map(node => (
            <TreeNode
              key={node.id.join("%,/")}
              selected={directory}
              node={node}
              onSoftSelect={this.onSoftSelect}
              onHardSelect={this.onHardSelect}
            />
          ))}
        </List>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Directory));
