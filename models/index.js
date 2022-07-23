const Department = require("./Department");
const Role = require("./Role");
const Employee = require("./Employee");

Department.hasMany(Role);
Role.belongsTo(Department);

Role.hasMany(Employee);
Employee.belongsTo(Role);
