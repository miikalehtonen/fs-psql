const router = require("express").Router();
const { Blog, User } = require("../models");
const { Op } = require("sequelize");
const { verifySession, tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }

  const blogs = await Blog.findAll({
    where,
    attributes: { exclude: ["userId"] },
    include: { model: User, attributes: ["name"] },
    order: [["likes", "DESC"]],
  });

  res.json(blogs);
});

router.post("/", tokenExtractor, verifySession, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
  } catch (error) {
    res.status(400).end();
  }
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).end();

  blog.likes = req.body.likes;
  await blog.save();
  res.json(blog);
});

router.delete("/:id", tokenExtractor, verifySession, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).end();

  if (blog.userId !== req.decodedToken.id) {
    return res.status(403).end();
  }

  await blog.destroy();
  res.status(204).end();
});

module.exports = router;
