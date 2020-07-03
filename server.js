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
    App: "Web Chat Messanger",
    Student_FullName: "Afshin Karamifar",
    Email: "a.karamifar@gmail.com",
    Position: "Trainee at Code Your Future",
    Company: "Code Your Future",
    URL: "https://codeyourfuture.io/"
  });
});
// Users . . .
app.get("/users", (req, res) => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  res.json(allUsers);
});
// Messages . . .
app.get("/messages", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  res.json(allMessages);
});
//---------------------- POST ----------------------
// SignIn Users . . .
app.post("/signin", (req, res) => {  
  let { username, password } = req.query;
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let FounduserName = allUsers.find(user => user.userName === username);  
  let userNameAndPassword = allUsers.find(
    user => user.userName === username && user.password === password
  );
  // console.log(userNameAndPassword)
  if (userNameAndPassword) {
    res.json("Success");
  } else if (FounduserName) {
    res.json("Password is not Correct!!!");
  } else {
    res.json("This User is not in DataBase!!!");
  }
});
// Post New Contact . . .
app.post("/newcontact", (req, res) => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  allUsers.push(req.body);
  writeJsonFile("./users.json", allUsers);
  res.send("New users Added Successfuly!!!");
});
// Post New Message . . .
app.post("/newmessage", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  allMessages.push(req.body);
  writeJsonFile("./messages.json", allMessages);
  res.send("New Message Added Successfuly!!!");
});
// //---------------------- UPDATE ----------------------
// Update Contact . . .
app.post("/updateuser", (req, res) => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let updatedusers = allUsers.map(user =>
    user.contactId === req.body.contactId ? (user = req.body) : user
  );
  writeJsonFile("./users.json", updatedusers);
  res.send("users updated Successfuly!!!");
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
app.delete("/deleteuser/:userid", (req, res) => {
  let allUser = JSON.parse(readJsonFile("./contacts.json"));
  let updatedContact = allContacts.filter(
    contact => contact.contactId !== req.params.contactid
  );
  writeJsonFile("./contacts.json", updatedContact);
  res.send("Users Deleted Successfuly!!!");
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
