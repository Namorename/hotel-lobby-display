let currentSlides = [];
let currentSlideIndex = 0;
let slideshowInterval = null;
const slideDuration = 5000;

// Объект для хранения предзагруженных изображений
const preloadedImages = {};

/**
 * Предзагружает все изображения из массива слайдов.
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
  preloadSlides(slides); // Предзагружаем изображения
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
  
  // Плавное затухание с переходом 0.5s
  slideshowImage.style.opacity = 0;
  setTimeout(() => {
    slideshowImage.src = currentSlides[index];
    slideshowImage.style.opacity = 1;
  }, 500); // задержка 500 мс для плавности
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
  preloadSlides(newSlides);
  showSlide(currentSlideIndex);
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, slideDuration);
  }
}

export { initSlideshow, changeSlides };
