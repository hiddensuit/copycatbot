"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Guild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Guild.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      gifLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          max: 100,
        },
      },
    },
    {
      sequelize,
      modelName: "Guild",
      timestamps: false,
    }
  );
  return Guild;
};
