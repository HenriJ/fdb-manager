// @flow
import * as React from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import Menu, { MenuItem } from "material-ui/Menu";
import MenuIcon from "@material-ui/icons/Menu";

import Cluster from "./Cluster";
import Explorer from "./Explorer";

const theme = createMuiTheme({});

const App = () => {
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              FoundationDB Manager
            </Typography>

            <Typography variant="subheading" color="inherit">
              <Link to="/cluster">Cluster Status</Link>
            </Typography>

            <Link to="/explorer">Data Explorer</Link>
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 64 }}>
          <Switch>
            <Route path="/cluster" component={Cluster} />
            <Route path="/explorer" component={Explorer} />
            <Route component={() => 404} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
