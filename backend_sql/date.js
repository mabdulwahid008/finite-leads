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



let dateWithoutTime = `${timeZone.year()}-${timeZone.month()+1 <= 9? `0${timeZone.month()+1}`: `${timeZone.month()+1}`}-${timeZone.date() <= 9? `0${timeZone.date()}` : timeZone.date() }`


let startDate =  `${timeZone.year()}-${timeZone.month()+1}-01`
let endDate =  `${timeZone.year()}-${timeZone.month()+1}-31`
if((timeZone.month()+1) <= 9){
    startDate =  `${timeZone.year()}-0${timeZone.month()+1}-01`
    endDate =  `${timeZone.year()}-0${timeZone.month()+1}-31`
}

module.exports = {date, dateWithoutTime, startDate, endDate}