import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";
import db from "../db/db.js";

const router = express.Router();
env.config({ path: "./.env" });
const SALT = process.env.saltRound;
const SaltRound = parseInt(SALT);

router.get("/main", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("./main.ejs");
  } else {
    res.redirect("/login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
  })
);

router.post("/signIn", async (req, res) => {
  const username = req.body.email;
  const pass = req.body.pass;
  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(pass, SaltRound, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hash]
          );
          console.log(username + " " + hash);
          const user = result.rows[0];
          req.login(user, (err) => {
            res.redirect("/main");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  new Strategy(async function verify(email, pass, cb) {
    try {
      const result = db.query("SELECT * FROM usersAC WHERE username = $1", [
        email,
      ]);
      if ((await result).rows.length > 0) {
        const user = result.row[0];
        const storedPass = user.password;
        bcrypt.compare(pass, storedPass, (err, valid) => {
          if (err) {
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("user not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export default router;
