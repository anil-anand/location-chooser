import React, { useEffect, useState } from "react";

import axios from "axios";
import { isNotEmpty } from "ramda";
import { useParams } from "react-router-dom";

import Cuboid from "./Cuboid";
import Error from "./Error";
import PageLoader from "./PageLoader";

import { getBase64Image, getCapturedMapUrl } from "../utils";

const CapturedMap = () => {
  const [map, setMap] = useState({});
  const [error, setError] = useState({});
  const [textureUrl, setTextureUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const fetchMap = async () => {
    try {
      const { data } = await axios.get(getCapturedMapUrl(id));
      setMap(data);
      setTextureUrl(await getBase64Image({ ...data }));
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMap();
  }, []);

  if (isLoading) return <PageLoader />;

  if (isNotEmpty(error)) return <Error code={error.response.status} />;

  return (
    <Cuboid height={map.height} textureUrl={textureUrl} width={map.width} />
  );
};

export default CapturedMap;
