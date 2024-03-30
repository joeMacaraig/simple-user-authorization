import express from "express";
import { fiends } from "../models/user.js";

let friends = fiends;

const router = express.Router();

router.get("/", (req, res) => {
  res.send(friends);
});

router.get("/:email", (req, res) => {
  const email = req.params.email;
  friends.filter((friend) => {
    if (friend.email === email) {
      res.send(friend);
    }
  });
});

router.post("/addFriend", (req, res) => {
  const email = req.body.email;
  if (email) {
    friends.push({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      DOB: req.body.DOB,
      email: email,
    });
  }
  res.send(`Successfully added ${email} as a new friend ✅`);
});

//update user
router.put("/:email", (req, res) => {
  const email = req.params.email;
  const { firstName, lastName, DOB } = req.body;

  // Assuming user data is stored in an array or database
  friends.filter((friend) => {
    if (email === friend.email) {
      if (firstName !== undefined) {
        friend.firstName = firstName;
      }
      if (lastName !== undefined) {
        friend.lastName = lastName;
      }
      if (DOB !== undefined) {
        friend.DOB = DOB;
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", friends });
    }
  });
});

router.delete("/:email", (req, res) => {
  const email = req.params.email;
  friends = friends.filter((friend) => friend.email !== email);
  res.send(`Successfully deleted ${email} ✅`);
});

export { router as friendRoutes };
