const express = require('express')
const chalk = require('chalk')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
    MongoClient
} = require('mongodb')
const cons = require('./cons')
const fs = require("fs");
const { yellow } = require('chalk');


const RSA_PRIVATE_KEY = fs.readFileSync('./login/private.key');
const KEY_LIFETIME = 10 * 60


let db, col
const mongoUrl = "mongodb+srv://mpuCADdb:b7TmLx7UR7wq3KB@learningdbcluster.0oiga.mongodb.net/CAD?";

const client = new MongoClient(mongoUrl)

function validateEmailAndPassword(user) {
    return col.findOne({
        "email": user.email,
        password: user.password
    })
}

async function loginRouter(req, res, next) {
    await client.connect()
    db = client.db("CAD")
    col = db.collection("login")
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        let data = await validateEmailAndPassword(user)
            let _id = data ? data._id.toString() : false
            if (_id != false) {
                const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                    algorithm: 'RS256',
                    expiresIn: KEY_LIFETIME,
                    subject: _id
                })
                cons.log("POST",true,` login: 200 ${user.email}`,"yellow")
                res.status(200).json({
                    id_token: jwtBearerToken,
                    expires_at: KEY_LIFETIME
                });
            } else {
                throw "401"
            }

    } catch (error) {
        cons.log("POST",false,` login: 200 ${user.email}`,"yellow")
        console.error(error);
        res.status(401).json({
            status: 'Unauthorized'
        });
    }
    next()
};

module.exports = loginRouter