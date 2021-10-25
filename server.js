const nodeRsa = require('node-rsa');
const expressJwt = require('express-jwt');
const fs = require('fs');

const express = require('./scripts/express-p');
const {
    MongoClient
} = require('mongodb')
const cors = require('cors')
const projectRouter = require('./scripts/projectRouter')
const teamWorkerRouter = require('./scripts/teamWorkerRouter');
const loginRouter = require('./scripts/login');
const cons = require('./scripts/cons');
const fileUpload = require('express-fileupload');
const assetsRouter = require('./scripts/uploadAssets');
const RSA_PUBLIC_KEY = fs.readFileSync('./login/public.key');

const checkIfAuthenticated = expressJwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: ['RS256']
});

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
        .use(teamWorkerRouter(client))
        .post('/login', loginRouter)
        .use(express.static('assets'))
        .use(fileUpload())
        .use(assetsRouter())
    app.route('/login/admin')
        .get(checkIfAuthenticated,
            function (error, req, res, next) {
                if (error.name === 'UnauthorizedError') {
                    cons.log("GET",false,'token invalid/expired','yellow')
                    res.status(401).send('invalid token');
                }
            },
            function (req, res, next) {
                res.status(200).json({
                    status: "Authorized"
                })
                next()
            })
    if (app.get('env') != "development") app.use(requireHTTPS);
    app.listen(port, () => {
        console.log(`Listening to ${port}`);
    })
}
main()