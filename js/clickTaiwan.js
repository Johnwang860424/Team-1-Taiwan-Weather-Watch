import {
  currentCityWeatherData,
  getDistWeekWeatherData,
  getTownshipWeeklyData,
  getDistWeatherData,
  getCityWeatherData,
} from "./data.js";
import { cityDistList } from "./city.js";

//更改鄉鎮選單
function getTowns() {
  let townOptions = document.querySelector(".town_menu").children;
  let optionClone = $("option:first").clone();
  optionClone.innerHTML = "選擇鄉鎮";
  if (townOptions.length > 2) {
    let townSelect = document.querySelectorAll("select")[1];
    townSelect.innerHTML = "";
    document.querySelector(".town_menu").appendChild(optionClone[0]);
  }
  let location = $(".city").text();
  const TownsAmount = cityDistList[location].length;
  let fragment = document.createDocumentFragment();
  for (let x = 0; x < TownsAmount; x++) {
    optionClone.clone().html(cityDistList[location][x]).appendTo(fragment);
  }
  document.querySelector(".town_menu").appendChild(fragment);

  /*
    let option = document.querySelectorAll("option")
    if (option.length > 2) {
        let select = document.querySelector("select")
        for (let x = 2; x < option.length; x++) {
            select.removeChild(option[x])
        }
    }
    let location = $(".city").text()
    const TownsAmount = cityDistList[location].length
    let fragment = document.createDocumentFragment()
    for (let x = 1; x < TownsAmount; x++) {
        $("option:last").html(cityDistList[location][0])
        $("option:last").clone().html(cityDistList[location][x]).appendTo(fragment)
    }
    document.querySelector(".town_meun").appendChild(fragment)
*/
}
//開網頁偵測地區更動鄉鎮市選單
window.onload = () => {
  getTowns();
  getCityWeatherData();
};
window.addEventListener("load", function () {
  let intervalId = setInterval(() => {
    if (currentCityWeatherData["臺北市"]) {
      changeText("臺北市");
      // Stop the interval when the data is available
      clearInterval(intervalId);
    }
  }, 0.05);
});
//clickTaiwan
const htmlIDToApiID = {
  C10017: "049",
  C65: "069",
  C63: "061",
  C68: "005",
  C10004: "009",
  C10018: "053",
  C10005: "013",
  C66: "073",
  C10008: "021",
  C10007: "017",
  C10009: "025",
  C10010: "029",
  C10020: "057",
  C67: "077",
  C64: "065",
  C10013: "033",
  C10014: "037",
  C10015: "041",
  C10002: "001",
  C10016: "045",
  C09020: "085",
  C09007: "081",
};

const htmlIDToPosition = {
  C10017: "310 30",
  C65: "280 65",
  C63: "288 30",
  C68: "240 55",
  C10004: "235 95",
  C10018: "210 80",
  C10005: "210 130",
  C66: "180 170",
  C10008: "220 200",
  C10007: "150 210",
  C10009: "130 235",
  C10010: "170 265",
  C10020: "142 265",
  C67: "130 320",
  C64: "130 380",
  C10013: "170 420",
  C10014: "225 350",
  C10015: "275 220",
  C10002: "300 115",
  C10016: "15 250",
  C09020: "20 150",
  C09007: "20 80",
};

const htmlIDs = [
  "C10017",
  "C65",
  "C63",
  "C68",
  "C10004",
  "C10018",
  "C10005",
  "C66",
  "C10008",
  "C10007",
  "C10009",
  "C10010",
  "C10020",
  "C67",
  "C64",
  "C10013",
  "C10014",
  "C10015",
  "C10002",
  "C10016",
  "C09020",
  "C09007",
];

const cityIdName = {
  C10017: "基隆市",
  C65: "新北市",
  C63: "臺北市",
  C68: "桃園市",
  C10004: "新竹縣",
  C10018: "新竹市",
  C10005: "苗栗縣",
  C66: "臺中市",
  C10008: "南投縣",
  C10007: "彰化縣",
  C10009: "雲林縣",
  C10010: "嘉義縣",
  C10020: "嘉義市",
  C67: "臺南市",
  C64: "高雄市",
  C10013: "屏東縣",
  C10014: "臺東縣",
  C10015: "花蓮縣",
  C10002: "宜蘭縣",
  C10016: "澎湖縣",
  C09020: "金門縣",
  C09007: "連江縣",
};

