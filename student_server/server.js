const express = require("express");

const app = express();

const PORT = 3000;

// Home route
app.get("/", function(req, res) {
    res.send("<h1>Welcome to Student Server</h1>");
});

// Students route
app.get("/students", function(req, res) {

    const students = [
        {
            id: 1,
            name: "Rahul",
            branch: "CSE"
        },
        {
            id: 2,
            name: "Priya",
            branch: "CSE"
        },
        {
            id: 3,
            name: "Anjali",
            branch: "ECE"
        },
        {
            id: 4,
            name: "Kiran",
            branch: "IT"
        },
        {
            id: 5,
            name: "Suresh",
            branch: "CSE"
        }
    ];

    res.json(students);
});

// About route
app.get("/about", function(req, res) {
    res.send(`
        <h1>About Student Server</h1>
        <p>This application is created using Node.js and Express.js.</p>
        <p>It provides student information using different routes.</p>
    `);
});

// Start the server
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}`);
});