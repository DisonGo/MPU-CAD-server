let time = {}
time.getTime = ()=>{
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
module.exports = time;