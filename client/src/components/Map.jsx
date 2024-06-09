import React, { useRef, useState } from "react";

import axios from "axios";
import classNames from "classnames";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { SAVE_URL } from "../constants";
import { getBase64Image } from "../utils";

const Map = ({ onCapture }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isCapturing, setIsCapturing] = useState(false);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const captureMap = async () => {
    setIsCapturing(true);

    if (mapRef.current) {
      const currentMap = mapRef.current.state.map;
      const latitude = currentMap.center.lat();
      const longitude = currentMap.center.lng();
      const zoom = currentMap.zoom;
      const width = currentMap.getDiv().offsetWidth;
      const height = currentMap.getDiv().offsetHeight;

      const params = { latitude, longitude, zoom, width, height };

      try {
        const imageBase64 = await getBase64Image(params);
        await axios.post(SAVE_URL, params);
        onCapture({ dataUrl: imageBase64, width, height });
      } catch (error) {
        console.error("Error capturing the map image:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const onCenterChanged = () => {
    if (mapRef.current && mapRef.current.state?.map) {
      const { lat, lng } = mapRef.current.state.map.center;
      const newCenter = { lat: lat(), lng: lng() };
      setMapCenter(newCenter);
    }
  };

  return (
    <>
      <div className={classNames("text-center", { hidden: !isLoading })}>
        <CircularProgress />
      </div>
      <div
        className={classNames("flex flex-col gap-3", {
          "opacity-0": !isLoaded || isLoading,
        })}
      >
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={mapCenter}
            zoom={2}
            ref={mapRef}
            options={{ mapTypeControl: false }}
            onTilesLoaded={() => setIsLoading(false)}
            onMouseUp={onCenterChanged}
          />
        )}
        <Button
          className="self-end"
          disabled={isCapturing}
          variant="contained"
          onClick={captureMap}
        >
          Capture Map
        </Button>
      </div>
    </>
  );
};

export default Map;
