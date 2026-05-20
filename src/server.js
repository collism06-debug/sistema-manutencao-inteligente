const express = require("express");
const session = require("express-session");
const path = require("path");

const Order = require("./models/Order");
const Stock = require("./models/Stock");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(session({


    secret: "sistema-secret",

    resave: false,

    saveUninitialized: false

}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(orderRoutes);
app.use(authRoutes);
app.get("/", (req, res) => {
    res.redirect("/orders");
});
app.get("/devices", (req, res) => {
    res.render("pages/devices");
});


app.get("/stock", async (req, res) => {

    const stocks = await Stock.findAll();

    res.render("pages/stock", {
        stocks
    });

});
app.get("/dashboard", async (req, res) => {

    try {

        const totalOrders = await Order.count();

        const pendingOrders = await Order.count({
            where: {
                status: "Pendente"
            }
        });

        const completedOrders = await Order.count({
            where: {
                status: "Concluído"
            }
        });

        res.render("pages/dashboard", {
            totalOrders,
            pendingOrders,
            completedOrders
        });

    } catch (error) {

        console.log(error);

        res.send("Erro no dashboard");

    }

});


const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/database.sqlite");

db.serialize(() => {
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

db.run(`
    INSERT OR IGNORE INTO users (email, password)
    VALUES ('admin@gmail.com', '12345')
`);
});