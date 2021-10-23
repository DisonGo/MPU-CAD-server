const { green, red } = require("chalk")
const chalk = require("chalk")

let cons = {}
cons.getTime = ()=>{
    let date = new Date()
    let s = date.getSeconds()
    let m = date.getMinutes()
    let h = date.getHours()
    s = s.toString().padStart(2,'0')
    m = m.toString().padStart(2,'0')
    h = h.toString().padStart(2,'0')
    let str = `[${h}:${m}:${s}]:`
    return str
}
cons.log = (method,succes,text,textColor)=>{
    let str = cons.getTime()
    str += chalk.keyword(succes?"green":"red")`${method}:`
    str += chalk.keyword(textColor)`${text}`
    console.log(str);
}

module.exports = cons;