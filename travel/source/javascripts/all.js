let url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97'

let records = []
let zones = []
let currentSelectZone = '三民區'

// 分頁列的資料
let show_per_page = 4; // 每一個分頁要顯示的數量

// 初始化: 頁面載入時就啟動 AJAX、載入選擇清單、使用渲染
let xhr = new XMLHttpRequest()
xhr.open('get', url)
xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    let res = xhr.responseText
    let json = JSON.parse(res)

    // 取得全部記錄
    records = json.result.records

    // 取得各區清單
    zones = records.map(record => record.Zone)
      .filter((zone, index, arr) => arr.indexOf(zone) === index)

    // select 選項製作
    let options = zones.reduce((all, zone, index, arr) => {
      return all + `<option value="${zone}">${zone}</option>`
    }, "")
    document.querySelector('select').innerHTML = options

    // 重繪畫面
    render()

  }
}
xhr.send()


// 監聽器: select 切換監聽
document.querySelector('select').addEventListener('change', function (e) {
  currentSelectZone = e.target.value // 抓 option 中的值
  render() 
})
// 監聽器: button 點擊監聽
document.querySelector('.hot').addEventListener('click', function (e) {
  if (e.target.tagName !== 'BUTTON') return

  currentSelectZone = e.target.textContent
  render()

  // 視窗移動
  window.scrollTo(0, document.querySelector('.divide').offsetTop);
})

// 渲染器: 在初始化、監聽器中被使用
function render() {

  // 挑出某區的所有記錄
  let somerecords = records.filter(record => record.Zone === currentSelectZone)

  // render | area ------------------------------
  let lists = somerecords.reduce((all, record) => {
    let cardTemp = `
    <div class="col-md-6 mb-3">
      <div class="card">
        <div class="card-head">
          <img src="${record.Picture1}" class="card-img-top img-cover" style="height: 200px">
          <div class="card-description">
            <div class="h4 mb-0">${record.Name}</div>
            <div class="align-self-end">${record.Zone}</div>
          </div>
        </div>
        <div class="card-body">
          <p class="card-text">
            <img src="./images/icons_clock.png" alt="">
            ${record.Opentime}
          </p>
          <p class="card-text">
            <img src="./images/icons_pin.png" alt="">
            ${record.Add}
          </p>
          <p class="card-text d-flex justify-content-between">
            <span>
              <img src="./images/icons_phone.png" alt="">        
              ${record.Tel}
            </span>
            <span>
              <img src="./images/icons_tag.png" alt="">
              ${record.Ticketinfo}
            </span>
          </p>
        </div>
      </div>
    </div>`

    return all + cardTemp
  }, "")
  document.querySelector('.area-name').innerHTML = currentSelectZone
  document.querySelector('.area-lists').innerHTML = lists

  // render | pagination ------------------------------
  show_per_page = show_per_page; // 每一個分頁要顯示的數量
  let number_of_items = document.querySelector('.area-lists').childElementCount;
  var number_of_pages = Math.ceil(number_of_items / show_per_page);


  // 頁數顯示：算出 number_of_pages 後就可以新增下方的分頁數列
  var pagiLists = ''
  for (var i = 1; i < number_of_pages + 1; i++) {
    var textnode = `
    <li class="page-item" onclick="changePage(${i - 1})">
      <a class="page-link" href="#">
      ${i}</a>
    </li>`;
    pagiLists += textnode;
  }
  document.querySelector('.pagination').innerHTML = pagiLists
  document.querySelectorAll('.pagination a').forEach( a => {
    a.onclick = (e)=>{e.preventDefault()}
  }) // 取消 anchor 的預設行為


  changePage(0)  // 第0頁開始

}

// 切換頁: 在渲染器中被使用
function changePage(page_num) {

  // 開始選取的陣列位置：用頁碼乘以每頁顯示數量
  // 結束選取的陣列位置：用開始選取的陣列位置加上每頁顯示數量
  var start_from = page_num * show_per_page; // 頁碼*每頁顯示數量
  var end_on = start_from + show_per_page;  // 開始位置+每頁顯示數量
  let areaLists = document.querySelector('.area-lists').children
  let number_of_items = document.querySelector('.area-lists').childElementCount;

  for (var i = 0; i < number_of_items; i++) {
    areaLists[i].style.display = 'none'; // 重置

    if (i >= start_from && i < end_on) {
      areaLists[i].style.display = 'block';
    }
  }

  document.querySelectorAll('.pagination li').forEach( (li, index) => {
    li.className = 'page-item'
    if (index == page_num) li.classList.add('active')
  })

}
