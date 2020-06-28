// Import Library . . .
const express = require("express");
let contacts = require("./contacts.json");
let messages = require("./messages.json");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { connect } = require("http2");

app.use(cors());
app.use(bodyParser.json());
//---------------------- GET ----------------------
// Main URL: https://cyf-akaramifar-chat-node.herokuapp.com/
app.get("/", (req, res) => {
  res.json({
    App: "Chat Node js",
    Student_FullName: "Afshin Karamifar",
    Position: "Trainee at Code Your Future",
    Company: "Code Your Future",
    URL: "https://codeyourfuture.io/",
  });
});
// Contacts . . .
app.get("/contacts", (req, res) => {
  res.json(contacts);
});
// Messages . . .
app.get("/messages", (req, res) => {
  res.json(messages);
});
//---------------------- POST ----------------------
// Post New Contact . . .
app.post("/newcontact", (req, res) => {
  const newContact = [...contacts, req.body];
  fs.writeFile("./contacts.json", JSON.stringify(newContact), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.send("New Contact Added Successfuly!!!");
});
// Post New Message . . .
app.post("/newmessage", (req, res) => {
  const newMessage = [...messages, req.body];
  fs.writeFile("./messages.json", JSON.stringify(newMessage), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.send("New Message Adde Successfuly!!!");
});
//---------------------- UPDATE ----------------------
// Update Contact . . .
app.put("/updatecontact", (req, res) => {
  const updatedContact = contacts.map((contact) =>
    contact.id === req.body.id ? (contact = req.body) : contact
  );
  fs.writeFile("./contacts.json", JSON.stringify(updatedContact), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.json(contacts);
  res.send("Contact updated Successfuly!!!");
});
// Update Message . . .
app.post("/updatemessage", (req, res) => {
  const updatedMessage = [...messages, req.body];
  fs.writeFile("./messages.json", JSON.stringify(newMessage), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.send("New Message Adde Successfuly!!!");
});
//---------------------- DELETE ----------------------
// Delete Contact . . .
app.post("/newcontact", (req, res) => {
  const newContact = [...contacts, req.body];
  fs.writeFile("./contacts.json", JSON.stringify(newContact), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.send("New Contact Added Successfuly!!!");
});
// Delete Message . . .
app.post("/newmessage", (req, res) => {
  const newMessage = [...messages, req.body];
  fs.writeFile("./messages.json", JSON.stringify(newMessage), "utf8", (ERR) =>
    console.log(ERR)
  );
  res.send("New Message Adde Successfuly!!!");
});
//Listen to port 3000 or any available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
