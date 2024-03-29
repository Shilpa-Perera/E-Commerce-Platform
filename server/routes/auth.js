const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Customer} = require('../models/Customer');
const express = require('express');
const { Admin } = require('../models/Admin');
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = req.body.email;

    let user = await Admin.findByEmail(email);
    if (!user) user = await Customer.findByEmail(email);    
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required(),
    });

    return schema.validate(req);
}

module.exports = router;