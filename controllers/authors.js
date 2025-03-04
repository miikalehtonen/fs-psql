const router = require('express').Router();
const { Blog } = require('../models');
const { Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
  const sumFn = Sequelize.fn('SUM', Sequelize.col('likes'));
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('author')), 'articles'],
      [sumFn, 'likes'],
    ],
    group: ['author'],
    order: [[sumFn, 'DESC']],
  });

  res.json(authors);
});

module.exports = router;
