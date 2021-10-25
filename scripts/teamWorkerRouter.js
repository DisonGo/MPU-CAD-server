const express = require('express')
const chalk = require('chalk')
const mongodb = require('mongodb')

const cons = require('./cons')
const dbName = "CAD"
const colName = "teamWorkers"


function teamWorkersRouter(client) {
  let db = client.db(dbName)
  let col = db.collection(colName)

  const router = new express.Router('teamWorkers')
  router.post('/teamWorkers', async (req, res, next) => {
    function insert(elem) {
      let doc = elem
      if (Array.isArray(doc)) {
        return col.insertMany(doc, {
          order: true
        })
      } else return col.insertOne({
        name: doc.name,
        surname: doc.surname,
        project: doc.project,
        imgLink: doc.imgLink
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
            surname: doc.surname,
            project: doc.project,
            imgLink: doc.imgLink
          })
        });
        insert(docs).then(() => {
          cons.log("POST", true, `teamWorkers reconstruct done`, "yellow")
          res.status(200).json({
            status: 'ok'
          });
        })
      } else {
        insert(req.body).then(() => {
          cons.log("POST", true, `teamWorkers`, "yellow")
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
    // try {
    //   col.insertOne({
    //     name: req.body.name,
    //     surname: req.body.surname,
    //     project: req.body.project,
    //     imgLink: req.body.imgLink
    //   }).then(() => {
    //     cons.log("POST", true, `teamWorker`, "yellow")
    //     res.status(200).json({
    //       status: 'ok'
    //     });
    //   })
    // } catch (error) {
    //   cons.log("POST", false, `teamWorker`, "yellow")
    //   console.error(error);
    //   res.status(500).json({
    //     status: 'error'
    //   });
    // }
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