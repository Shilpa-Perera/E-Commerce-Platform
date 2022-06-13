require("express-async-errors");
require("dotenv").config();
const config = require("config");
const cors = require("cors");
const error = require("./middleware/error");
const customers = require("./routes/customers");
const products = require("./routes/products");
const orders = require("./routes/orders");
const variants = require("./routes/variants");
const categories = require("./routes/category");
const cart = require("./routes/cart");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.options("*", cors());
app.use(cors());
app.use(express.json());

app.use('/images/products', express.static('images/products'));
app.use('/images/variants', express.static('images/variants'));

app.use("/api/customers", customers);
app.use("/api/products", products);
app.use("/api/variants", variants);
app.use("/api/categories", categories);
app.use("/api/cart", cart);
app.use("/api/orders", orders);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
