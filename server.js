// Import Library . . .
const express = require('express');
let contacts = require('./contacts.json');
const app = express();
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { json } = require('body-parser');

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
// Post New Contact . . .
app.post('/newcontact', (req, res) => {
    const newContact = req.body;
    fs.writeFile(contacts, json.stringify(newContact));
    res.json(contacts);
})

//Listen to port 3000 or any available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})