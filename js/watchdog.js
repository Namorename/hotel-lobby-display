const WEATHER_UPDATE_THRESHOLD = 35 * 60 * 1000; // 35 минут

let lastWeatherUpdate = Date.now();

// Обновляем время последнего обновления при получении события
window.addEventListener("weatherUpdate", () => {
    lastWeatherUpdate = Date.now();
});

function startWatchdog() {
  setInterval(() => {
    const now = Date.now();
    if (now - lastWeatherUpdate > WEATHER_UPDATE_THRESHOLD) {
      console.error("Watchdog: Weather data outdated, reloading page.");
      location.reload();
    }
  }, 5 * 60 * 1000); // Проверяем каждые 5 минут
}

// Глобальная обработка ошибок
window.addEventListener("error", (e) => {
  console.error("Global error caught by watchdog:", e);
  // При необходимости можно добавить автоматическую перезагрузку:
  // location.reload();
});

export { startWatchdog };
