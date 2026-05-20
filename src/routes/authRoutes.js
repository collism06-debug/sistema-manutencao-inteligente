const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/database.sqlite");
const router = express.Router();
const bcrypt = require("bcrypt");
router.get("/login", (req, res) => {
    res.render("pages/login");
});

router.get("/register", (req, res) => {
    res.render("pages/register");
});
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {

            if (err || !user) {
                return res.send("Email ou senha inválidos");
            }

            bcrypt.compare(password, user.password, (err, result) => {

                if (!result) {
                    return res.send("Email ou senha inválidos");
                }

                req.session.user = {
                    email
                };

                return res.redirect("/orders");

            });

        }
    );

});
router.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        res.redirect("/login");

    });

});

module.exports = router;