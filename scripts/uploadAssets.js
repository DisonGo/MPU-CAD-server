const express = require('express')
const fs = require('fs')
const path = require('path')

const cons = require('./cons')

function assetsRouter() {
    const router = new express.Router()
    router.post('/imgs', async (req, res, next) => {        
        try {
            let file = req['files'].image;
            file.mv('assets/imgs/'+file.name)
            cons.log("POST",true,`uploaded ${file.name}`,"orange") 
            res.status(200).json({
                status:"upload done",
                link: req.protocol + '://' + req.get('host') + '/imgs/'+ file.name,
                shortlink: '/imgs/'+ file.name
            })
        } catch (error) {
            cons.log("POST",false,`failed to upload`,"orange") 
            res.status(501).json({
                status:"upload failed"
            })
        }
    });
    router.get('/imgs/all', function (req, res, next) {
        try {
            const directoryPath = path.join(__dirname, '../assets/imgs');
            let files = fs.readdirSync(directoryPath)
            files.forEach((file,i)=>{
                files[i] = "imgs/" + file
            })
            cons.log("GET",true,`sent imgs`,"yellow") 
            res.status(200).json(files)
            
        } catch (error) {
            cons.log("GET",false,`failed to send imgs`,"yellow") 
            console.log(error);
            res.status(501).json({
                status:"get failed"
            })
        }
    });
    router.delete('/imgs/:name', function (req, res, next) {
        try {
            const directoryPath = path.join(__dirname, '../assets/imgs',req.params.name);
            fs.rmSync(directoryPath)
            cons.log("DELETE",true,`deleted ${req.params.name}`,"yellow") 
            res.status(200).json({
                status:'ok'
            })
            
        } catch (error) {
            cons.log("DELETE",false,`failed to delete ${req.params.name}`,"yellow") 
            console.log(error);
            res.status(501).json({
                status:"delete failed"
            })
        }
    });
    return router;
}
module.exports = assetsRouter