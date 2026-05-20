const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const isAuthenticated = require("../middlewares/auth");
const dbPath = path.resolve(__dirname, "../database/database.sqlite");

const db = new sqlite3.Database(dbPath);



router.get("/orders", isAuthenticated, (req, res) => {

    db.all("SELECT * FROM orders", [], (err, rows) => {

        if(err){
            console.log(err);
        }

        res.render("pages/orders", {
            orders: rows
        });

    });

});



router.post("/orders/create", (req, res) => {

    const { problem, technician, priority } = req.body;

    db.run(

        `
        INSERT INTO orders
        (problem, technician, priority)

        VALUES (?, ?, ?)
        `,

        [problem, technician, priority],

        (err) => {

            if(err){
                console.log(err);
            }

            res.redirect("/orders");

        }

    );

});


router.get("/orders/delete/:id", (req, res) => {

    const id = req.params.id;

    Database.run(
        "DELETE FROM orders WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.log(err);
            }

            res.redirect("/orders");
        }
    );
}); 

router.get("/orders/edit/:id", (req, res) => {

const { id } = req.params;

db.get(
    "SELECT * FROM orders WHERE id = ?",
    [id],
    (err, row) => {

        if(err){
            console.log(err);
        }

        res.render("pages/editOrder", {
            order: row
        });

    }
);

});
router.post("/orders/update/:id", (req, res) => {

    const { id } = req.params;

    const { problem, technician, priority } = req.body;

    db.run(
        `
        UPDATE orders
        SET
            problem = ?,
            technician = ?,
            priority = ?
        WHERE id = ?
        `,
        [problem, technician, priority, id],
        (err) => {

            if(err){
                console.log(err);
            }

            res.redirect("/orders");

        }
    );

});
module.exports = router;