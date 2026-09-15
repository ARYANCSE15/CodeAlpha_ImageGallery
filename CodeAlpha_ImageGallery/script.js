document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const caption = document.getElementById('caption');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const resetZoomBtn = document.getElementById('resetZoomBtn');
  const viewport = document.getElementById('viewport');

  let visibleCards = [];
  let currentIndex = 0;
  let currentZoom = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // 1. Update list of active cards
  function updateVisibleCards() {
    visibleCards = Array.from(document.querySelectorAll('.card:not(.hide)'));
  }

  // 2. Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });

      updateVisibleCards();
    });
  });

  updateVisibleCards();

  // 3. Heart Toggle
  document.querySelectorAll('.like-icon').forEach(heart => {
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      heart.classList.toggle('fa-regular');
      heart.classList.toggle('fa-solid');
    });
  });

  // 4. Zoom & Pan Transformations
  function applyTransform() {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  }

  function resetZoom() {
    currentZoom = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  // 5. Lightbox Display Function
  function showImage(index) {
    if (visibleCards.length === 0) return;

    if (index < 0) {
      currentIndex = visibleCards.length - 1;
    } else if (index >= visibleCards.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const selectedCard = visibleCards[currentIndex];
    const imgSrc = selectedCard.querySelector('.image-wrapper img').src;
    const titleText = selectedCard.querySelector('.card-title').textContent;

    lightboxImg.src = imgSrc;
    caption.textContent = titleText;

    resetZoom();
    lightbox.classList.add('active');
  }

  // Next / Previous Click Events
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // Manual Zoom Buttons
  zoomInBtn.addEventListener('click', () => {
    if (currentZoom < 3.5) {
      currentZoom += 0.3;
      applyTransform();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > 0.6) {
      currentZoom -= 0.3;
      applyTransform();
    }
  });

  resetZoomBtn.addEventListener('click', resetZoom);

  // Mouse Wheel Zooming inside Viewport
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      if (currentZoom < 3.5) currentZoom += 0.2;
    } else {
      if (currentZoom > 0.6) currentZoom -= 0.2;
    }
    applyTransform();
  });

  // Pan / Drag Image when Zoomed In
  lightboxImg.addEventListener('mousedown', (e) => {
    if (currentZoom <= 1) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Trigger Lightbox when Clicking Card Image or Zoom Icon
  cards.forEach(card => {
    const zoomIcon = card.querySelector('.zoom-icon');
    const imgWrapper = card.querySelector('.image-wrapper');

    const openHandler = () => {
      updateVisibleCards();
      const index = visibleCards.indexOf(card);
      if (index !== -1) showImage(index);
    };

    if (zoomIcon) zoomIcon.addEventListener('click', openHandler);
    if (imgWrapper) imgWrapper.addEventListener('click', openHandler);
  });

  // Close Lightbox
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === viewport) {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard Navigation Controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
});