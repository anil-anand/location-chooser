import routes from "./routes";

export const SIDEBAR_WIDTH = 240;
export const HEADER_WIDTH = 80;

export const HEADER_TITLES = {
  "/new": "New map capture",
  "/captured-maps": "Captured maps",
  "/top-regions": "Top regions",
};

export const SIDEBAR_ITEMS = [
  { label: "Captured maps", path: routes.capturedMaps },
  { label: "New map capture", path: routes.newMapCapture },
  { label: "Top regions", path: routes.topRegions },
];

export const BASE_64_FLAG = "data:image/png;base64,";
export const CAPTURE_CREATED_MESSAGE = "Map captured successfully";
export const TITLE_UPDATED_MESSAGE = "Title updated successfully";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://location-chooser-backend.vercel.app";
export const SAVE_URL = `${BASE_URL}/save`;
export const CAPTURES_URL = `${BASE_URL}/captures`;
export const TOP_REGIONS_URL = `${BASE_URL}/top-regions`;
