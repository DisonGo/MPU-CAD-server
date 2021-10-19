const express = require('express')
const {
    MongoClient
} = require('mongodb')
const cors = require('cors')
const projectRouter = require('./scripts/projectRouter')
const userRouter = require('./scripts/userRouter')

function requireHTTPS(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

const mongoUrl = "mongodb+srv://mpuCADdb:b7TmLx7UR7wq3KB@learningdbcluster.0oiga.mongodb.net/CAD?";

const client = new MongoClient(mongoUrl)
const app = express()

async function main() {
    await client.connect()

    const port = process.env.PORT || 8080;
    app.use(cors())
        .use(express.json())
        .use(express.urlencoded({
            extended: true
        }))
        .use(projectRouter(client))
        .use(userRouter(client))
        .use(express.static('assets'))
    if(app.get('env')!="development")app.use(requireHTTPS);
    app.listen(port, () => {
        console.log(`Listening to ${port}`);
    })
}
main()