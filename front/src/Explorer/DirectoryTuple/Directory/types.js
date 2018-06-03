// @flow

export type TreeNodeType = {
  id: Array<string>,
  name: string,
  open: boolean,
  loading: boolean,
  key: ?string, // null if not yet loaded
  children: ?Array<TreeNodeType> // null if not yet loaded
};
