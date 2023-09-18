const router = require("express").Router();
const prisma = require("../../db").getInstance();

// POST /:id/sensor_probe
// Add a new sensor probe to a base station
router.post("/:id/sensor_probe", async (req, res) => {
    const { id } = req.params;
    const { hardwareId, lat, lng } = req.body;
    if (!id || !hardwareId || !lat || !lng) {
        return res.status(400).json({
            error: "Hardware ID, latitude and longitude are required",
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
            id: true
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
            hardwareId: true,
            lat: true,
            lng: true
        },
        data: {
            hardwareId,
            lat,
            lng,
            baseStation: {
                connect: {
                    id: baseStation.id,
                }
            }
        },
    });
    return res.status(201).json(sensorProbe);
});


// GET /:id/sensor_probe
// Get all sensor probes for a base station
router.get("/:id/sensor_probe", async (req, res) => {
    const { id } = req.params;
    if(!id) {
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
            hardwareId: true,
            lat: true,
            lng: true
        },
        where: {
            baseStationId: baseStation.id,
        },
    });
    return res.status(200).json(sensorProbes);
});

// GET /:id/sensor_probe/:id
// Get a sensor probe by id
router.get("/:id/sensor_probe/:sensorProbeId", async (req, res) => {
    const { id, sensorProbeId } = req.params;
    if(!id || !sensorProbeId) {
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
            hardwareId: true,
            lat: true,
            lng: true
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

// GET /:id/sensor_probe/:id/weather_data
// Get weather data for a sensor probe
// Query params: from, to


// GET /:id/sensor_probe/:id/soil_data
// Get soil data for a sensor probe

module.exports = router