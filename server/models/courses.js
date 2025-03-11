const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('courses', {
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
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: "SCHEDULED"
    }
  }, {
    sequelize,
    tableName: 'courses',
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
        name: "courses_classId_fkey",
        using: "BTREE",
        fields: [
          { name: "classId" },
        ]
      },
      {
        name: "idx_courses_date",
        using: "BTREE",
        fields: [
          { name: "date" },
        ]
      },
      {
        name: "idx_courses_professor",
        using: "BTREE",
        fields: [
          { name: "professorId" },
        ]
      },
    ]
  });
};
