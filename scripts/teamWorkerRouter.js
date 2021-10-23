const express = require('express')
const chalk = require('chalk')
const cons = require('./cons')



function teamWorkersRouter(client) {
  let db = client.db("CAD")
  let col = db.collection("teamWorkers")

  const router = new express.Router('teamWorkers')
  router.post('/teamWorkers', (req, res, next) => {
    try {
      col.insertOne({
        name: req.body.name,
        surname: req.body.surname,
        project: req.body.project,
        imgLink: req.body.imgLink
      }).then(() => {
        cons.log("POST", true, `teamWorker`, "yellow")
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      cons.log("POST", false, `teamWorker`, "yellow")
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.get('/teamWorkers', function (req, res, next) {
    try {
      col.find({}).toArray((e, result) => {
        cons.log("GET", true, `teamWorker`, "yellow")
        res.status(200).json(result);
      })
    } catch (error) {
      cons.log("GET", false, `teamWorker`, "yellow")
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.put('/teamWorkers/:id', function (req, res, next) {
    try {
      col.updateOne({
        _id: new mongodb.ObjectId(req.params.id)
      }, {
        $set: {
          name: req.body.name,
        surname: req.body.surname,
        project: req.body.project,
        imgLink: req.body.imgLink
        }
      }).then(() => {
        cons.log("PUT", true, `teamWorker`, "yellow")
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      cons.log("PUT", false, `teamWorker`, "yellow")
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.delete('/teamWorkers/:id', function (req, res, next) {
    try {
      col.deleteOne({
        _id: new mongodb.ObjectId(req.params.id),
      }).then(() => {
        cons.log("DELETE", true, `teamWorker`, "yellow")
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      cons.log("GET", false, `teamWorker`, "yellow")
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  return router;
}
module.exports = teamWorkersRouter