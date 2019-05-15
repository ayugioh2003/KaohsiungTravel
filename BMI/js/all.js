var cm_input = document.querySelector('.cm')
var kg_input = document.querySelector('.kg')
var btn = document.querySelector('.btn')
var ul = document.querySelector('.logs')
var inputs = document.querySelector('.inputs')

var arr = localStorage.getItem('logs') ?
  JSON.parse(localStorage.getItem('logs')).data : []

function addLog(e) {

  if (cm_input.value == "" ||
    Number(cm_input.value) < 65 ||
    isNaN(Number(kg_input.value))) {
    return
  }
  if (kg_input.value == "" ||
    Number(kg_input.value) < 1 ||
    isNaN(Number(kg_input.value))) {
    return
  }

  var log = getlog()
  arr.push(log)

  var logs = {
    data: arr
  }
  localStorage.setItem('logs', JSON.stringify(logs))

  render()
}
function getlog() {
  var cm = Number(cm_input.value)
  var m = cm / 100
  var kg = Number(kg_input.value)
  var bmi = Math.round(kg / (m * m) * 100) / 100
  var text = getText(bmi)
  var now = new Date()
  var date = `${fillZero(now.getMonth() + 1)}-${fillZero(now.getDate())}-${now.getFullYear()}`

  var log = {
    'text': text,
    'bmi': bmi,
    'weight': kg,
    'height': cm,
    'date': date
  }
  console.log(log)
  return log
}
function getText(bmi) {
  if (bmi >= 40) return '重度肥胖'
  else if (bmi >= 35) return '中度肥胖'
  else if (bmi >= 30) return '輕度肥胖'
  else if (bmi >= 25) return '過重'
  else if (bmi >= 18.5) return '理想'
  else if (bmi < 18.5) return '過輕'
}
function fillZero(num) {
  if (num < 10) {
    return num = '0' + num
  }
  else {
    return num
  }
}
function render() {
  var str = ''
  arr.forEach((log, index, array) => {

    var borderColors = {
      '過輕': 'light',
      '理想': 'fit',
      '過重': 'fat',
      '輕度肥胖': 'fat',
      '中度肥胖': 'fat',
      '重度肥胖': 'fat-supur'
    }

    str += `
    <li class="${borderColors[log.text]}">
      <span>${log.text}</span>
      <span> <small>BMI</small> ${log.bmi}</span>
      <span> <small>weight</small> ${log.weight}</span>
      <span> <small>height</small> ${log.height}</span>
      <span> <small>${log.date}</small> </span>
    </li>
    `
  });
  ul.innerHTML = str
}

// 做事情
render()
btn.addEventListener('click', addLog)
inputs.addEventListener('keyup', function (e) {
  if (e.target.value == "" ||
    Number(e.target.value) <= 0 ||
    isNaN(Number(e.target.value))) {
    console.log('請輸入大於零的數字')
  }
})





