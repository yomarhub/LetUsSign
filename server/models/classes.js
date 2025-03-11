const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('classes', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establishments',
        key: 'id'
      },
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'classes',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "classes_establishmentId_fkey",
        using: "BTREE",
        fields: [
          { name: "establishmentId" },
        ]
      },
    ]
  });
};
