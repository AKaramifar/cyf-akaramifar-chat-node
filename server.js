// Import Library . . .
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
// Read Json File Function . . .
const readJsonFile = jsonFileURL => {
  return fs.readFileSync(jsonFileURL, "utf8", err => {
    console.log("Read File Error: ", err);
  });
};
// Write Json File Function . . .
const writeJsonFile = (jsonFileURL, newJsonFile) => {
  fs.writeFileSync(jsonFileURL, JSON.stringify(newJsonFile), "utf8", err => {
    console.log("Write File Error: ", err);
  });
};
//---------------------- GET ----------------------
// Main URL: https://cyf-akaramifar-chat-node.herokuapp.com/
app.get("/", (req, res) => {
  res.json({
    App: "Chat Node js",
    Student_FullName: "Afshin Karamifar",
    Email: "a.karamifar@gmail.com",
    Position: "Trainee at Code Your Future",
    Company: "Code Your Future",
    URL: "https://codeyourfuture.io/"
  });
});
// Contacts . . .
app.get("/contacts", (req, res) => {
  let allContacts = JSON.parse(readJsonFile("./contacts.json"));
  res.json(allContacts);
});
// Messages . . .
app.get("/messages", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  res.json(allMessages);
});
//---------------------- POST ----------------------
// Post New Contact . . .
app.post("/newcontact", (req, res) => {
  let newContacts = JSON.parse(readJsonFile("./contacts.json"));
  newContacts.push(req.body);
  writeJsonFile("./contacts.json", newContacts);
  res.send("New Contact Added Successfuly!!!");
});
// Post New Message . . .
app.post("/newmessage", (req, res) => {
  let newMessages = JSON.parse(readJsonFile("./messages.json"));
  newMessages.push(req.body);
  writeJsonFile("./messages.json", newMessages);
  res.send("New Message Added Successfuly!!!");
});
// //---------------------- UPDATE ----------------------
// Update Contact . . .
app.post("/updatecontact", (req, res) => {
  let allContacts = JSON.parse(readJsonFile("./contacts.json"));
  let updatedContact = allContacts.map(contact =>
    contact.contactId === req.body.contactId ? (contact = req.body) : contact
  );
  writeJsonFile("./contacts.json", updatedContact);
  res.send("Contact updated Successfuly!!!");
});
// Update Message . . .
app.post("/updatemessage", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  let updatedMessages = allMessages.map(message =>
    message.messageId === req.body.messageId ? (message = req.body) : message
  );
  writeJsonFile("./messages.json", updatedMessages);
  res.send("Message Updated Successfuly!!!");
});
//---------------------- DELETE ----------------------
// Delete Contact . . .
app.delete("/deletecontact/:contactid", (req, res) => {
  let allContacts = JSON.parse(readJsonFile("./contacts.json"));
  let updatedContact = allContacts.filter(
    contact => contact.contactId !== req.params.contactid
  );
  writeJsonFile("./contacts.json", updatedContact);
  res.send("Contact Deleted Successfuly!!!");
});
// Delete Message . . .
app.delete("/deletemessage/:messageid", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  let updatedMessages = allMessages.filter(
    message => message.messageId !== req.params.messageid
  );
  writeJsonFile("./messages.json", updatedMessages);
  res.send("Message Deleted Successfuly!!!");
});
//Listen to port 3000 or any available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
