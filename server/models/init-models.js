var DataTypes = require("sequelize").DataTypes;
var _alerts = require("./alerts");
var _classes = require("./classes");
var _courses = require("./courses");
var _establishments = require("./establishments");
var _qr_codes = require("./qr_codes");
var _signatures = require("./signatures");
var _users = require("./users");

function initModels(sequelize) {
  var alerts = _alerts(sequelize, DataTypes);
  var classes = _classes(sequelize, DataTypes);
  var courses = _courses(sequelize, DataTypes);
  var establishments = _establishments(sequelize, DataTypes);
  var qr_codes = _qr_codes(sequelize, DataTypes);
  var signatures = _signatures(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  courses.belongsTo(classes, { as: "class", foreignKey: "classId"});
  classes.hasMany(courses, { as: "courses", foreignKey: "classId"});
  users.belongsTo(classes, { as: "class", foreignKey: "classId"});
  classes.hasMany(users, { as: "users", foreignKey: "classId"});
  qr_codes.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(qr_codes, { as: "qr_codes", foreignKey: "courseId"});
  signatures.belongsTo(courses, { as: "course", foreignKey: "courseId"});
  courses.hasMany(signatures, { as: "signatures", foreignKey: "courseId"});
  classes.belongsTo(establishments, { as: "establishment", foreignKey: "establishmentId"});
  establishments.hasMany(classes, { as: "classes", foreignKey: "establishmentId"});
  users.belongsTo(establishments, { as: "establishment", foreignKey: "establishmentId"});
  establishments.hasMany(users, { as: "users", foreignKey: "establishmentId"});
  alerts.belongsTo(users, { as: "createdBy_user", foreignKey: "createdBy"});
  users.hasMany(alerts, { as: "alerts", foreignKey: "createdBy"});
  courses.belongsTo(users, { as: "professor", foreignKey: "professorId"});
  users.hasMany(courses, { as: "courses", foreignKey: "professorId"});
  signatures.belongsTo(users, { as: "student", foreignKey: "studentId"});
  users.hasMany(signatures, { as: "signatures", foreignKey: "studentId"});

  return {
    alerts,
    classes,
    courses,
    establishments,
    qr_codes,
    signatures,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
