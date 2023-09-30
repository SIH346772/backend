const router = require("express").Router();
const prisma = require("../db").getInstance();
const getDiseasesData = require("../utils/diseasesData.js")

// GET /tree
router.get("/", async (req, res) => {
  const tree = await prisma.tree.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.json(tree);
});

router.get('/diseases/', (req, res) => {
  res.json(getDiseasesData());
});

module.exports = router;
