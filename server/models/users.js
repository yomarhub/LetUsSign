const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "users_email_key"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'PROFESSOR', 'STUDENT'),
      allowNull: false,
      defaultValue: "STUDENT"
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establishments',
        key: 'id'
      }
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "users_email_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_establishmentId_fkey",
        using: "BTREE",
        fields: [
          { name: "establishmentId" },
        ]
      },
      {
        name: "users_classId_fkey",
        using: "BTREE",
        fields: [
          { name: "classId" },
        ]
      },
      {
        name: "idx_users_email",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "idx_users_role",
        using: "BTREE",
        fields: [
          { name: "role" },
        ]
      },
    ]
  });
};
