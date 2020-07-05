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
// Code Generator
const newCode = () => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let generateNewCode = Math.floor(Math.random() * 90000) + 1000;
  let checkUser = allUsers.find(
    user => user.userSecurityCode === generateNewCode
  );
  if (checkUser) {
    newCode();
  } else {
    return generateNewCode;
  }
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
// All user
app.get("/allusers", (req, res) => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
 res.json(allUsers);
})
// Users . . .
app.post("/users", (req, res) => {
  let { userid, username, userpassword, usersecuritycode } = req.query;
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let Founduser = allUsers.find(
    user =>
      user.userId === userid &&
      user.userName === username &&
      user.userPassword === userpassword &&
      user.userSecurityCode === usersecuritycode
  );
  if (Founduser) {
    let sendUsers = [];
    allUsers.forEach((user, index) => {
      sendUsers[index] = {
        userId: user.userId,
        userName: user.userName,
        lastOnlineTime: user.lastOnlineTime,
        online: user.online
      };
    });
    res.json(sendUsers);
  } else {
    res.json("Security Error!!!");
  }
});
// SignOut . . .
app.post("/signout", (req, res) => {
  let {
    userid,
    username,
    userpassword,
    usersecuritycode,
    lastonlinetime
  } = req.query;
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let Founduser = allUsers.find(
    user =>
      user.userId === userid &&
      user.userName === username &&
      user.userPassword === userpassword &&
      user.userSecurityCode === usersecuritycode
  );
  if (Founduser) {
    Founduser.online = "false";
    Founduser.lastOnlineTime = lastonlinetime;
    let updateSignedOutUser = allUsers.map(user =>
      user.userId === Founduser.userId ? (user = Founduser) : user
    );
    writeJsonFile("./users.json", updateSignedOutUser);
    res.json("Success!");
  } else {
    res.json("Security Error!!!");
  }
});
// Messages . . .
app.get("/messages", (req, res) => {
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  res.json(allMessages);
});
//---------------------- POST ----------------------
// SignIn Users . . .
app.post("/signin", (req, res) => {
  let { username, password, lastonlinetime } = req.query;
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let FounduserName = allUsers.find(user => user.userName === username);
  let userNameAndPassword = allUsers.find(
    user => user.userName === username && user.userPassword === password
  );
  if (userNameAndPassword) {
    userNameAndPassword.lastOnlineTime = lastonlinetime;
    userNameAndPassword.userSecurityCode = newCode().toString();
    userNameAndPassword.online = "true";
    let updateSignedInUser = allUsers.map(user =>
      user.userId === userNameAndPassword.userId
        ? (user = userNameAndPassword)
        : user
    );
    writeJsonFile("./users.json", updateSignedInUser);
    res.json({
      status: "Success",
      userId: userNameAndPassword.userId,
      userName: userNameAndPassword.userName,
      userPassword: userNameAndPassword.userPassword,
      userSecurityCode: userNameAndPassword.userSecurityCode
    });
  } else if (FounduserName) {
    res.json("Password is not Correct!!!");
  } else {
    res.json("This User is not in DataBase!!!");
  }
});
// Post New User . . .
app.post("/newuser", (req, res) => {
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let newUser = req.body;
  let checkUser = allUsers.find(user => user.userName === newUser.userName);
  if (checkUser) {
    res.json("Sorry, This Username already taken!!!");
  } else {
    newUser.userId = (
      parseInt(allUsers[allUsers.length - 1].userId) + 1
    ).toString();
    newUser.userSecurityCode = newCode().toString();
    newUser.online = "true";
    allUsers.push(newUser);
    writeJsonFile("./users.json", allUsers);
    res.json({
      status: "Success",
      userId: newUser.userId,
      userName: newUser.userName,
      userPassword: newUser.userPassword,
      userSecurityCode: newUser.userSecurityCode
    });
  }
});
// // Post New Message . . .
// app.post("/newmessage", (req, res) => {
//   let allMessages = JSON.parse(readJsonFile("./messages.json"));
//   allMessages.push(req.body);
//   writeJsonFile("./messages.json", allMessages);
//   res.send("New Message Added Successfuly!!!");
// });
// //---------------------- UPDATE ----------------------
// // Update Contact . . .
// app.post("/updateuser", (req, res) => {
//   let allUsers = JSON.parse(readJsonFile("./users.json"));
//   let updatedusers = allUsers.map(user =>
//     user.contactId === req.body.contactId ? (user = req.body) : user
//   );
//   writeJsonFile("./users.json", updatedusers);
//   res.send("users updated Successfuly!!!");
// });
// // Update Message . . .
// app.post("/updatemessage", (req, res) => {
//   let allMessages = JSON.parse(readJsonFile("./messages.json"));
//   let updatedMessages = allMessages.map(message =>
//     message.messageId === req.body.messageId ? (message = req.body) : message
//   );
//   writeJsonFile("./messages.json", updatedMessages);
//   res.send("Message Updated Successfuly!!!");
// });
//---------------------- DELETE ----------------------
// // Delete Contact . . .
// app.delete("/deleteuser/:userid", (req, res) => {
//   let allUser = JSON.parse(readJsonFile("./contacts.json"));
//   let updatedContact = allUser.filter(
//     contact => contact.contactId !== req.params.contactid
//   );
//   writeJsonFile("./contacts.json", updatedContact);
//   res.send("Users Deleted Successfuly!!!");
// });
// // Delete Message . . .
// app.delete("/deletemessage/:messageid", (req, res) => {
//   let allMessages = JSON.parse(readJsonFile("./messages.json"));
//   let updatedMessages = allMessages.filter(
//     message => message.messageId !== req.params.messageid
//   );
//   writeJsonFile("./messages.json", updatedMessages);
//   res.send("Message Deleted Successfuly!!!");
// });
//Listen to port 3000 or any available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
