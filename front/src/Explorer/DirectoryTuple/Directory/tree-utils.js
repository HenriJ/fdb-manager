// @flow
import type { TreeNodeType } from "./types";

export const findNode = (
  directory: Array<string>,
  nodes: Array<TreeNodeType>
) => {
  const [name, ...rest] = directory;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.name === name) {
      if (rest.length > 0) {
        if (node.children) {
          return findNode(rest, node.children);
        }
        return null; // Not yet loaded
      }
      return node;
    }
  }

  return null; // Does not exist
};

export const directoryEquals = (a: Array<string>, b: Array<string>) => {
  if (!a || !b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
