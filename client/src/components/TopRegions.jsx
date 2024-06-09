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

import PageLoader from "./PageLoader";
import { TOP_REGIONS_URL } from "../constants";

const TopRegions = () => {
  const [topRegions, setTopRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopRegions = async () => {
    try {
      const response = await axios.get(TOP_REGIONS_URL);
      setTopRegions(response.data);
    } catch (error) {
      console.error("Error fetching top regions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRegions();
  }, []);

  if (isLoading) return <PageLoader />;

  if (isEmpty(topRegions)) {
    return (
      <div className="flex flex-grow items-center justify-center text-2xl">
        There are no top regions to display
      </div>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Frequency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topRegions.map(({ name, count }, index) => (
            <TableRow key={index}>
              <TableCell>{name}</TableCell>
              <TableCell>{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopRegions;
