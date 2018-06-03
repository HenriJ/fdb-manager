// @flow

import { API_ROOT } from "./helpers";

export type DirectoryListResponse = {
  key: ?string,
  subDirectories: Array<string>
};

export async function list(
  directory: Array<string>
): Promise<DirectoryListResponse> {
  const req = await fetch(
    `${API_ROOT}/directories/${encodeURIComponent(JSON.stringify(directory))}`
  );
  return req.json();
}
