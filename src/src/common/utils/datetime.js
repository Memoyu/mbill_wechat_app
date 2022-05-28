function getCurDate(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
    }
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    return [year, month, day].join('-')
}

function getCurDateObj(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
    }
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    // if (month < 10) month = `0${month}`
    // if (day < 10) day = `0${day}`
    return { year, month, day }
}

function getCurYear(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
    }
    let year = myDate.getFullYear()
    return year
}

function getCurMonth(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
    }
    let month = myDate.getMonth() + 1
    return month
}

function getCurDay(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
    }
    let day = myDate.getDate()
    return day
}

function getCurTime() {
    const myDate = new Date()
    let min = myDate.getMinutes()
    if (parseInt(min) < 10) {
        min = `0${min}`
    }

    let hour = myDate.getHours()
    if (parseInt(hour) < 10) {
        hour = `0${hour}`
    }

    let second = myDate.getSeconds()
    if (parseInt(second) < 10) {
        second = `0${second}`
    }
    return [hour, min, second].join(':')
}

function getCurDateTime() {
    return getCurDate() + ' ' + getCurTime()
}

function getNextMonth(date) {
    var myDate = new Date()
    if (date !== null && date !== undefined) {
        myDate = date
        month = myDate.getMonth();
    }
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    if (month == 12) {
        year = parseInt(year) + 1;
        month = 1;
    } else {
        month = parseInt(month) + 1;
    }
    return { year, month }
}

function getPrevMonth(date) {
    var myDate = new Date()

    if (date !== null && date !== undefined) {
        myDate = date
    }
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    if (month == 1) {
        year = parseInt(year) - 1;
        month = 12;
    } else {
        month = parseInt(month) - 1;
    }
    return { year, month }
}

module.exports = {
    getCurDateTime,
    getCurDate,
    getCurDateObj,
    getCurYear,
    getCurMonth,
    getCurDay,
    getCurTime,
    getNextMonth,
    getPrevMonth,
}