// @flow
import * as React from "react";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "material-ui/Table";

import type { FdbMachineStatus, FdbProcessStatus } from "../../api/cluster";

type Props = {
  classes: any,
  machines: { [machineId: string]: FdbMachineStatus },
  processes: { [processId: string]: FdbProcessStatus }
};

const styles = theme => ({});

class ProcessesTable extends React.Component<Props> {
  render() {
    const { classes, machines, processes } = this.props;

    const rows = Object.keys(processes).map(processId => {
      const process: FdbProcessStatus = processes[processId];
      const machine: FdbMachineStatus = machines[process.machine_id];

      return (
        <TableRow key={processId}>
          <TableCell component="th" scope="row">
            {processId}
          </TableCell>
          <TableCell>{machine.address}</TableCell>
          <TableCell>
            {process.roles.map(role => role.role).join(", ")}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Process</TableCell>
            <TableCell>Machine</TableCell>
            <TableCell>Roles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ProcessesTable);
