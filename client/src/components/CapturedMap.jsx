import React, { useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";

import Cuboid from "./Cuboid";
import PageLoader from "./PageLoader";

import { getBase64Image, getCapturedMapUrl } from "../utils";

const CapturedMap = () => {
  const [map, setMap] = useState({});
  const [textureUrl, setTextureUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const fetchMap = async () => {
    try {
      const { data } = await axios.get(getCapturedMapUrl(id));
      setMap(data);
      setTextureUrl(await getBase64Image({ ...data }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching captured maps:", error);
    }
  };

  useEffect(() => {
    fetchMap();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <Cuboid height={map.height} textureUrl={textureUrl} width={map.width} />
  );
};

export default CapturedMap;