htmlIDs.forEach((htmlID) => {
  const regionEl = document.querySelector(`#${htmlID}`);
  regionEl.addEventListener("click", async function () {
    //fetch information function
    let oldPathChosed = $("#chosed")[0];
    oldPathChosed.removeAttribute("style", "fill: red");
    oldPathChosed.removeAttribute("id");
    let newPathChosed = regionEl.querySelector("path");
    newPathChosed.setAttribute("style", "fill: #00c0fb");
    newPathChosed.setAttribute("id", "chosed");
    changeText(this.childNodes[1].textContent.slice(0, 3));
    goToPosition(this.id);
    getDescContents(this.id);
    getTowns();
    getCityWeatherData(cityIdName[`${this.id}`]);
  });
  function goToPosition(htmlID) {
    const positionEl = document.querySelector("#position");
    positionEl.setAttribute(
      "transform",
      `translate(${htmlIDToPosition[htmlID]})`
    );
  }
});
// 檢查天氣圖片
function checkweatherImg(wx) {
  const code = +wx;
  const weatherTypes = {
    isThunderstorm: [
      15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41, 8, 9, 10, 11, 12, 13, 14, 19,
      20, 29, 30, 31, 32, 38, 39, 23, 37, 42,
    ],
    isClear: [1],
    isCloudy: [2, 3, 4, 5, 6, 7, 24, 25, 26, 27, 28],
  };
  if (weatherTypes.isThunderstorm.includes(code)) {
    return "img/rain.svg";
  } else if (weatherTypes.isCloudy.includes(code)) {
    return "img/cloudy.svg";
  } else {
    return "img/sunny.svg";
  }
}
// 串接今明36小時天氣預報api資料
function changeText(countyName) {
  const todayText = document.querySelector(".todayRight").childNodes[3];
  const time = document.querySelector(".todayRight").childNodes[5];
  const todayImg = document.querySelector(".todayRight img");
  const today = document.querySelector(".todayRight").childNodes[9];
  const pop = document.querySelector(".todayRight").childNodes[11];
  const tomorrowText = document.querySelector(".tomorrow").childNodes[1];
  const tomorrowImg = document.querySelector(".tomorrow img");
  const tomorrow = document.querySelector(".tomorrow").childNodes[5];
  const laterText = document.querySelector(".later").childNodes[1];
  const laterImg = document.querySelector(".later img");
  const later = document.querySelector(".later").childNodes[5];
  currentCityWeatherData[countyName].forEach((data, index) => {
    switch (index) {
      case 0:
        time.textContent = `${data.startTime}~${data.endTime}`;
        todayImg.setAttribute("src", checkweatherImg(data.wx));
        today.textContent = `${data.MinT}°-${data.MaxT}°`;
        pop.textContent = `${data.PoP}%`;
        if (data.startTime == "00:00") {
          todayText.textContent = "今日凌晨";
          tomorrowText.textContent = "今日白天";
          laterText.textContent = "今日晚上";
        } else if (data.startTime == "06:00" || data.startTime == "12:00") {
          todayText.textContent = "今日白天";
          tomorrowText.textContent = "今晚明晨";
          laterText.textContent = "明日白天";
        } else if (data.startTime == "18:00") {
          todayText.textContent = "今晚明晨";
          tomorrowText.textContent = "明日白天";
          laterText.textContent = "明日晚上";
        }
        break;
      case 1:
        tomorrowImg.setAttribute("src", checkweatherImg(data.wx));
        tomorrow.textContent = `${data.MinT}°-${data.MaxT}°`;
        break;
      case 2:
        laterImg.setAttribute("src", checkweatherImg(data.wx));
        later.textContent = `${data.MinT}°-${data.MaxT}°`;
        break;
    }
  });
}

// 取得縣市的名字
const city = document.querySelector(".city");
function getDescContents(id) {
  const country = document.getElementById(id);
  const descEl = country.getElementsByTagName("desc");
  const descContent = descEl[0].textContent;
  const cityName = descContent.split("區域");
  city.innerHTML = cityName[0];
}
let isChooseDist = false;

/* 拿SELCET值-區域名稱 */

let distSelectName;
const town_menu = document.querySelector(".town_menu");
town_menu.addEventListener("change", (e) => {
  isChooseDist = true;
  distSelectName = e.target.value;
});
const town_menu_button = document.querySelector(".town_menu_button");
town_menu_button.addEventListener("click", (e) => {
  if (isChooseDist) {
    const threeHour = document.querySelector("#three div");
    const week = document.querySelector("#week div");
    threeHour.textContent = "";
    week.textContent = "";
    getDistWeekWeatherData(city.textContent, distSelectName);
    getTownshipWeeklyData(city.textContent, distSelectName);
    getDistWeatherData(city.textContent, distSelectName);
  } else {
  }
});

// rwd小螢幕縣市名下拉選單切換功能

let citySelectName;
const city_menu = document.querySelector(".city_menu");
city_menu.addEventListener("change", (e) => {
  citySelectName = e.target.value;
  if (citySelectName !== "選擇城市") {
    city.innerHTML = citySelectName;
    isChooseDist = false;
    getTowns();
    changeText(citySelectName);
  }
});

// 彈跳視窗
document.onclick = function (click) {
  const chartWindow = document.querySelector("#chart_window");
  const dialogMask = document.getElementsByClassName("dialogMask");
  const chartHeaderBackground = document.querySelector(
    ".chart_window_header_background"
  );
  if (click.target.className === "town_menu_button") {
    // 打開 chart_window

    if (isChooseDist) {
      chartWindow.style.display = "block";
      chartHeaderBackground.style.display = "block";
      dialogMask[0].classList.remove("none");
    }
  }
  // 點擊dialogMask 關閉chart_window
  else if (click.target.className === "dialogMask") {
    chartWindow.style.display = "none";
    chartHeaderBackground.style.display = "none";
    dialogMask[0].classList.add("none");
  }
};
