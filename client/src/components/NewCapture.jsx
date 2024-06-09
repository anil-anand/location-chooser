import React, { useState } from "react";

import { Typography } from "@mui/material";

import Cuboid from "./Cuboid";
import Map from "./Map";

const NewCapture = () => {
  const [textureUrl, setTextureUrl] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleCapture = ({ dataUrl, width, height }) => {
    setTextureUrl(dataUrl);
    setDimensions({ width, height });
  };

  return (
    <div className="flex flex-col gap-3">
      <Map onCapture={handleCapture} />
      {textureUrl && (
        <>
          <Typography align="center" variant="h5">
            Preview
          </Typography>
          <Cuboid {...dimensions} textureUrl={textureUrl} />
        </>
      )}
    </div>
  );
};

export default NewCapture;
