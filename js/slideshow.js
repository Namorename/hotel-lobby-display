// Используем новую логику показа слайдов – проигрываем слайды один раз по порядку

let currentSlides = [];
let currentSlideIndex = 0;
let playTimeout = null;
const slideDuration = 5000; // время показа одного слайда (5 сек)
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
 * Плавно показывает слайд с заданным индексом.
 */
function showSlide(index) {
  const slideshowImage = document.getElementById("slideshow-image");
  if (!slideshowImage) return;
  
  // Устанавливаем переход прозрачности 0.5с
  slideshowImage.style.transition = 'opacity 0.5s ease-in-out';
  // Начинаем с затемнения
  slideshowImage.style.opacity = 0;
  
  setTimeout(() => {
    slideshowImage.src = currentSlides[index];
    slideshowImage.style.opacity = 1;
  }, 500); // через 500 мс меняем изображение
}

/**
 * Проигрывает один цикл слайдов (каждый слайд показывается slideDuration мс),
 * затем вызывает callback.
 */
function playSlidesOnce(slides, callback) {
  // Отменяем предыдущий цикл, если он был запущен
  if (playTimeout) clearTimeout(playTimeout);
  
  currentSlides = slides;
  preloadSlides(slides);
  currentSlideIndex = 0;
  
  // Сразу показываем первый слайд
  showSlide(currentSlideIndex);
  
  const totalSlides = slides.length;
  
  // Функция для показа следующего слайда
  function showNext() {
    currentSlideIndex++;
    if (currentSlideIndex < totalSlides) {
      showSlide(currentSlideIndex);
      playTimeout = setTimeout(showNext, slideDuration);
    } else {
      // Цикл показан полностью – вызываем callback, если он задан
      if (typeof callback === 'function') callback();
    }
  }
  
  playTimeout = setTimeout(showNext, slideDuration);
}

/**
 * Останавливает текущий цикл проигрывания слайдов.
 */
function cancelPlay() {
  if (playTimeout) clearTimeout(playTimeout);
}

export { playSlidesOnce, cancelPlay };
