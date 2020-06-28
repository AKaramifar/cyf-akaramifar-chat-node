// Import Library . . .
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Main URL: https://cyf-akaramifar-chat-node.herokuapp.com/
app.get('/',(req, res) => {
    res.json({
        App: "Chat Node js",
        Student_FullName: "Afshin Karamifar",
        Position: "Trainee at Code Your Future",
        Company: "Code Your Future",
        URL: "https://codeyourfuture.io/"
    })
})