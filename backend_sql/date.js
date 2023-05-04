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


let startDate =  `${timeZone.year()}-${timeZone.month()+1}`
let endDate =  `${timeZone.year()}-${timeZone.month()+1}`
if((timeZone.month()+1) <= 9){
    startDate =  `${timeZone.year()}-0${timeZone.month()+1}`
    endDate =  `${timeZone.year()}-0${timeZone.month()+2}`
}

let time = `${timeZone.hour()}:${timeZone.minute()}`


// for filtering leads
const getTimePeriod = (year, month)=>{
    const thisMonth = `${year}-${month}`
    const toMonth = `${year}-${1+parseInt(month) <= 9 ? `0${1+parseInt(month)}` : `${1+parseInt(month)}`}`
   return [thisMonth, toMonth]
}


module.exports = {date, dateWithoutTime, startDate, endDate, time, getTimePeriod}