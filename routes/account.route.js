const router = require("express").Router();
const prisma = require("../db").getInstance();

// GET /account
router.get("/", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
    },
  });
  res.json(user);
});

module.exports = router;
