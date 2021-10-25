const express = require('express')
const mongodb = require('mongodb')

const cons = require('./cons')
const dbName = "CAD"
const colName = "projects"


function projectsRouter(client) {
    let db = client.db(dbName)
    let col = db.collection(colName)

    const router = new express.Router()
    router.post('/projects', async (req, res, next) => {
        function insert(elem) {
            let doc = elem
            if (Array.isArray(doc)) {
                return col.insertMany(doc, {
                    order: true
                })
            } else return col.insertOne({
                name: doc.name,
                shortDescr: doc.shortDescr,
                longDescr: doc.longDescr,
                frontImgLink: doc.frontImgLink,
                innerImgLink: doc.innerImgLink
            }, )
        }
        try {
            if (Array.isArray(req.body)) {
                await col.drop().then(() => {
                    console.log("Collection deleted");
                    col = db.collection(colName)
                });
                let docs = []
                req.body.forEach(doc => {
                    docs.push({
                        name: doc.name,
                        shortDescr: doc.shortDescr,
                        longDescr: doc.longDescr,
                        frontImgLink: doc.frontImgLink,
                        innerImgLink: doc.innerImgLink
                    })
                });
                insert(docs).then(() => {
                    cons.log("POST", true, `project reconstruct done`, "yellow")
                    res.status(200).json({
                        status: 'ok'
                    });
                })
            } else {
                insert(req.body).then(() => {
                    cons.log("POST", true, `project`, "yellow")
                    res.status(200).json({
                        status: 'ok'
                    });
                })
            }
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