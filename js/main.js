import { fetchWeather } from './weather.js';
import { initSlideshow, changeSlides } from './slideshow.js';
import { services } from './services.js';
import { startWatchdog } from './watchdog.js';

// Обновление времени
function updateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("current-time").textContent = `${hh}:${mm}:${ss}`;
}

// Динамическое обновление темы (смена на тёмную после 19:00)
function dynamicThemeUpdate() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 19) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  }
}

// Инициализация списка услуг (кастомизация сервисов)
function initServices() {
  const servicesListEl = document.getElementById("services-list");
  servicesListEl.innerHTML = ''; // очищаем список
  services.forEach((service) => {
    const li = document.createElement("li");
    li.textContent = service.name;
    li.addEventListener("click", () => {
      changeSlides(service.slides);
    });
    servicesListEl.appendChild(li);
  });
}

function initClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

function initWeather() {
  // Начальное получение погоды, затем обновление каждые 30 минут
  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);
}

function initThemeUpdate() {
  dynamicThemeUpdate();
  setInterval(dynamicThemeUpdate, 60 * 1000); // проверяем каждую минуту
}

function initApp() {
  initClock();
  initWeather();
  initServices();
  initThemeUpdate();

  // Запуск слайд-шоу с набором слайдов по умолчанию (первый сервис)
  initSlideshow(services[0].slides);

  // Запуск watchdog для мониторинга работоспособности
  startWatchdog();
}

window.addEventListener("load", initApp);
