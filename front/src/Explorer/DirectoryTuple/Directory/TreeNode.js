// @flow
import * as React from "react";
import Color from "color";
import { withStyles } from "material-ui/styles";
import Badge from "material-ui/Badge";
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List";
import { CircularProgress } from "material-ui/Progress";
import IconButton from "material-ui/Button";

import FolderIcon from "@material-ui/icons/Folder";
import PlayIcon from "@material-ui/icons/PlayArrow";

import type { TreeNodeType } from "./types";
import { directoryEquals } from "./tree-utils";

type Props = {
  classes: any,
  selected: Array<string>,
  node: TreeNodeType,
  onSoftSelect: (id: Array<string>) => any,
  onHardSelect: (id: Array<string>) => any
};

const styles = theme => ({
  selected: {
    backgroundColor: theme.palette.primary.light
  },
  nested: {
    backgroundColor: Color(theme.palette.grey[200]) // Add a tertiary color ?
      .fade(0.9)
      .string()
  }
});

class TreeNode extends React.Component<Props> {
  onSoftSelect = () => this.props.onSoftSelect(this.props.node.id);
  onHardSelect = () => this.props.onHardSelect(this.props.node.id);

  render() {
    const { classes, node, selected, onSoftSelect, onHardSelect } = this.props;

    const displayChildren =
      node.open && node.children && node.children.length > 0;
    const isSelected = directoryEquals(selected, node.id);

    return (
      <React.Fragment>
        <ListItem
          button
          title={node.key}
          onClick={this.onSoftSelect}
          className={isSelected ? classes.selected : null}
        >
          <ListItemIcon>
            {node.children === null ||
            node.children === undefined ||
            node.children.length > 0 ? (
              <Badge
                badgeContent={node.children ? node.children.length : "-"}
                color="primary"
              >
                <FolderIcon />
              </Badge>
            ) : (
              <FolderIcon />
            )}
          </ListItemIcon>
          <ListItemText inset primary={node.name} />
          <ListItemSecondaryAction>
            {node.loading && <CircularProgress />}
            <IconButton onClick={this.onHardSelect}>
              <PlayIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {displayChildren && (
          <List
            className={classes.nested}
            style={{
              paddingLeft: 6
            }}
          >
            {// $FlowFixMe : Checked through displayChildren
            node.children.map(child => (
              <StyledTreeNode
                key={child.id.join("%,/")}
                selected={selected}
                node={child}
                onSoftSelect={onSoftSelect}
                onHardSelect={onHardSelect}
              />
            ))}
          </List>
        )}
      </React.Fragment>
    );
  }
}

const StyledTreeNode = withStyles(styles)(TreeNode);
export default StyledTreeNode;
