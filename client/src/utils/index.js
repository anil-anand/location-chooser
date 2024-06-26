import axios from "axios";
import { stringify } from "qs";
import { isEmpty, omit, pipe, toPairs } from "ramda";

import { BASE_64_FLAG, CAPTURES_URL } from "../constants";

const buildMapUrl = ({
  latitude,
  longitude,
  zoom,
  width = 600,
  height = 400,
}) =>
  `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&key=${process.env.REACT_APP_GOOGLE_MAPS_API}`;

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const length = bytes.byteLength;

  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
};

export const getBase64Image = async ({
  latitude,
  longitude,
  zoom,
  width,
  height,
}) => {
  const staticMapUrl = buildMapUrl({
    latitude,
    longitude,
    zoom,
    width,
    height,
  });

  try {
    const response = await axios.get(staticMapUrl, {
      responseType: "arraybuffer",
    });

    const imageStr = arrayBufferToBase64(response.data);
    const imageBase64 = BASE_64_FLAG + imageStr;

    return imageBase64;
  } catch (error) {
    console.error("Error capturing the map image:", error);

    return "";
  }
};

export const buildUrl = (route, params) => {
  const placeHolders = [];
  toPairs(params).forEach(([key, value]) => {
    if (!route.includes(`:${key}`)) return;
    placeHolders.push(key);
    route = route.replace(`:${key}`, encodeURIComponent(value));
  });

  const queryParams = pipe(omit(placeHolders), stringify)(params);

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};

export const getCapturedMapUrl = (id) => `${CAPTURES_URL}/${id}`;
