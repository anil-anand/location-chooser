import routes from "./routes";

export const SIDEBAR_WIDTH = 240;
export const HEADER_WIDTH = 80;

export const HEADER_TITLES = {
  "/new": "New map capture",
  "/captured-maps": "Captured maps",
};

export const SIDEBAR_ITEMS = [
  { label: "Captured maps", path: routes.capturedMaps },
  { label: "New map capture", path: routes.newMapCapture },
];

export const BASE_64_FLAG = "data:image/png;base64,";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://location-chooser-backend.vercel.app";
export const SAVE_URL = `${BASE_URL}/save`;
export const CAPTURES_URL = `${BASE_URL}/captures`;
