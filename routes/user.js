import express from "express";
import jwt from "jsonwebtoken";
import session from "express-session";
import { user as users } from "../models/user.js";

//checks if the user exists in the array (not using a db)
const existing = (username) => {
  let checkUser = users.filter((user) => {
    return user.username === username;
  });
};

//authenticate the user
const authenticateUser = (username, password) => {
  let valid = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (valid.length > 0) {
    return true;
  } else {
    return false;
  }
};

const router = express.Router();

//get users
router.get("/users", (req, res) => {
  let all = [];
  users.map((username) => all.push(username.username));
  res.send(all);
});

//register a user
router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (password && username) {
    if (!existing(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "User successfully registered! Login available for user.",
      });
    } else {
      return res.status(404).json({ message: "User already exists..." });
    }
  }
  return res.status(404).json({ message: "Unable to register the user" });
});

//login a user
router.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticateUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

export { router as login };
