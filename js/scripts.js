let apiKey = "7dfc742a5b9732ab37ea132e20a436ad"; 
let cityId = "3067696"; 

// Slideshow arrays
let slidesDefault = [
  "images/default1.jpg",
  "images/default2.jpg",
  "images/default3.jpg"
];
let slidesService1 = [
  "images/service1_1.jpg",
  "images/service1_2.jpg"
];
// etc. for service2, service3, ...

let currentSlideArray = slidesDefault;
let currentSlideIndex = 0;

/************************************************
 * TIME AND WEATHER
 ************************************************/
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
  let desc = data.weather[0].description; // e.g. "light rain", "clear sky"
  let icon = data.weather[0].icon;        // e.g. 10d
  let mainWeather = data.weather[0].main.toLowerCase(); // "rain", "clouds", "clear" ...

  // Display text info
  document.getElementById("weather-temp").textContent = temp + "°C";
  document.getElementById("weather-desc").textContent = desc;

  // Optional: OpenWeather static icon
  let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weather-icon").style.backgroundImage = `url(${iconUrl})`;

  // Lottie animations
  renderWeatherAnimation(mainWeather);
}

/************************************************
 * LOTTIE Weather Animations
 ************************************************/
function renderWeatherAnimation(mainWeather) {
  let player = document.getElementById("weather-lottie");
  if (!player) return;

  // Тут используем ссылки на Lottie-анимации. 
  // Возьмём какие-то демонстрационные файлы с lottiefiles.com (примерно).
  // Вы можете подобрать любые на свой вкус:
  const lottieAnimations = {
    rain:        "https://assets1.lottiefiles.com/packages/lf20_rvxnwkby.json",
    clouds:      "https://assets7.lottiefiles.com/packages/lf20_kxsd2ytq.json",
    clear:       "https://assets3.lottiefiles.com/packages/lf20_j7igqfxx.json",
    snow:        "https://assets2.lottiefiles.com/packages/lf20_vp7fnjpx.json",
    thunder:     "https://assets5.lottiefiles.com/packages/lf20_mYarDp.json",
    default:     "https://assets8.lottiefiles.com/packages/lf20_knvn7l9g.json"
  };

  if (mainWeather.includes("rain")) {
    player.load(lottieAnimations.rain);
  } else if (mainWeather.includes("cloud")) {
    player.load(lottieAnimations.clouds);
  } else if (mainWeather.includes("clear")) {
    player.load(lottieAnimations.clear);
  } else if (mainWeather.includes("snow")) {
    player.load(lottieAnimations.snow);
  } else if (mainWeather.includes("thunder")) {
    player.load(lottieAnimations.thunder);
  } else {
    // fallback
    player.load(lottieAnimations.default);
  }
}

/************************************************
 * SLIDESHOW
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
  slideshowImage.style.opacity = 0;
  setTimeout(() => {
    slideshowImage.src = currentSlideArray[index];
    slideshowImage.style.opacity = 1;
  }, 1000);
}

function changeSlideshow(serviceName) {
  switch (serviceName) {
    case "service1":
      currentSlideArray = slidesService1;
      break;
    // case 'service2': ...
    default:
      currentSlideArray = slidesDefault;
      break;
  }
  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
}

/************************************************
 * ON PAGE LOAD
 ************************************************/
window.addEventListener("load", () => {
  // Start clock
  updateTime();
  setInterval(updateTime, 1000);

  // Fetch weather once and then every 30 min
  fetchWeather();
  setInterval(fetchWeather, 30 * 60 * 1000);

  // Slideshow
  showSlide(currentSlideIndex);
  startSlideshow();
});
