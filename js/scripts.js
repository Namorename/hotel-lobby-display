/************************************************
 * Global Variables
 ************************************************/
let apiKey = "YOUR_OPENWEATHER_API_KEY"; // вставьте сюда реальный ключ
// OpenWeather ID для Праги: 3067696 (или используйте lat/lon)
let cityId = "3067696";

let slidesDefault = [
  "images/default1.jpg",
  "images/default2.jpg",
  "images/default3.jpg"
];
let slidesService1 = [
  "images/service1_1.jpg",
  "images/service1_2.jpg"
];
// ... и т.д. для остальных сервисов

let currentSlideArray = slidesDefault;
let currentSlideIndex = 0;

/************************************************
 * Time and Weather
 ************************************************/
// Показываем время (часы:минуты:секунды)
function updateTime() {
  let now = new Date();
  let hh = String(now.getHours()).padStart(2, "0");
  let mm = String(now.getMinutes()).padStart(2, "0");
  let ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("current-time").textContent = `${hh}:${mm}:${ss}`;
}

async function fetchWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=en&appid=${apiKey}`
    );
    const data = await response.json();
    updateWeatherUI(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}

function updateWeatherUI(data) {
  let temp = Math.round(data.main.temp);
  let desc = data.weather[0].description; // "light rain", "clear sky", etc.
  let icon = data.weather[0].icon;
  let mainWeather = data.weather[0].main.toLowerCase(); // "rain", "clouds", "clear", "snow", "thunderstorm", ...

  // Обновим текстовые блоки
  document.getElementById("weather-temp").textContent = temp + "°C";
  document.getElementById("weather-desc").textContent = desc;
  document.getElementById("weather-icon").style.backgroundImage =
    `url(https://openweathermap.org/img/wn/${icon}@2x.png)`;

  // Запустим анимацию
  renderWeatherAnimation(mainWeather);
}

/************************************************
 * Weather Animations (Dynamic DOM)
 ************************************************/
function renderWeatherAnimation(weatherType) {
  const container = document.getElementById("weather-animation");
  // Сначала очистим контейнер от старых элементов
  container.innerHTML = "";

  switch (true) {
    case weatherType.includes("rain"):
      createRain(container, 20);
      break;
    case weatherType.includes("cloud"):
      createClouds(container, 3);
      break;
    case weatherType.includes("clear"):
      createSun(container);
      break;
    case weatherType.includes("snow"):
      createSnow(container, 15);
      break;
    case weatherType.includes("thunder"):
      createClouds(container, 2);
      createLightning(container);
      break;
    default:
      // Если ничего не подходит — можно сделать «clear»
      createSun(container);
      break;
  }
}

/** Создаём капли дождя */
function createRain(container, dropsCount) {
  for (let i = 0; i < dropsCount; i++) {
    let drop = document.createElement("div");
    drop.className = "raindrop";
    // Рандомная позиция (left)
    drop.style.left = Math.random() * 100 + "px";
    // Рандомная задержка анимации
    drop.style.animationDelay = Math.random() * 0.5 + "s";
    // Добавляем в контейнер
    container.appendChild(drop);
  }
}

/** Создаём облака */
function createClouds(container, cloudCount) {
  for (let i = 0; i < cloudCount; i++) {
    let cloud = document.createElement("div");
    cloud.className = "cloud";
    // Рандомный top (чтобы облака не шли ровно в одну линию)
    cloud.style.top = (20 + Math.random() * 40) + "px";
    // Добавляем
    container.appendChild(cloud);
  }
}

/** Создаём солнце и лучи */
function createSun(container) {
  let sun = document.createElement("div");
  sun.className = "sun";
  container.appendChild(sun);

  // Можно добавить «лучи» — например, один элемент, который крутится:
  let rays = document.createElement("div");
  rays.className = "sun-ray";
  container.appendChild(rays);
}

/** Создаём снежинки (используем символ "❄" или "•") */
function createSnow(container, flakeCount) {
  for (let i = 0; i < flakeCount; i++) {
    let flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = "❄"; // любой символ снежинки
    // Рандомная горизонтальная позиция
    flake.style.left = Math.random() * 100 + "px";
    // Рандомная задержка
    flake.style.animationDelay = Math.random() * 2 + "s";
    // Добавляем
    container.appendChild(flake);
  }
}

/** Создаём молнию */
function createLightning(container) {
  let lightning = document.createElement("div");
  lightning.className = "lightning";
  container.appendChild(lightning);
}

/************************************************
 * Slideshow
 ************************************************/
function startSlideshow() {
  setInterval(() => {
    currentSlideIndex++;
    if (currentSlideIndex >= currentSlideArray.length) {
      currentSlideIndex = 0;
    }
    showSlide(currentSlideIndex);
  }, 5000);
}

function showSlide(index) {
  const slideshowImage = document.getElementById("slideshow-image");
  // Fade out
  slideshowImage.style.opacity = 0;
  setTimeout(() => {
    slideshowImage.src = currentSlideArray[index];
    // Fade in
    slideshowImage.style.opacity = 1;
  }, 1000);
}

function changeSlideshow(serviceName) {
  switch (serviceName) {
    case "service1":
      currentSlideArray = slidesService1;
      break;
    // service2, etc.
    default:
      currentSlideArray = slidesDefault;
      break;
  }
  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
}

/************************************************
 * On Page Load
 ************************************************/
window.addEventListener("load", () => {
  // Start clock (update every second)
  updateTime();
  setInterval(updateTime, 1000);

  // Fetch weather
  fetchWeather();
  // Update weather every 30 minutes
  setInterval(fetchWeather, 30 * 60 * 1000);

  // Slideshow
  showSlide(currentSlideIndex);
  startSlideshow();
});
