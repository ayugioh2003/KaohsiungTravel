"use strict";

var url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
var records = [];
var zones = [];
var currentSelectZone = '三民區'; // 分頁列的資料

var show_per_page = 4; // 每一個分頁要顯示的數量
// 初始化: 頁面載入時就啟動 AJAX、載入選擇清單、使用渲染

var xhr = new XMLHttpRequest();
xhr.open('get', url);

xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var res = xhr.responseText;
    var json = JSON.parse(res); // 取得全部記錄

    records = json.result.records; // 取得各區清單

    zones = records.map(function (record) {
      return record.Zone;
    }).filter(function (zone, index, arr) {
      return arr.indexOf(zone) === index;
    }); // select 選項製作

    var options = zones.reduce(function (all, zone, index, arr) {
      return all + "<option value=\"".concat(zone, "\">").concat(zone, "</option>");
    }, "");
    document.querySelector('select').innerHTML = options; // 重繪畫面

    render();
  }
};

xhr.send(); // 監聽器: select 切換監聽

document.querySelector('select').addEventListener('change', function (e) {
  currentSelectZone = e.target.value; // 抓 option 中的值

  render();
}); // 監聽器: button 點擊監聽

document.querySelector('.hot').addEventListener('click', function (e) {
  if (e.target.tagName !== 'BUTTON') return;
  currentSelectZone = e.target.textContent;
  render(); // 視窗移動

  window.scrollTo(0, document.querySelector('.divide').offsetTop);
}); // 渲染器: 在初始化、監聽器中被使用

function render() {
  // 挑出某區的所有記錄
  var somerecords = records.filter(function (record) {
    return record.Zone === currentSelectZone;
  }); // render | area ------------------------------

  var lists = somerecords.reduce(function (all, record) {
    var cardTemp = "\n    <div class=\"col-md-6 mb-3\">\n      <div class=\"card\">\n        <div class=\"card-head\">\n          <img src=\"".concat(record.Picture1, "\" class=\"card-img-top img-cover\" style=\"height: 200px\">\n          <div class=\"card-description\">\n            <div class=\"h4 mb-0\">").concat(record.Name, "</div>\n            <div class=\"align-self-end\">").concat(record.Zone, "</div>\n          </div>\n        </div>\n        <div class=\"card-body\">\n          <p class=\"card-text\">\n            <img src=\"./images/icons_clock.png\" alt=\"\">\n            ").concat(record.Opentime, "\n          </p>\n          <p class=\"card-text\">\n            <img src=\"./images/icons_pin.png\" alt=\"\">\n            ").concat(record.Add, "\n          </p>\n          <p class=\"card-text d-flex justify-content-between\">\n            <span>\n              <img src=\"./images/icons_phone.png\" alt=\"\">        \n              ").concat(record.Tel, "\n            </span>\n            <span>\n              <img src=\"./images/icons_tag.png\" alt=\"\">\n              ").concat(record.Ticketinfo, "\n            </span>\n          </p>\n        </div>\n      </div>\n    </div>");
    return all + cardTemp;
  }, "");
  document.querySelector('.area-name').innerHTML = currentSelectZone;
  document.querySelector('.area-lists').innerHTML = lists; // render | pagination ------------------------------

  show_per_page = show_per_page; // 每一個分頁要顯示的數量

  var number_of_items = document.querySelector('.area-lists').childElementCount;
  var number_of_pages = Math.ceil(number_of_items / show_per_page); // 頁數顯示：算出 number_of_pages 後就可以新增下方的分頁數列

  var pagiLists = '';

  for (var i = 1; i < number_of_pages + 1; i++) {
    var textnode = "\n    <li class=\"page-item\" onclick=\"changePage(".concat(i - 1, ")\">\n      <a class=\"page-link\" href=\"#\">\n      ").concat(i, "</a>\n    </li>");
    pagiLists += textnode;
  }

  document.querySelector('.pagination').innerHTML = pagiLists;
  document.querySelectorAll('.pagination a').forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
    };
  }); // 取消 anchor 的預設行為

  changePage(0); // 第0頁開始
} // 切換頁: 在渲染器中被使用


function changePage(page_num) {
  // 開始選取的陣列位置：用頁碼乘以每頁顯示數量
  // 結束選取的陣列位置：用開始選取的陣列位置加上每頁顯示數量
  var start_from = page_num * show_per_page; // 頁碼*每頁顯示數量

  var end_on = start_from + show_per_page; // 開始位置+每頁顯示數量

  var areaLists = document.querySelector('.area-lists').children;
  var number_of_items = document.querySelector('.area-lists').childElementCount;

  for (var i = 0; i < number_of_items; i++) {
    areaLists[i].style.display = 'none'; // 重置

    if (i >= start_from && i < end_on) {
      areaLists[i].style.display = 'block';
    }
  }

  document.querySelectorAll('.pagination li').forEach(function (li, index) {
    li.className = 'page-item';
    if (index == page_num) li.classList.add('active');
  });
}
//# sourceMappingURL=all.js.map
