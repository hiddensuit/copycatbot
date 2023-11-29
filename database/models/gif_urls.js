"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GIF_URLS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GIF_URLS.belongsTo(models.User, {
        foreignKey: {
          field: "userId",
          allowNull: false,
          onDelete: "cascade",
        },
      });
      models.User.hasMany(GIF_URLS, {
        foreignKey: {
          field: "userId",
          allowNull: false,
          onDelete: "cascade",
        },
      });
    }
  }
  GIF_URLS.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "GIF_URLS",
      timestamps: false,
    }
  );
  return GIF_URLS;
};
