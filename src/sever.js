import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import session from "express-session";
import test from './routes/auth.js';
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

env.config({ path: "./.env" });
const app = express();
const port = process.env.PORT;
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "keyword",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("./index.ejs");
});

app.get("/signIn", (req, res) => {
    res.render("./signIn.ejs");
});

app.get("/login", (req, res) => {
    res.render("./login.ejs");
});

app.use("/", test);

console.log(__dirname);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); 
})