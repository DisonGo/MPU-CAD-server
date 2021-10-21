const express = require('express')
const chalk = require('chalk')
const jwt= require('jsonwebtoken');
const time = require('./consTime')
const fs = require("fs");
const RSA_PRIVATE_KEY = fs.readFileSync('./login/private.key');
let db, col

function findUserIdForEmail(user) {
    let ans = col.findOne(user, {
        _id: 1
    })
    return ans 
}

function validateEmailAndPassword(user) {
    let ans = col.findOne(user) || false
    if (ans != false) ans = true
    return ans
}

function loginRouter(client) {
    db = client.db("CAD")
    col = db.collection("login")

    const router = new express.Router()
    router.post('/login', (req, res, next) => {
        const user = {
            email: req.body.email,
            password: req.body.password
        }
        try {
            if (validateEmailAndPassword()) {
                const userId = findUserIdForEmail(user.email);

                const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                    algorithm: 'RS256',
                    expiresIn: 120,
                    subject: userId
                })
                console.log(`${time.getTime()}`+chalk.green`POST`+ chalk.yellow` login :200 ${user.email}`);
                res.status(200).json({
                    status: 'ok',
                    token: jwtBearerToken
                });
            } else {
                throw "401"
            }
        } catch (error) {
            console.log(`${time.getTime()}` +chalk.red`POST`+ chalk.yellow` login ${error} ${user.email}` );
            console.error(error);
            res.status(401).json({
                status: 'Unauthorized'
            });
        }
    });

    return router
}
module.exports = loginRouter