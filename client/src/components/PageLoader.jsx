import React from "react";

import { CircularProgress } from "@mui/material";

const PageLoader = () => (
  <div className="flex flex-grow items-center justify-center">
    <CircularProgress />
  </div>
);

export default PageLoader;
