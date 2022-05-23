require("express-async-errors");
require("dotenv").config();
const config = require("config");
const error = require("./middleware/error");
const users = require("./routes/users");
const products = require("./routes/products");
const variants = require("./routes/variants");
const cart = require('./routes/cart') ;
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

app.use(express.json());
app.use("/texas-e-store/api/users", users);
app.use("/api/products", products);
app.use("/api/variants", variants);
app.use("/api/cart",cart) ;
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
