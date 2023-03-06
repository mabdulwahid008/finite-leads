const moment = require("moment-timezone")

const timeZone = moment.tz(Date.now(), "America/Los_Angeles");
let date = ''

if((timeZone.month()+1) <= 9){
    if(timeZone.date() <= 9)
    date = `${timeZone.year()}-0${timeZone.month()+1}-0${timeZone.date()}/${timeZone.hour()}:${timeZone.minute()}`
    else
    date = `${timeZone.year()}-0${timeZone.month()+1}-${timeZone.date()}/${timeZone.hour()}:${timeZone.minute()}`
}

if(timeZone.date() <= 9){
    if((timeZone.month()+1) <= 9)
    date = `${timeZone.year()}-0${timeZone.month()+1}-0${timeZone.date()}/${timeZone.hour()}:${timeZone.minute()}`
    else
    date = `${timeZone.year()}-${timeZone.month()+1}-0${timeZone.date()}/${timeZone.hour()}:${timeZone.minute()}`
}

let dateWithoutTime = `${timeZone.year()}-${timeZone.month()+1 <= 9? `0${timeZone.month()+1}`: `${timeZone.month()+1}`}-${timeZone.date()}`

module.exports = {date, dateWithoutTime}