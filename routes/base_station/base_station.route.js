const router = require("express").Router();
const prisma = require("../../db").getInstance();

// POST /
// Add a new base station
router.post("/", async (req, res) => {
  const { hardwareId, lat, lng, name } = req.body;
  if (!hardwareId || !lat || !lng || !name) {
    return res.status(400).json({
      error: "Hardware ID, name, latitude and longitude are required",
    });
  }
  // verify that the hardware ID is unique
  const existingBaseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
    },
    where: {
      hardwareId,
    },
  });
  if (existingBaseStation) {
    return res.status(400).json({
      error: "Hardware ID already exists",
    });
  }
  // create
  const baseStation = await prisma.baseStation.create({
    select: {
      id: true,
      name: true,
      hardwareId: true,
      lat: true,
      lng: true,
    },
    data: {
      hardwareId,
      name,
      lat,
      lng,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });
  return res.status(201).json(baseStation);
});

// GET /
// Get all base stations
router.get("/", async (req, res) => {
  const baseStations = await prisma.baseStation.findMany({
    select: {
      id: true,
      name: true,
      hardwareId: true,
      lat: true,
      lng: true,
    },
    where: {
      userId: req.user.id,
    },
  });
  return res.status(200).json(baseStations);
});

// GET /:id
// Get a base station by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const baseStation = await prisma.baseStation.findUnique({
    select: {
      id: true,
      name: true,
      hardwareId: true,
      lat: true,
      lng: true,
    },
    where: {
      id: parseInt(id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  return res.status(200).json(baseStation);
});

// GET /:id/local_weather_data
router.get("/:id/local_weather_data", async (req, res) => {
  const { id } = req.params;
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const localWeatherData = await prisma.localWeatherData.findMany({
    select: {
      id: true,
      humidity: true,
      temperature: true,
      timestamp: true,
    },
    where: {
      baseStationId: baseStation.id,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return res.status(200).json(localWeatherData);
});

// GET /:id/latest_data
// Get the latest data of each thing from a base station
router.get("/:id/latest_data", async (req, res) => {
  const { id } = req.params;
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  // prisma print all table names
  const data = await prisma.localWeatherData.findFirst({
    where: {
        baseStationId: baseStation.id,
    },
    orderBy: {
        timestamp: "desc",
    }
  })
  let latestData = {}
  if (data) {
    latestData = {
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: data.timestamp,
    }
  } else {
    latestData = {
      temperature: null,
      humidity: null,
      timestamp: null,
    }
  }
  return res.status(200).json(latestData);
});

module.exports = router;
