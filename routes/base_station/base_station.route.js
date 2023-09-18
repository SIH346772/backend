const router = require("express").Router();
const prisma = require("../../db").getInstance();

// POST /
// Add a new base station
router.post("/", async (req, res) => {
    const { hardwareId, lat, lng } = req.body;
    if (!hardwareId || !lat || !lng) {
        return res.status(400).json({
            error: "Hardware ID, latitude and longitude are required",
        });
    }
    const baseStation = await prisma.baseStation.create({
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
            user: {
                connect: {
                    id: req.user.id,
                }
            }
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
            hardwareId: true,
            lat: true,
            lng: true
        },
        where: {
            userId: req.user.id
        }
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
            hardwareId: true,
            lat: true,
            lng: true
        },
        where: {
            id: parseInt(id),
            userId: req.user.id
        },
    });
    if (!baseStation) {
        return res.status(404).json({
            error: "Base station not found",
        });
    }
    return res.status(200).json(baseStation);
});

// GET /:id/latest_data
// TODO: Get the latest data of each thing from a base station



module.exports = router