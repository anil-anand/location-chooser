import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";
import Slide from "@mui/material/Slide";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Input,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { isNotEmpty, not } from "ramda";
import { useParams } from "react-router-dom";

import Cuboid from "./Cuboid";
import Error from "./Error";
import PageLoader from "./PageLoader";

import { getBase64Image, getCapturedMapUrl } from "../utils";
import { CAPTURE_CREATED_MESSAGE, TITLE_UPDATED_MESSAGE } from "../constants";

const CapturedMap = () => {
  const [map, setMap] = useState({});
  const [error, setError] = useState({});
  const [textureUrl, setTextureUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [toastMessage, setToastMessage] = useState(CAPTURE_CREATED_MESSAGE);

  const { id } = useParams();

  const mapUrl = useMemo(() => getCapturedMapUrl(id), [id]);

  const query = new URLSearchParams(window.location.search);

  const [showToast, setShowToast] = useState(Boolean(query.get("new")));

  const fetchMap = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(mapUrl);
      setMap(data);
      setTextureUrl(await getBase64Image({ ...data }));
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTitle = async () => {
    setIsUpdating(true);
    try {
      await axios.put(mapUrl, { title: title.trim() });
      setToastMessage(TITLE_UPDATED_MESSAGE);
      setShowToast(true);
    } catch (error) {
      console.error("Error updating the map title:", error);
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
      fetchMap();
    }
  };

  const handleClickEditButton = () => {
    if (isEditing) {
      handleEditTitle(title);
    } else {
      setTitle(map.title);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    fetchMap();
  }, []);

  if (isLoading) return <PageLoader />;

  if (isNotEmpty(error)) return <Error code={error.response.status} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <Input
            defaultValue={map.title}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleEditTitle();
            }}
          />
        ) : (
          <Typography variant="h6">{map.title}</Typography>
        )}
        <IconButton
          disabled={isUpdating || (isEditing && title === map.title)}
          variant="contained"
          onClick={handleClickEditButton}
        >
          {isEditing ? (
            <Tooltip placement="top" title="Save">
              <CheckIcon />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Edit">
              <EditIcon />
            </Tooltip>
          )}
        </IconButton>
        {isEditing && (
          <Tooltip placement="top" title="Cancel edit">
            <IconButton variant="contained" onClick={() => setIsEditing(false)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Cuboid height={map.height} textureUrl={textureUrl} width={map.width} />
      <Snackbar
        autoHideDuration={3000}
        open={showToast}
        message={toastMessage}
        TransitionComponent={Slide}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default CapturedMap;
