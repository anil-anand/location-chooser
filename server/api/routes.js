const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const {
  CACHE_TTL,
  CAPTURES_CACHE_KEY,
  TOP_REGIONS_CACHE_KEY,
} = require("../constants");
const MapCapture = require("../models/MapCapture");

const router = express.Router();
const myCache = new NodeCache({ stdTTL: CACHE_TTL });

router.post("/save", async (request, response) => {
  try {
    const { latitude, longitude, zoom, image, width, height } = request.body;
    const geoCodedLocationResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}&language=en`
    );

    const newCapture = new MapCapture({
      latitude,
      longitude,
      zoom,
      image,
      width,
      height,
      title: `Map Capture ${new Date().toISOString()}`,
      geoCodedLocation:
        geoCodedLocationResponse.data.results[0]?.formatted_address ||
        "Unknown location",
    });
    await newCapture.save();
    myCache.del([CAPTURES_CACHE_KEY, TOP_REGIONS_CACHE_KEY]);
    response.status(201).json({ message: "Saved", id: newCapture._id });
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

router.put("/captures/:id", async (request, response) => {
  try {
    const { title } = request.body;
    await MapCapture.updateOne({ _id: request.params.id }, { title });
    myCache.del([CAPTURES_CACHE_KEY, request.params.id]);
    response.status(200).json({ message: "Updated" });
  } catch (error) {
    response.status(500).send(error.message);
  }
});

router.get("/top-regions", async (_, response) => {
  try {
    if (myCache.has(TOP_REGIONS_CACHE_KEY)) {
      response.json(myCache.get(TOP_REGIONS_CACHE_KEY));
      return;
    }

    const captures = await MapCapture.aggregate([
      {
        $group: {
          _id: {
            latitude: "$latitude",
            longitude: "$longitude",
            zoom: "$zoom",
          },
          count: { $sum: 1 },
          geoCodedLocation: { $first: "$geoCodedLocation" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    const geoCodedRegions = captures.map((region) => ({
      ...region,
      name: region.geoCodedLocation || "Unknown location",
    }));

    myCache.set(TOP_REGIONS_CACHE_KEY, geoCodedRegions);
    response.json(geoCodedRegions);
  } catch (error) {
    response.status(500).send(error.message);
  }
});

module.exports = router;
