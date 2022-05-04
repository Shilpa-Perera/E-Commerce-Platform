const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/User');

class UserController {
    static async getAllUsers(req, res, next) {
        const allUsers = await User.fetchAll();
        res.send(allUsers);
    }

    static async getUser(req, res, next) {
        const user = await User.findById(req.params.id);
        res.send(user);
    }

    static async postUser(req, res, next) {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findByEmail(req.body.email);
        if (user) return res.status(400).send('User email already registered');

        user = new User(_.pick(req.body, ['name','email','password','gender']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save()

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['id','name','email','gender']));
    }
}

module.exports.UserController = UserController;