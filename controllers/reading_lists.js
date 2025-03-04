const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");
const { verifySession, tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.body.blogId);
    if (!blog) return res.status(404).end();

    const user = await User.findByPk(req.body.userId);
    if (!user) return res.status(404).end();

    const readingList = await ReadingList.create({
      ...req.body,
      blogId: blog.id,
      userId: user.id,
    });

    res.json(readingList);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put("/:id", tokenExtractor, verifySession, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user) return res.status(401).end();

  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) return res.status(404).end();

  if (user.id !== readingList.userId) return res.status(401).end();

  readingList.read = req.body.read;
  await readingList.save();

  res.json(readingList);
});

module.exports = router;
