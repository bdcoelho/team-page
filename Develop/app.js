const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const writeFileAsync = util.promisify(fs.writeFile);

let answers = {};
let employeeArray = [];
answers.addEmployee = "Yes";
let employeeIndex = 0;

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// function to prompt the user with a series of questions to gather data for the file being created
function promptUser(answers) {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Please enter the team manager's name:",
      when: function () {
        return employeeIndex === 0;
      },
    },

    {
      type: "input",
      name: "name",
      message: "Please enter your name:",
      when: function (answers) {
        return employeeIndex !== 0;
      },
    },
    {
      type: "input",
      name: "id",
      message: "Please enter the ID of this employee:",
    },
    {
      type: "input",
      name: "email",
      message: "What is this employee's email address?",
    },
    {
      type: "list",
      name: "role",
      message: "Please select your role:",
      choices: ["Engineer", "Intern"],
      when: function () {
        return employeeIndex !== 0;
      },
    },
    {
      type: "input",
      name: "github",
      message: "Please enter your Github user name:",
      when: function (answers) {
        return answers.role === "Engineer";
      },
    },
    {
      type: "input",
      name: "school",
      message: "Please enter the name of the school where you obtained your most relevant qualification:",
      when: function (answers) {
        return answers.role === "Intern";
      },
    },
    {
      type: "input",
      name: "officeNumber",
      message: "Please enter your office number:",
      when: function () {
        return employeeIndex === 0;
      },
    },
    {
      type: "list",
      name: "addEmployee",
      message: "Would you like to add another employee?",
      choices: ["Yes", "No"],
    },
  ]);
}

function createEmployee(data) {
  switch (data.role) {
    case "Engineer":
      return new Engineer(data.name, data.id, data.email, data.github);
    case "Intern":
      return new Intern(data.name, data.id, data.email, data.school);
    case "Manager":
      return new Manager(data.name, data.id, data.email, data.officeNumber);
    default:
      return "Invalid case";
  }
}

async function init() {
  while (answers.addEmployee === "Yes") {
    try {
      // init function pauses whilst gathering user data through the promptUser function and stores the data in "answers"
      answers = await promptUser(answers);
      if (employeeIndex === 0){
        answers.role="Manager";
      };
      employeeIndex += 1;
      // logic to create object for different type of employee
      employeeArray.push(createEmployee(answers));

      console.log(employeeIndex);
      // notifies the user if successful
      console.log("Successful");
    } catch (err) {
      // notifies the user if there was an error
      console.log(err);
    }
  }
  await writeFileAsync(outputPath, render(employeeArray));
}

init();
