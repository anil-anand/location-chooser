import React, { useEffect, useState } from "react";

import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { isEmpty } from "ramda";
import { useHistory } from "react-router-dom";

import PageLoader from "./PageLoader";

import { CAPTURES_URL } from "../constants";
import routes from "../routes";
import { buildUrl } from "../utils";

const CapturedMaps = () => {
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  const fetchMaps = async () => {
    try {
      const response = await axios.get(CAPTURES_URL);
      setMaps(response.data);
    } catch (error) {
      console.error("Error fetching captured maps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  if (isLoading) return <PageLoader />;

  if (isEmpty(maps)) {
    return (
      <div className="flex flex-grow items-center justify-center text-2xl">
        No captured maps found
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Zoom</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maps.map(({ _id: id, latitude, longitude, zoom, title }, index) => (
            <TableRow
              className="cursor-pointer hover:bg-gray-100 transition-colors ease-in-out duration-300"
              key={index}
              onClick={() => history.push(buildUrl(routes.show, { id }))}
            >
              <TableCell>{title}</TableCell>
              <TableCell>{latitude}</TableCell>
              <TableCell>{longitude}</TableCell>
              <TableCell>{zoom}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CapturedMaps;
