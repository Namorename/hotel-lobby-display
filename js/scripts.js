/*******************
 * Глобальные переменные
 *******************/
let apiKey = "7dfc742a5b9732ab37ea132e20a436ad"; // вставить сюда
let cityId = "524901"; // Пример: id Москвы, смотрите документацию

// Настройки слайд-шоу
let slidesDefault = [
  "images/default1.jpg",
  "images/default2.jpg",
  "images/default3.jpg"
];

let slidesService1 = [
  "images/service1_1.jpg",
  "images/service1_2.jpg"
];

// ... аналогично для service2, service3, service4

// Текущее состояние
let currentSlideArray = slidesDefault;
let currentSlideIndex = 0;

/*******************
 * Функции
 *******************/

// Обновление текущего времени каждую секунду
function updateTime() {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  // Можно добавить секунды, если нужно
  // let seconds = now.getSeconds().toString().padStart(2, "0");
  // document.getElementById("current-time").textContent = `${hours}:${minutes}:${seconds}`;
  document.getElementById("current-time").textContent = `${hours}:${minutes}`;
}

// Получение данных о погоде
async function fetchWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=ru&appid=${apiKey}`
    );
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error("Ошибка при получении погоды:", error);
  }
}

// Обновление UI погоды
function updateWeatherUI(data) {
  // Температура, описание, иконка
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon; // Иконка типа 02d, 10n и т.д.

  document.getElementById("weather-temp").textContent = temp + "°C";
  document.getElementById("weather-desc").textContent = desc;

  // Установка иконки (OpenWeatherMap)
  // Например, так: http://openweathermap.org/img/wn/10d@2x.png
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weather-icon").style.backgroundImage = `url(${iconUrl})`;
}

// Запуск слайд-шоу (каждые 5 секунд меняется картинка)
function startSlideshow() {
  setInterval(() => {
    currentSlideIndex++;
    if (currentSlideIndex >= currentSlideArray.length) {
      currentSlideIndex = 0;
    }
    showSlide(currentSlideIndex);
  }, 5000);
}

// Показ одной картинки
function showSlide(index) {
  const slideshowImage = document.getElementById("slideshow-image");
  // Плавно скрываем (opacity=0), меняем src, потом показываем (opacity=1)
  slideshowImage.style.opacity = 0;

  setTimeout(() => {
    slideshowImage.src = currentSlideArray[index];
    slideshowImage.style.opacity = 1;
  }, 1000); // 1с — таймер совпадает с transition: opacity 1s
}

// Смена набора слайдов (при клике на услугу)
function changeSlideshow(serviceName) {
  switch (serviceName) {
    case "service1":
      currentSlideArray = slidesService1;
      break;
    // case "service2": currentSlideArray = slidesService2; ...
    // case "service3": currentSlideArray = slidesService3; ...
    // и т.д.

    default:
      // "default" или любое другое
      currentSlideArray = slidesDefault;
      break;
  }
  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
}

/*******************
 * События при загрузке страницы
 *******************/
window.addEventListener("load", () => {
  // Запустить время
  updateTime();
  setInterval(updateTime, 60000); // Обновлять раз в минуту

  // Получить погоду
  fetchWeather();
  // Можно добавить периодическое обновление (например, каждые 30 мин)
  setInterval(fetchWeather, 30 * 60 * 1000);

  // Показать первый слайд
  showSlide(currentSlideIndex);
  // Запустить слайд-шоу
  startSlideshow();
});
