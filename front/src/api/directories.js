// @flow

import { API_ROOT } from "./helpers";

export type DirectoryListResponse = {
  key: ?string,
  subDirectories: Array<string>
};

export async function list(
  directory: Array<string>
): Promise<DirectoryListResponse> {
  const d =
    directory.length > 0 ? encodeURIComponent(JSON.stringify(directory)) : "";
  const req = await fetch(`${API_ROOT}/directories/${d}`);
  return req.json();
}
