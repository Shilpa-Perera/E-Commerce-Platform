require("dotenv").config();
const config = require("config");
const users = require("./routes/users");
const products = require("./routes/products");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

app.use(express.json());
app.use("/texas-e-store/api/users", users);
app.use("/api/products", products);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
