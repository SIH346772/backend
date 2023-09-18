const router = require("express").Router();
const prisma = require("../../db").getInstance();
const mqtt = require("../../mqtt");

// POST /external/data/soil/:base_station_hardware_id/:sensor_probe_hardware_id
// Add a new data to a sensor probe
router.post("/soil/:base_station_hardware_id/:sensor_probe_hardware_id", async (req, res) => {
  const { base_station_hardware_id, sensor_probe_hardware_id } = req.params;
  if (!base_station_hardware_id) {
    return res.status(400).json({
      error: "Hardware ID is required",
    });
  }
  if (!sensor_probe_hardware_id) {
    return res.status(400).json({
      error: "Sensor probe ID is required",
    });
  }
  // fetch sensor probe
  const sensorProbe = await prisma.sensorProbe.findFirst({
    where: {
      hardwareId: sensor_probe_hardware_id,
      baseStation: {
        hardwareId: base_station_hardware_id,
      },
    },
  });
  if (!sensorProbe) {
    return res.status(404).json({
      error: "Sensor probe not found",
    });
  }
  const { temperature, bottomLayerMoisture, topLayerMoisture, timestamp } = req.body;

  // timestamp unix to date
  const timestampDate = new Date(timestamp * 1000);

  // create data
  const data = await prisma.soilData.create({
    data: {
      topLayerMoisture: topLayerMoisture,
      bottomLayerMoisture: bottomLayerMoisture,
      temperature: temperature,
      timestamp: timestampDate,
      sensorProbe: {
        connect: {
          id: sensorProbe.id,
        },
      },
    },
  });
  return res.status(201).json({
    message: "Data logged",
  });
});

// POST /external/data/base_station/:base_station_hardware_id
router.post("/base_station/:base_station_hardware_id", async (req, res) => {
  // [pump_1, pump_2, temperature, hummidity, timestamp]
  const { base_station_hardware_id } = req.params;
  if (!base_station_hardware_id) {
    return res.status(400).json({
      error: "Hardware ID is required",
    });
  }
  // fetch base station
  const baseStation = await prisma.baseStation.findFirst({
    where: {
      hardwareId: base_station_hardware_id,
    },
  });
  if (!baseStation) {
    return res.status(404).json({
      error: "Base station not found",
    });
  }
  /**
   * pump_details: map of pump_no and released water amount
   */
  const { pump_details, temperature, humidity, timestamp } = req.body;
  if (!pump_details || !temperature || !humidity || !timestamp) {
    return res.status(400).json({
      error: "Pump details, temperature, humidity, and timestamp are required",
    });
  }
  // timestamp unix to date
  const timestampDate = new Date(timestamp * 1000);
  // add local temperature and humidity
  await prisma.localWeatherData.create({
    data: {
      temperature: temperature,
      humidity: humidity,
      timestamp: timestampDate,
      baseStation: {
        connect: {
          id: baseStation.id,
        },
      },
    },
  });
  // go through pump details and add in pump logs
  for (const pump_no in pump_details) {
    let pump_no_int = parseInt(pump_no);
    let released_water_amount = pump_details[pump_no];
    // fetch pump record
    const pump = await prisma.waterPump.findFirst({
      where: {
        baseStationId: baseStation.id,
        pumpNo: pump_no_int,
      },
    });
    if (!pump) {
      console.log(`Pump ${pump_no_int} not found`);
      continue;
    }
    // add in pump log
    await prisma.waterPumpLog.create({
      data: {
        waterPump: {
          connect: {
            id: pump.id,
          },
        },
        volume: released_water_amount,
        timestamp: timestampDate,
      },
    });
    // deduct water amount from predictedWaterVolume and update
    const updatedPump = await prisma.waterPump.update({
      where: {
        id: pump.id,
      },
      data: {
        predictedWaterVolume: {
          decrement: released_water_amount,
        },
      },
      select: {
        id: pump.id,
        predictedWaterVolume: true,
      },
    });
    // trigger to check predictedWaterVolume <=0 and stop pump
    if (updatedPump.predictedWaterVolume <= 0) {
      // stop pump
      await mqtt.publishMessageToMQTT(
        `sub/${base_station_hardware_id}`,
        JSON.stringify({
          action: "pump_off",
          data: {
            pump_no: pump_no_int,
          },
        })
      );
      console.log(`Pump ${pump_no_int} stopped !`);
    }
  }
  return res.status(201).json({
    message: "Data logged",
  });
});

module.exports = router;
