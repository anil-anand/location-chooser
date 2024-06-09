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
import Error from "./Error";
import NewCapture from "./NewCapture";
import TopRegions from "./TopRegions";

import routes from "../routes";

const Main = () => {
  return (
    <Router>
      <Container>
        <Switch>
          <Redirect exact from="/" to={routes.capturedMaps} />
          <Route exact path={routes.capturedMaps} component={CapturedMaps} />
          <Route exact path={routes.show} component={CapturedMap} />
          <Route exact path={routes.newMapCapture} component={NewCapture} />
          <Route exact path={routes.topRegions} component={TopRegions} />
          <Route path="*" component={Error} />
        </Switch>
      </Container>
    </Router>
  );
};

export default Main;
