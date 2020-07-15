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
// SignIn Users . . .
app.post("/signin", (req, res) => {
  let { username, password, lastonlinetime } = req.query;
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  let FounduserName = allUsers.find(user => user.userName === username);
  let userNameAndPassword = allUsers.find(
    user =>
      user.userName === username &&
      JSON.stringify(user.userPassword) === `"` + password + `"`
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
// Messages . . .
app.post("/data", (req, res) => {
  // Message Part
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  let userRequest = req.body;
  // console.log(userRequest.currentUserToChat);
  // console.log(userRequest.currentUserId);
  allMessages.forEach((message) =>{
    if( message.receiverUserId === userRequest.currentUserId &&
      message.senderUserId === userRequest.currentUserToChat){
       message.read = true;
    }
  });
  writeJsonFile("./messages.json", allMessages);
  let allUsers = JSON.parse(readJsonFile("./users.json"));
  allMessages = JSON.parse(readJsonFile("./messages.json"));
  let userAuthentication = allUsers.find(
    user =>
      user.userName === userRequest.currentUserName &&
      JSON.stringify(user.userPassword) ===
        `"` + userRequest.currentUserPassword + `"` &&
      user.userSecurityCode === userRequest.currentUserSecurityCode
  );
  // Users Message Part
  if (userAuthentication) {
    let myMessages = allMessages.filter(
      message =>
        message.senderUserId.indexOf(userRequest.currentUserId) > -1 ||
        message.receiverUserId.indexOf(userRequest.currentUserId) > -1
    );
    let sendUsers = [];
    allUsers.forEach((user, index) => {
      sendUsers[index] = {
        userId: user.userId,
        userName: user.userName,
        lastOnlineTime: user.lastOnlineTime,
        online: user.online
      };
    });
    let userData = [[...sendUsers], [...myMessages]];
    res.json(userData);
  }
});
// Post New Message
app.post("/newmessage", (req, res) => {
  let newMessage = req.body;
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  let usersId = [];
  if (Array.isArray(newMessage.receiverUserId)) {
    usersId = [newMessage.senderUserId, ...newMessage.receiverUserId];
  } else {
    usersId = [newMessage.senderUserId, newMessage.receiverUserId];
  }
  let messagesBetweenUsers = [];
  if (allMessages.length > 0) {
    if (newMessage.groupId === "null") {
      messagesBetweenUsers = allMessages.filter(
        message =>
          usersId.indexOf(message.senderUserId) > -1 &&
          usersId.indexOf(message.receiverUserId) > -1
      );
    }
  }
  newMessage.messageId =
    allMessages.length > 0
      ? parseInt(allMessages[allMessages.length - 1].messageId) + 1
      : 1;
  newMessage.messageRowId =
    messagesBetweenUsers.length > 0
      ? parseInt(
          messagesBetweenUsers[messagesBetweenUsers.length - 1].messageRowId
        ) + 1
      : 1;
  newMessage.read = false;
  allMessages.push(newMessage);
  writeJsonFile("./messages.json", allMessages);
  res.json("Successfull");
});
// Edit Message
app.post("/editmessage", (req, res) => {
  let editMessage = req.body;
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  allMessages.forEach((message) => {
    if(message.messageId === editMessage.messageId){
      message.message = editMessage.message
    }
  })
  writeJsonFile("./messages.json", allMessages);
  res.json("Success");
});
// Delete Message
app.post("/deletemessage", (req, res) => {
  let deleteMessage = req.body;
  let allMessages = JSON.parse(readJsonFile("./messages.json"));
  allMessages = allMessages.filter(message => message.messageId !== deleteMessage.messageId);
  writeJsonFile("./messages.json", allMessages);
  res.json("Success");
});
//Listen to port 3000 or any available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});