import React from "react";

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import CapturedMap from "./CapturedMap";
import CapturedMaps from "./CapturedMaps";
import Container from "./Container";
import NewCapture from "./NewCapture";

import routes from "../routes";

const Main = () => {
  return (
    <Router>
      <Container>
        <Switch>
          <Redirect exact from="/" to={routes.capturedMaps} />
          <Route path={routes.capturedMaps} component={CapturedMaps} />
          <Route path={routes.show} component={CapturedMap} />
          <Route path={routes.newMapCapture} component={NewCapture} />
          <Route path="*" component={() => <div>404 Not Found</div>} />
        </Switch>
      </Container>
    </Router>
  );
};

export default Main;
