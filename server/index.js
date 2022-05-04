const users = require('./routes/users');
const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use('/texas-e-store/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));
