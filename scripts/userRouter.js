const express = require('express')
const chalk = require('chalk')
const time = require('./consTime')



function usersRouter(client) {
  let db = client.db("CAD")
  let col = db.collection("users")

  const router = new express.Router()
  router.post('/users', (req, res, next) => {
    try {
      col.insertOne({
        name: req.body.name,
        surname: req.body.surname,
        project: req.body.project,
        imgLink: req.body.imgLink
      }).then(() => {
        console.log(`${time.getTime()}` + chalk.green `POST` + ":200");
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      console.log(`${time.getTime()}` + chalk.red `POST` + ":500");
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.get('/users', function (req, res, next) {
    try {
      col.find({}).toArray((e, result) => {
        console.log(`${time.getTime()}` + chalk.green `GET` + ":200");
        res.status(200).json(result);
      })
    } catch (error) {
      console.log(`${time.getTime()}` + chalk.red `GET` + ":500");
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.put('/users/:id', function (req, res, next) {
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
        console.log(`${time.getTime()}` + chalk.green `PUT` + ":200");
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      console.log(`${time.getTime()}` + chalk.red `PUT` + ":500");
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  router.delete('/users/:id', function (req, res, next) {
    try {
      col.deleteOne({
        _id: new mongodb.ObjectId(req.params.id),
      }).then(() => {
        console.log(`${time.getTime()}` + chalk.green `DELETE` + ":200");
        res.status(200).json({
          status: 'ok'
        });
      })
    } catch (error) {
      console.log(`${time.getTime()}` + chalk.red `DELETE` + ":500");
      console.error(error);
      res.status(500).json({
        status: 'error'
      });
    }
  });
  return router;
}
module.exports = usersRouter