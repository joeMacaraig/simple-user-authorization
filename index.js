import express from "express";
import jwt from "jsonwebtoken";
import session from "express-session";

//routing
import { login } from "./routes/user.js";
import { friendRoutes } from "./routes/friends.js";

const app = express();
const PORT = 9000;

app.use(express.json());

//middleware
app.use(
    session({ secret: "fingerprint", resave: true, saveUninitialized: true })
  );

//access friends if logged in
app.use("/friends", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated ❌" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in ❌" });
  }
});

//using routes
app.use(login);
app.use("/friends", friendRoutes);

app.listen(PORT, () => console.log(`Listening on port: ${PORT} 🚀`));
