require('dotenv').config();
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { require: true, rejectUnauthorized: false }
  }
});

class Blog extends Model {}

Blog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  author: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
});

(async () => {
  try {
    await sequelize.authenticate();
    await Blog.sync();
    console.log('Database connected and synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
