const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    yearWritten: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1991,
          msg: "yearWritten must be greater than or equal to 1991",
        },
        max: {
          args: new Date().getFullYear(),
          msg: `yearWritten must be less than or equal to ${new Date().getFullYear()}`,
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  }
);

module.exports = Blog;
