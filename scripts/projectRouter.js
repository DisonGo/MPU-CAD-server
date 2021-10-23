const express = require('express')
const chalk = require('chalk')
const cons = require('./cons')


function projectsRouter(client) {
    let db = client.db("CAD")
    let col = db.collection("projects")

    const router = new express.Router()
    router.post('/projects', (req, res, next) => {
        try {
            col.insertOne({
                name: req.body.name,
                shortDescr: req.body.shortDescr,
                longDescr: req.body.longDescr,
                frontImgLink: req.body.frontImgLink,
                innerImgLink: req.body.innerImgLink
            }).then(() => {
                cons.log("POST", true, `project`, "yellow")
                res.status(200).json({
                    status: 'ok'
                });
            })
        } catch (error) {
            cons.log("POST", false, `project`, "yellow")
            console.error(error);
            res.status(500).json({
                status: 'error'
            });
        }
    });
    router.get('/projects', function (req, res, next) {
        try {
            col.find({}).toArray((e, result) => {
                cons.log("GET", true, `project`, "yellow")
                res.status(200).json(result);
            })
        } catch (error) {
            cons.log("GET", false, `project`, "yellow")
            console.error(error);
            res.status(500).json({
                status: 'error'
            });
        }
    });
    router.put('/projects/:id', function (req, res, next) {
        try {
            col.updateOne({
                _id: new mongodb.ObjectId(req.params.id)
            }, {
                $set: {
                    name: req.body.name,
                    shortDescr: req.body.shortDescr,
                    longDescr: req.body.longDescr,
                    frontImgLink: req.body.frontImgLink,
                    innerImgLink: req.body.innerImgLink
                }
            }).then(() => {
                cons.log("PUT", true, `project`, "yellow")
                res.status(200).json({
                    status: 'ok'
                });
            })
        } catch (error) {
            cons.log("PUT", false, `project`, "yellow")
            console.error(error);
            res.status(500).json({
                status: 'error'
            });
        }
    });
    router.delete('/projects/:id', function (req, res, next) {
        try {
            col.deleteOne({
                _id: new mongodb.ObjectId(req.params.id),
            }).then(() => {
                cons.log("DELETE", true, `project`, "yellow")
                res.status(200).json({
                    status: 'ok'
                });
            })
        } catch (error) {
            cons.log("GET", false, `project`, "yellow")
            console.error(error);
            res.status(500).json({
                status: 'error'
            });
        }
    });
    return router;
}
module.exports = projectsRouter