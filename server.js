const express = require('express')
const {MongoClient} = require('mongodb')
const cors = require('cors')
const projectRouter = require('./scripts/projectRouter')
const userRouter = require('./scripts/userRouter')



const mongoUrl = "mongodb+srv://mpuCADdb:b7TmLx7UR7wq3KB@learningdbcluster.0oiga.mongodb.net/CAD?";

const client = new MongoClient(mongoUrl) 
const app = express()

async function main(){
    await client.connect()
    
    var port = process.env['app_port'] || 8080
    app.use(cors())
    .use(express.json())
    .use(express.urlencoded({
        extended:true
    }))
    .use(projectRouter(client))
    .use(userRouter(client))
    app.listen(port,()=>{
        console.log(`Listening to ${port}`);
    })
}
main()