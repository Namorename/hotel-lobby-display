let currentSlides = [];
let currentSlideIndex = 0;
let slideshowInterval = null;
const slideDuration = 5000;

// Объект для хранения предзагруженных изображений
const preloadedImages = {};

/**
 * Предзагружает все изображения из массива слайдов.
 * Если изображение уже предзагружено, повторно его не загружаем.
 */
function preloadSlides(slides) {
  slides.forEach(src => {
    if (!preloadedImages[src]) {
      const img = new Image();
      img.src = src;
      preloadedImages[src] = img;
    }
  });
}

/**
 * Инициализирует слайд-шоу с указанным массивом слайдов.
 */
function initSlideshow(slides) {
  currentSlides = slides;
  currentSlideIndex = 0;
  preloadSlides(slides); // Предзагружаем все изображения сразу
  showSlide(currentSlideIndex);
  if (slideshowInterval) clearInterval(slideshowInterval);
  slideshowInterval = setInterval(nextSlide, slideDuration);
}

/**
 * Отображает слайд по индексу с плавным переходом.
 */
function showSlide(index) {
  const slideshowImage = document.getElementById("slideshow-image");
  if (!slideshowImage) return;

  // Запускаем плавное исчезновение
  slideshowImage.style.transition = 'opacity 0.3s ease-in-out';
  slideshowImage.style.opacity = 0;

  // После короткой задержки меняем изображение
  setTimeout(() => {
    // Новое изображение уже предзагружено, поэтому задержки загрузки не будет
    slideshowImage.src = currentSlides[index];
    // Плавное появление
    slideshowImage.style.opacity = 1;
  }, 300); // уменьшили задержку до 300 мс для более быстрой смены
}

/**
 * Переходит к следующему слайду.
 */
function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
  showSlide(currentSlideIndex);
}

/**
 * Меняет набор слайдов и перезапускает слайд-шоу.
 */
function changeSlides(newSlides) {
  currentSlides = newSlides;
  currentSlideIndex = 0;
  preloadSlides(newSlides);  // Предзагружаем новые слайды
  showSlide(currentSlideIndex);
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, slideDuration);
  }
}

export { initSlideshow, changeSlides };
