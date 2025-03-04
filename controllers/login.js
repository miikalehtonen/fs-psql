const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { SECRET } = require("../util/config");
const { User, Session } = require("../models");

router.post("/", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!user || req.body.password !== "secret") {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET
  );

  await Session.create({ token, userId: user.id });

  res.json({ token, username: user.username, name: user.name });
});

module.exports = router;
