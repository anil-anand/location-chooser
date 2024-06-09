const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const { CACHE_TTL, CAPTURES_CACHE_KEY } = require("../constants");
const MapCapture = require("../models/MapCapture");

const router = express.Router();
const myCache = new NodeCache({ stdTTL: CACHE_TTL });

router.post("/save", async (request, response) => {
  try {
    const { latitude, longitude, zoom, image, width, height } = request.body;
    const newCapture = new MapCapture({
      latitude,
      longitude,
      zoom,
      image,
      width,
      height,
    });
    await newCapture.save();
    myCache.del(CAPTURES_CACHE_KEY);
    response.status(201).send("Saved");
  } catch (error) {
    response.status(500).send(error.message);
  }
});

router.get("/captures", async (_, response) => {
  try {
    if (myCache.has(CAPTURES_CACHE_KEY)) {
      response.json(myCache.get(CAPTURES_CACHE_KEY));
    } else {
      const captures = await MapCapture.find().sort({ createdAt: -1 });
      myCache.set(CAPTURES_CACHE_KEY, captures);
      response.json(captures);
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
});

router.get("/captures/:id", async (request, response) => {
  try {
    if (myCache.has(request.params.id)) {
      response.json(myCache.get(request.params.id));
    } else {
      const capture = await MapCapture.findOne({ _id: request.params.id });

      if (!capture) throw new Error();

      myCache.set(request.params.id, capture);
      response.json(capture);
    }
  } catch (error) {
    response.status(404).send(`Capture with ID ${request.params.id} not found`);
  }
});

module.exports = router;
