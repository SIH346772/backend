const router = require("express").Router();
const prisma = require("../../db").getInstance();

// POST /:id/sensor_probe
// Add a new sensor probe to a base station
router.post("/:id/sensor_probe", async (req, res) => {
  const { id } = req.params;
  const { hardwareId, lat, lng, name } = req.body;
  if (!id || !hardwareId || !lat || !lng || !name) {
    return res.status(400).json({
      error: "Hardware ID, name, latitude and longitude are required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
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
  // verify that the hardware ID is unique
  const existingSensorProbe = await prisma.sensorProbe.findFirst({
    select: {
      id: true,
    },
    where: {
      hardwareId,
    },
  });
  if (existingSensorProbe) {
    return res.status(400).json({
      error: "Hardware ID already exists",
    });
  }
  // create
  const sensorProbe = await prisma.sensorProbe.create({
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
      baseStation: {
        connect: {
          id: baseStation.id,
        },
      },
    },
  });
  return res.status(201).json(sensorProbe);
});

// GET /:id/sensor_probe
// Get all sensor probes for a base station
router.get("/:id/sensor_probe", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
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
  const sensorProbes = await prisma.sensorProbe.findMany({
    select: {
      id: true,
      name: true,
      hardwareId: true,
      lat: true,
      lng: true,
    },
    where: {
      baseStationId: baseStation.id,
    },
  });
  return res.status(200).json(sensorProbes);
});

// GET /:id/sensor_probe/:sensorProbeId
// Get a sensor probe by id
router.get("/:id/sensor_probe/:sensorProbeId", async (req, res) => {
  const { id, sensorProbeId } = req.params;
  if (!id || !sensorProbeId) {
    return res.status(400).json({
      error: "Base station ID and sensor probe ID are required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
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
  const sensorProbe = await prisma.sensorProbe.findFirst({
    select: {
      id: true,
      name: true,
      hardwareId: true,
      lat: true,
      lng: true,
    },
    where: {
      id: parseInt(sensorProbeId),
      baseStationId: baseStation.id,
    },
  });
  if (!sensorProbe) {
    return res.status(404).json({
      error: "Sensor probe not found",
    });
  }
  return res.status(200).json(sensorProbe);
});

// POST /:id/sensor_probe/:sensorProbeId/pump
// Connect a pump to a sensor probe
router.post("/:id/sensor_probe/:sensorProbeId/pump", async (req, res) => {
  const { pumpId } = req.body;
  const { id, sensorProbeId } = req.params;
  if (!id || !sensorProbeId || !pumpId) {
    return res.status(400).json({
      error: "Base station ID, sensor probe ID and pump ID are required",
    });
  }
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
  const sensorProbe = await prisma.sensorProbe.findFirst({
    select: {
      id: true,
      waterPumpId: true,
    },
    where: {
      id: parseInt(sensorProbeId),
      baseStationId: baseStation.id,
    },
  });
  if (!sensorProbe) {
    return res.status(404).json({
      error: "Sensor probe not found",
    });
  }
  const pump = await prisma.waterPump.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(pumpId),
      baseStationId: baseStation.id,
    },
  });
  if (!pump) {
    return res.status(404).json({
      error: "Pump not found",
    });
  }
  // update sensor probe
  const updatedSensorProbe = await prisma.sensorProbe.update({
    select: {
      id: true,
      waterPumpId: true,
    },
    where: {
      id: parseInt(sensorProbeId),
    },
    data: {
      waterPumpId: pump.id,
    },
  });
  return res.status(200).json(updatedSensorProbe);
});

// GET /:id/sensor_probe/:sensorProbeId/pump
// Get pump details for a sensor probe
router.get("/:id/sensor_probe/:sensorProbeId/pump", async (req, res) => {
  const { id, sensorProbeId } = req.params;
  if (!id || !sensorProbeId) {
    return res.status(400).json({
      error: "Base station ID and sensor probe ID are required",
    });
  }
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
  const sensorProbe = await prisma.sensorProbe.findFirst({
    select: {
      id: true,
      waterPump: {
        select: {
          id: true,
          pumpNo: true,
          predictedWaterVolume: true,
        },
      },
    },
    where: {
      id: parseInt(sensorProbeId),
      baseStationId: baseStation.id,
    },
  });
  if (!sensorProbe) {
    return res.status(404).json({
      error: "Sensor probe not found",
    });
  }
  if (!sensorProbe.waterPump) {
    return res.status(404).json({
      error: "Pump not connected",
    });
  }
  return res.status(200).json(sensorProbe.waterPump);
});

// GET /:baseStationId/sensor_probe/:sensorProbeId/weather_data
// Get weather data for a sensor probe
// TODO: Query params: from, to
router.get("/:baseStationId/sensor_probe/:sensorProbeId/weather_data", async (req, res) => {
    const { baseStationId, sensorProbeId } = req.params;
    if (!baseStationId || !sensorProbeId) {
        return res.status(400).json({
            error: "Base station ID and sensor probe ID are required",
        });
    }
    const baseStation = await prisma.baseStation.findFirst({
        select: {
            id: true,
        },
        where: {
            id: parseInt(baseStationId),
            userId: req.user.id,
        },
    });
    if (!baseStation) {
        return res.status(404).json({
            error: "Base station not found",
        });
    }
    const weather_data = await prisma.weatherData.findMany({
        where: {
            sensorProbeId: parseInt(sensorProbeId),
        },
        select: {
            id: true,
            temperature: true,
            humidity: true,
            pressure: true,
            windSpeed: true,
            windDeg: true,
            precipitation: true,
            timestamp: true,
        },
        orderBy: {
            timestamp: "desc",
        }
    })
    return res.status(200).json(weather_data);
});


// GET /:baseStationId/sensor_probe/:sensorProbeId/soil_data
// Get soil data for a sensor probe
// TODO: Query params: from, to
router.get("/:baseStationId/sensor_probe/:sensorProbeId/soil_data", async (req, res) => {
    const { baseStationId, sensorProbeId } = req.params;
    if (!baseStationId || !sensorProbeId) {
        return res.status(400).json({
            error: "Base station ID and sensor probe ID are required",
        });
    }
    const baseStation = await prisma.baseStation.findFirst({
        select: {
            id: true,
        },
        where: {
            id: parseInt(baseStationId),
            userId: req.user.id,
        },
    });
    if (!baseStation) {
        return res.status(404).json({
            error: "Base station not found",
        });
    }
    const soil_data = await prisma.soilData.findMany({
        where: {
            sensorProbeId: parseInt(sensorProbeId),
        },
        select: {
            id: true,
            temperature: true,
            topLayerMoisture: true,
            bottomLayerMoisture: true,
            timestamp: true,
        },
        orderBy: {
            timestamp: "desc",
        }
    })
    return res.status(200).json(soil_data);
});

// GET /:baseStationId/sensor_probe/:sensorProbeId/latest_data
// Get the latest data for a sensor probe
router.get("/:baseStationId/sensor_probe/:sensorProbeId/latest_data", async (req, res) => {
    const { baseStationId, sensorProbeId } = req.params;
    if (!baseStationId || !sensorProbeId) {
        return res.status(400).json({
            error: "Base station ID and sensor probe ID are required",
        });
    }
    const baseStation = await prisma.baseStation.findFirst({
        select: {
            id: true,
        },
        where: {
            id: parseInt(baseStationId),
            userId: req.user.id,
        },
    });
    if (!baseStation) {
        return res.status(404).json({
            error: "Base station not found",
        });
    }
    const sensorProbe = await prisma.sensorProbe.findFirst({
        select: {
            id: true,
        },
        where: {
            id: parseInt(sensorProbeId),
            baseStationId: baseStation.id,
        },
    });
    if (!sensorProbe) {
        return res.status(404).json({
            error: "Sensor probe not found",
        });
    }
    const latest_soil_data = await prisma.soilData.findFirst({
        where: {
            sensorProbeId: sensorProbe.id,
        },
        select: {
            id: true,
            temperature: true,
            topLayerMoisture: true,
            bottomLayerMoisture: true,
            timestamp: true,
        },
        orderBy: {
            timestamp: "desc",
        }
    })

    let data = {};
    if (latest_soil_data) {
      data = {
        temperature: latest_soil_data.temperature,
        topLayerMoisture: latest_soil_data.topLayerMoisture,
        bottomLayerMoisture: latest_soil_data.bottomLayerMoisture,
        timestamp: latest_soil_data.timestamp,
      }
    } else {
      data = {
        temperature: null,
        topLayerMoisture: null,
        bottomLayerMoisture: null,
        timestamp: null,
      }
    }
    return res.status(200).json(data);
});

module.exports = router;
