"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GIF_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GIF_Category.hasMany(models.GIF_URLS, {
        foreignKey: {
          field: "categoryId",
          onDelete: "cascade",
        },
      });
      models.GIF_URLS.belongsTo(GIF_Category, {
        foreignKey: {
          field: "categoryId",
          allowNull: false,
          onDelete: "cascade",
        },
      });
    }
  }
  GIF_Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GIF_Category",
      timestamps: false,
    }
  );
  return GIF_Category;
};
