import { fetchWeather } from './weather.js';
import { initSlideshow, changeSlides } from './slideshow.js';
import { services } from './services.js';
import { startWatchdog } from './watchdog.js';

let serviceListItems = [];
let currentServiceIndex = 0;
const slideDuration = 5000;

function updateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("current-time").textContent = `${hh}:${mm}:${ss}`;
}

function dynamicThemeUpdate() {
  const now = new Date();
  const hour = now.getHours();
  // Если время до 19:00 – дневная тема (фон тёмный, шрифт светлый),
  // иначе – ночная тема (фон светлый, шрифт тёмный)
  if (hour < 19) {
    document.body.classList.remove("night-theme");
    document.body.classList.add("day-theme");
  } else {
    document.body.classList.remove("day-theme");
    document.body.classList.add("night-theme");
  }
}

function initClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

function initWeather() {
  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);
}

function initThemeUpdate() {
  dynamicThemeUpdate();
  setInterval(dynamicThemeUpdate, 60 * 1000);
}

function initServices() {
  const servicesListEl = document.getElementById("services-list");
  servicesListEl.innerHTML = "";
  serviceListItems = [];
  services.forEach((service, index) => {
    const li = document.createElement("li");
    li.textContent = service.name;
    li.addEventListener("click", () => {
      // По клику переключаем на выбранный сервис
      currentServiceIndex = index;
      changeSlides(service.slides);
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

// Функция цикличного переключения сервисов
function cycleServices() {
  const currentService = services[currentServiceIndex];
  changeSlides(currentService.slides);
  highlightService(currentServiceIndex);
  // Общее время показа текущего сервиса = количество слайдов * длительность показа одного слайда
  const totalTime = currentService.slides.length * slideDuration;
  setTimeout(() => {
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    cycleServices();
  }, totalTime);
}

function initApp() {
  initClock();
  initWeather();
  initServices();
  initThemeUpdate();
  // Запускаем цикличное переключение сервисов, начиная с первой группы ("Default")
  currentServiceIndex = 0;
  cycleServices();
  startWatchdog();
}

window.addEventListener("load", initApp);
