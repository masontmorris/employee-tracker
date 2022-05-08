DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
	id INT NOT NULL PRIMARY KEY,
	name VARCHAR(30)
);

CREATE TABLE role (
	id INT NOT NULL PRIMARY KEY,
	title VARCHAR(30),
	salary DECIMAL,
	department_id INT REFERENCES department(id)
);

CREATE TABLE employee (
	id INT NOT NULL PRIMARY KEY,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	role_id INT REFERENCES role(id),
	manager_id INT REFERENCES employee(id)
)