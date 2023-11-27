"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsToMany(models.Item, { through: UserItems });
      models.Item.belongsToMany(models.User, { through: UserItems });
    }
  }
  UserItems.init(
    {
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserItems",
      timestamps: false,
    }
  );
  return UserItems;
};
