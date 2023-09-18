const router = require("express").Router();
const prisma = require("../db").getInstance();

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

module.exports = router;
