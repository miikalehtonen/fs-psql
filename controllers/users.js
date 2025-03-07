const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ["userId"] } },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.username = req.body.username;
  await user.save();
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const where = {};
  if (req.query.read) where.read = req.query.read;

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: { attributes: ["read", "id"], where },
      },
    ],
  });
  if (!user) res.status(404).end();

  res.json(user);
});

module.exports = router;
