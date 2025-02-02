let currentSlides = [];
let currentSlideIndex = 0;
let slideshowInterval = null;
const slideDuration = 5000;

function initSlideshow(slides) {
  currentSlides = slides;
  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
  if (slideshowInterval) clearInterval(slideshowInterval);
  slideshowInterval = setInterval(nextSlide, slideDuration);
}

function showSlide(index) {
  const slideshowImage = document.getElementById("slideshow-image");
  if (!slideshowImage) return;
  
  // Предзагрузка следующего изображения
  preloadNextImage();

  // Плавное скрытие изображения
  slideshowImage.style.opacity = 0;
  setTimeout(() => {
    slideshowImage.src = currentSlides[index];
    slideshowImage.onload = () => {
      // Используем requestAnimationFrame для плавного обновления
      requestAnimationFrame(() => {
        slideshowImage.style.opacity = 1;
      });
    };
  }, 500);
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
  showSlide(currentSlideIndex);
}

function preloadNextImage() {
  const nextIndex = (currentSlideIndex + 1) % currentSlides.length;
  const img = new Image();
  img.src = currentSlides[nextIndex];
}

function changeSlides(newSlides) {
  currentSlides = newSlides;
  currentSlideIndex = 0;
  showSlide(currentSlideIndex);
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, slideDuration);
  }
}

export { initSlideshow, changeSlides };
