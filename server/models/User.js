const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class User {
    constructor(userDetails) {
        this.name = userDetails.name;
        this.email = userDetails.email;
        this.password = userDetails.password;
        this.gender = userDetails.gender;
    }

    static fetchAll() {
        return db.execute('select * from users;');
    }

    static async findByEmail(email) {
        let sql = `select * from users where email=?;`;
        const [users, _] = await db.execute(sql, [email]);

        if (users.length > 0) {
            return users[0];
        }
        return false;
    }

    static async findById(id) {
        const sql = `select * from users where id=?;`;
        const [users, _] = await db.execute(sql, [id]);

        if (users.length > 0) {
            return users[0];
        }
        return false;
    }

    async save() {
        let sql = 'insert into users (name,email,password,gender) values (?,?,?,?);';

        await db.execute(sql, [this.name,this.email,this.password,this.gender], (err, results) => {
            if (err) {
                throw err;
            }
            else {
                console.log(results);
            }
        });
        this.id = (await User.findByEmail(this.email)).id;
    }

    updateUser(id) {

    }

    generateAuthToken() {
        const token = jwt.sign({ id: this.id, name: this.name, email: this.email, gender: this.gender}, process.env.jwtPrivateKey);
        return token;
    }
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().max(1024).required(),
        gender: Joi.string().required()
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;