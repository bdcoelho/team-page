const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let answers = {};
let employeeArray = [];
answers.addEmployee = "Yes";

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// function to prompt the user with a series of questions to gather data for the file being created
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
    },
    {
      type: "input",
      name: "id",
      message: "What is your id?",
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
    },
    {
      type: "list",
      name: "role",
      message: "What is your current role?",
      choices: ["Engineer", "Manager", "Intern"],
    },
    {
      type: "input",
      name: "github",
      message: "What is your Github username?",
      when: function (answers) {
        return answers.role === "Engineer";
      },
    },
    {
      type: "input",
      name: "school",
      message: "What school did you attend?",
      when: function (answers) {
        return answers.role === "Intern";
      },
    },
    {
      type: "input",
      name: "officeNumber",
      message: "What is your office number?",
      when: function (answers) {
        return answers.role === "Manager";
      },
    },
    {
      type: "list",
      name: "addEmployee",
      message: "Add another employee?",
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
      answers = await promptUser();
      // logic to create object for different type of employee
      employeeArray.push(createEmployee(answers));
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

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to testtest out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
