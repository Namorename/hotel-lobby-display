const apiKey = "7dfc742a5b9732ab37ea132e20a436ad";
const cityId = "3067696";
const cacheKey = "weatherData";
const cacheDuration = 30 * 60 * 1000; // 30 минут

async function fetchWeather() {
  // Проверка кэша
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const cachedData = JSON.parse(cached);
    if (Date.now() - cachedData.timestamp < cacheDuration) {
      console.log("Using cached weather data");
      updateWeatherUI(cachedData.data);
      return;
    }
  }
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=en&appid=${apiKey}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    updateWeatherUI(data);
    // Кэшируем данные
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (err) {
    console.error("Error fetching weather:", err);
    document.getElementById("weather-temp").textContent = "N/A";
    document.getElementById("weather-desc").textContent = "Weather data unavailable";
  }
}

function updateWeatherUI(data) {
  if (!data || !data.main || !data.weather || data.weather.length === 0) {
    console.error("Invalid weather data:", data);
    return;
  }
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const mainWeather = data.weather[0].main.toLowerCase();

  document.getElementById("weather-temp").textContent = temp + "°C";
  document.getElementById("weather-desc").textContent = desc;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weather-icon").style.backgroundImage = `url(${iconUrl})`;

  renderWeatherAnimation(mainWeather);

  // Уведомляем watchdog о успешном обновлении погоды
  window.dispatchEvent(new CustomEvent("weatherUpdate"));
}

function renderWeatherAnimation(mainWeather) {
  const player = document.getElementById("weather-lottie");
  if (!player) return;

  const lottieAnimations = {
    rain:    "https://assets1.lottiefiles.com/packages/lf20_rvxnwkby.json",
    clouds:  "https://assets7.lottiefiles.com/packages/lf20_kxsd2ytq.json",
    clear:   "https://assets3.lottiefiles.com/packages/lf20_j7igqfxx.json",
    snow:    "https://assets2.lottiefiles.com/packages/lf20_vp7fnjpx.json",
    thunder: "https://assets5.lottiefiles.com/packages/lf20_mYarDp.json",
    default: "https://assets8.lottiefiles.com/packages/lf20_knvn7l9g.json"
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
    player.load(lottieAnimations.default);
  }
}

export { fetchWeather };
