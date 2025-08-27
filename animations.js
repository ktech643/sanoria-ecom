// animations.js
(function(){
  const loader = document.getElementById('global-loader');
  // Simulate content loading
  window.addEventListener('load', () => {
    // hide skeletons after delay to simulate loading
    setTimeout(() => {
      document.querySelectorAll('.skeleton-card').forEach(card => card.classList.add('fade-out'));
      loader.classList.add('hidden');
    }, 1200);
  });

  /* Sticky Navbar hide/show on scroll */
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if(currentY > lastScrollY && currentY > 80) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    lastScrollY = currentY;
  });

  /* Footer reveal */
  const footer = document.getElementById('footer');
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        footer.classList.add('revealed');
        footerObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  footerObserver.observe(footer);

  /* Scroll to top button */
  const scrollBtn = document.getElementById('scrollTop');
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    if(window.scrollY > window.innerHeight) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  /* Skeleton fade-out keyframes */
  const style = document.createElement('style');
  style.textContent = `.fade-out{animation:fadeOut 0.6s forwards;}@keyframes fadeOut{to{opacity:0;height:0;margin:0;padding:0;}}`;
  document.head.appendChild(style);
})();