const express = require("express");
const router = express.Router();
const MapCapture = require("../models/MapCapture");
const axios = require("axios");

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
    response.status(201).send("Saved");
  } catch (error) {
    response.status(500).send(error.message);
  }
});

router.get("/captures", async (_, response) => {
  try {
    const captures = await MapCapture.find().sort({ createdAt: -1 });
    response.json(captures);
  } catch (error) {
    response.status(500).send(error.message);
  }
});

router.get("/captures/:id", async (request, response) => {
  try {
    const capture = await MapCapture.findOne({ _id: request.params.id });

    if (!capture) throw new Error();

    response.json(capture);
  } catch (error) {
    response.status(404).send(`Capture with ID ${request.params.id} not found`);
  }
});

module.exports = router;
