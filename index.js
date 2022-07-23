const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { uuid } = require("uuidv4");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const inquirerArrays = {
    department: [
        {
            type: "input",
            name: "department_name",
            message: "What is the new department called?",
        },
        {
            type: "input",
            name: "department_id",
            message: "What is the new department's ID?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
    ],
    role: [
        {
            type: "input",
            name: "role_title",
            message: "What is the new role called?",
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the new role's ID?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
        {
            type: "input",
            name: "salary",
            message: "What is the new role's salary?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
        {
            type: "input",
            name: "department_id",
            message: "What is the new role's department ID?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
    ],
    employee: [
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "input",
            name: "employee_id",
            message: "What is the employee's ID?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the employee's role ID?",
            validate: function (value) {
                if (typeof parseInt(value) === "number" && value > 0) {
                    return true;
                } else return false;
            },
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is the employee's manager's ID? Enter 0 if no manager.",
            validate: function (value) {
                if (typeof parseInt(value) === "number") {
                    return true;
                } else return false;
            },
        },
    ],
};
class Department {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }
}

class Role {
    constructor(id, title, salary, department_id) {
        this.title = title;
        this.id = id;
        this.salary = salary;
        this.department_id = department_id;
    }
}

class Employee {
    constructor(id, first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.id = id;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

function addDepartment() {
    inquirer
        .prompt(inquirerArrays.department)
        .then((answer) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    id: answer.department_id,
                    name: answer.department_name,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Added ${answer.department_name} to the database.`);
                    mainMenu();
                }
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

function addRole() {
    inquirer
        .prompt(inquirerArrays.role)
        .then((answer) => {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    id: answer.role_id,
                    title: answer.role_title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Added ${answer.role_title} to the database.`);
                    mainMenu();
                }
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

function addEmployee() {
    inquirer
        .prompt(inquirerArrays.employee)
        .then((answer) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    id: answer.employee_id,
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`Added ${answer.first_name} ${answer.last_name} to the database.`);
                    mainMenu();
                }
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        let employeeArray = [];
        for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name + " " + res[i].last_name);
        }
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee's role would you like to update?",
                    choices: employeeArray,
                },
                {
                    type: "input",
                    name: "role",
                    message: "What is the employee's new role?",
                },
            ])
            .then((answer) => {
                let employee = answer.employee.split(" ");
                let role = answer.role;
                connection.query(`UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${role}') WHERE first_name = '${employee[0]}' AND last_name = '${employee[1]}'`, function (err, res) {
                    if (err) throw err;
                    console.log(`Updated ${employee[0]} ${employee[1]}'s role to ${role}.`);
                    mainMenu();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

function mainMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee's role", "Exit"],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee's role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

mainMenu();
