import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import Container from "./Container";
import NewCapture from "./NewCapture";

import routes from "../routes";

const Main = () => {
  return (
    <Router>
      <Container>
        <Switch>
          <Route path={routes.newMapCapture} component={NewCapture} />
          <Route path="*" component={() => <div>404 Not Found</div>} />
        </Switch>
      </Container>
    </Router>
  );
};

export default Main;
