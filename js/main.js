import { fetchWeather } from './weather.js';
import { playSlidesOnce, cancelPlay } from './slideshow.js';
import { services } from './services.js';
import { startWatchdog } from './watchdog.js';

let serviceListItems = [];
let currentServiceIndex = 0;

function updateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("current-time").textContent = `${hh}:${mm}:${ss}`;
}

function initClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

function initWeather() {
  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);
}

function initServices() {
  const servicesListEl = document.getElementById("services-list");
  servicesListEl.innerHTML = "";
  serviceListItems = [];
  
  services.forEach((service, index) => {
    const li = document.createElement("li");
    li.textContent = service.name;
    li.addEventListener("click", () => {
      // При клике отменяем текущий цикл и запускаем показ выбранного сервиса
      cancelPlay();
      currentServiceIndex = index;
      cycleServices();
      highlightService(index);
    });
    servicesListEl.appendChild(li);
    serviceListItems.push(li);
  });
}

function highlightService(index) {
  serviceListItems.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

/**
 * Циклически проигрывает слайды для текущего сервиса, затем переходит к следующему.
 */
function cycleServices() {
  const currentService = services[currentServiceIndex];
  highlightService(currentServiceIndex);
  
  // Проигрываем слайды выбранного сервиса один раз.
  playSlidesOnce(currentService.slides, () => {
    // После окончания цикла переходим к следующему сервису
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    cycleServices();
  });
}

function initApp() {
  initClock();
  initWeather();
  initServices();
  // Запускаем циклический показ сервисов, начиная с первой группы (например, "Default")
  currentServiceIndex = 0;
  cycleServices();
  startWatchdog();
}

window.addEventListener("load", initApp);
