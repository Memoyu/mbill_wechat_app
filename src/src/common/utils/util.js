function getCurrentDate() {
  const myDate = new Date()
  let year = myDate.getFullYear()
  let month = myDate.getMonth() + 1
  let day = myDate.getDate()
  if (month < 10) month = `0${month}`
  if (day < 10) day = `0${day}`
  return [year, month, day].join('-')
}

function getCurrentYear(date) {
  var myDate = new Date()
  if (date !== null && date !== undefined) {
    myDate = date
  }
  let year = myDate.getFullYear()
  return year
}

function getCurrentMonth(date) {
  var myDate = new Date()
  if (date !== null && date !== undefined) {
    myDate = date
  }
  let month = myDate.getMonth() + 1
  return month
}

function getCurrentDay(date) {
  var myDate = new Date()
  if (date !== null && date !== undefined) {
    myDate = date
  }
  let day = myDate.getDate()
  return day
}

function getCurrentTime() {
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

function getCurrentDateTime() {
  return getCurrentDate() + ' ' + getCurrentTime()
}

module.exports = {
  getCurrentDateTime,
  getCurrentDate,
  getCurrentYear,
  getCurrentMonth,
  getCurrentDay,
  getCurrentTime
}