const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { uuid } = require("uuidv4");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Role {
    constructor(id, title, salary, department_id) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
}

class Employee {
    constructor(id, first_name, last_name, role_id, manager_id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
}
