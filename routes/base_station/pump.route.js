const router = require("express").Router();
const prisma = require("../../db").getInstance();
const mqtt = require("../../mqtt");

// POST /:base_station_id/pump
// Add a new pump to a base station
router.post("/:base_station_id/pump", async (req, res) => {
  const { base_station_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  // fetch base station
  const baseStation = await prisma.baseStation.findFirst({
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  // fetch max pump number
  const latestPump = await prisma.waterPump.findFirst({
    select: {
      pumpNo: true,
    },
    where: {
      baseStationId: baseStation.id,
    },
    orderBy: {
      pumpNo: "desc",
    },
  });
  let pumpNo = 1;
  if (latestPump) {
    pumpNo = latestPump.pumpNo + 1;
  }
  // create
  const pump = await prisma.waterPump.create({
    select: {
      id: true,
      pumpNo: true,
      predictedWaterVolume: true,
    },
    data: {
      pumpNo,
      baseStation: {
        connect: {
          id: baseStation.id,
        },
      },
      predictedWaterVolume: 0,
    },
  });
  return res.status(201).json(pump);
});

// GET /:base_station_id/pump
// Get all pumps for a base station
router.get("/:base_station_id/pump", async (req, res) => {
  const { base_station_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pumps = await prisma.waterPump.findMany({
    select: {
      id: true,
      pumpNo: true,
      predictedWaterVolume: true,
      running: true,
    },
    where: {
      baseStationId: baseStation.id,
    },
  });
  return res.status(200).json(pumps);
});

// GET /:id/pump/:pump_id
// Get a pump by id
router.get("/:base_station_id/pump/:pump_id", async (req, res) => {
  const { base_station_id, pump_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  if (!pump_id) {
    return res.status(400).json({
      error: "Pump ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pump = await prisma.waterPump.findUnique({
    select: {
      id: true,
      pumpNo: true,
      predictedWaterVolume: true,
      running: true,
    },
    where: {
      id: parseInt(pump_id),
      baseStationId: parseInt(base_station_id),
    },
  });
  if (!pump) {
    return res.status(404).json({
      error: "Pump not found",
    });
  }
  return res.status(200).json(pump);
});

// GET /:id/pump/:pump_id/logs
// Get logs for a pump
router.get("/:base_station_id/pump/:pump_id/logs", async (req, res) => {
  const { base_station_id, pump_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  if (!pump_id) {
    return res.status(400).json({
      error: "Pump ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pump = await prisma.waterPump.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(pump_id),
      baseStationId: parseInt(base_station_id),
    },
  });
  if (!pump) {
    return res.status(404).json({
      error: "Pump not found",
    });
  }
  const logs = await prisma.waterPumpLog.findMany({
    select: {
      id: true,
      volume: true,
      timestamp: true,
    },
    where: {
      waterPumpId: pump.id,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return res.status(200).json(logs);
});

// GET /:id/pump/:pump_id/water_volume
// Get water volume for a pump today
router.get("/:base_station_id/pump/:pump_id/water_volume", async (req, res) => {
  const { base_station_id, pump_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  if (!pump_id) {
    return res.status(400).json({
      error: "Pump ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pump = await prisma.waterPump.findFirst({
    select: {
      id: true,
    },
    where: {
      id: parseInt(pump_id),
      baseStationId: parseInt(base_station_id),
    },
  });
  if (!pump) {
    return res.status(404).json({
      error: "Pump not found",
    });
  }
  const logs = await prisma.waterPumpLog.findMany({
    select: {
      volume: true,
    },
    where: {
      waterPumpId: pump.id,
      timestamp: {
        gte: new Date().setHours(0, 0, 0, 0),
      },
    },
  });
  const volume = logs.reduce((acc, curr) => acc + curr.volume, 0);
  return res.status(200).json({
    volume,
  });
});


// POST /:id/pump/:pump_id/start
// Start a pump
router.post("/:base_station_id/pump/:pump_id/start", async (req, res) => {
  const { base_station_id, pump_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  if (!pump_id) {
    return res.status(400).json({
      error: "Pump ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
      hardwareId: true,
    },
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pump = await prisma.waterPump.findFirst({
    select: {
      pumpNo: true,
    },
    where: {
      id: parseInt(pump_id),
      baseStationId: parseInt(base_station_id),
    },
  });
  // update pump status
  await prisma.waterPump.update({
    where: {
      id: parseInt(pump_id),
    },
    data: {
      running: true,
    },
  });
  const res2 = await mqtt.publishMessageToMQTT(
    `sub/${baseStation.hardwareId}`,
    JSON.stringify({
      action: "pump_on",
      data: {
        pump_no: pump.pumpNo,
      },
    })
  );
  if (!res2) {
    return res.status(500).json({
      error: "Failed to start pump",
    });
  }
  return res.status(200).json({
    message: "Pump started",
  });
});

// POST /:id/pump/:pump_id/stop
// Stop a pump
router.post("/:base_station_id/pump/:pump_id/stop", async (req, res) => {
  const { base_station_id, pump_id } = req.params;
  if (!base_station_id) {
    return res.status(400).json({
      error: "Base station ID is required",
    });
  }
  if (!pump_id) {
    return res.status(400).json({
      error: "Pump ID is required",
    });
  }
  const baseStation = await prisma.baseStation.findFirst({
    select: {
      id: true,
      hardwareId: true,
    },
    where: {
      id: parseInt(base_station_id),
      userId: req.user.id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  const pump = await prisma.waterPump.findFirst({
    select: {
      pumpNo: true,
    },
    where: {
      id: parseInt(pump_id),
      baseStationId: parseInt(base_station_id),
    },
  });
  // update pump status
  await prisma.waterPump.update({
    where: {
      id: parseInt(pump_id),
    },
    data: {
      running: false,
    },
  });
  const res2 = await mqtt.publishMessageToMQTT(
    `sub/${baseStation.hardwareId}`,
    JSON.stringify({
      action: "pump_off",
      data: {
        pump_no: pump.pumpNo,
      },
    })
  );
  if (!res2) {
    return res.status(500).json({
      error: "Failed to stop pump",
    });
  }
  return res.status(200).json({
    message: "Pump stopped",
  });
});

module.exports = router;
