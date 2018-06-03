// @flow

import { API_ROOT } from "./helpers";

export type FdbClientStatus = {
  coordinators: {
    coordinators: Array<{ address: string, reachable: boolean }>,
    quroum_reachable: boolean
  },
  database_status: {
    available: boolean,
    healthy: boolean
  }
};

export type FdbMachineStatus = {
  address: string,
  cpu: {
    logical_core_utilization: number,
    excluded: boolean,
    memory: {
      commited_bytes: number,
      free_bytes: number,
      total_bytes: number
    },
    network: {
      megabits_received: {
        hz: number
      },
      megabits_sent: {
        hz: number
      }
    }
  }
};

export type FdbRoleStatus = {
  id: string,
  role: string
};

export type FdbProcessStatus = {
  machine_id: string,
  roles: Array<FdbRoleStatus>
};

export type FdbFrequencyCounter = {
  counter: number,
  hz: number,
  roughness: number
};

export type FdbWorkloadStatus = {
  bytes: {
    written: FdbFrequencyCounter
  },
  operations: {
    reads: {
      hz: number
    },
    writes: FdbFrequencyCounter
  },
  transactions: {
    commited: FdbFrequencyCounter,
    conflicted: FdbFrequencyCounter,
    started: FdbFrequencyCounter
  }
};

export type FdbClusterStatus = {
  clients: {
    count: number
  },
  configuration: {
    coordinators_counts: number,
    excluded_servers: Array<any>,
    redundancy: {
      factor: string
    },
    storage_engine: string,
    storage_policy: string
  },
  data: any,
  machines: { [machineId: string]: FdbMachineStatus },
  processes: { [processId: string]: FdbProcessStatus },
  workload: FdbWorkloadStatus
};

export type FdbStatus = {
  client: FdbClientStatus,
  cluster: FdbClusterStatus
};

export async function status(): Promise<FdbStatus> {
  const req = await fetch(`${API_ROOT}/cluster/status`);
  return req.json();
}

export async function connection(): Promise<string> {
  const req = await fetch(`${API_ROOT}/cluster/connection`);
  return req.text();
}
