/**
 * On Location Properties Theme -- shared interactive behavior.
 * Ported from the Caprock static site. Handles the mobile nav
 * toggle, the Community/Code-of-Conduct style accordion, and the
 * housing/dining image carousels. All selectors are scoped with
 * querySelectorAll + forEach so multiple module instances on one
 * page (e.g. more than one accordion) work independently.
 */
document.addEventListener('DOMContentLoaded', function () {
  var body = document.querySelector('body');
  var nav = document.getElementById('cs-navigation');
  var toggle = document.getElementById('mobile-menu-toggle');

  if (toggle && nav) {
    var toggleMenu = function () {
      toggle.classList.toggle('cs-active');
      nav.classList.toggle('cs-active');
      body.classList.toggle('cs-open');
    };

    toggle.addEventListener('click', function () {
      toggleMenu();
      toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
    });

    document.querySelectorAll('.cap-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('cs-active')) {
          toggleMenu();
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.classList.contains('cs-active')) {
        toggleMenu();
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ===================== ACCORDION =====================
  document.querySelectorAll('.cap-accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (panel) {
        panel.classList.toggle('cap-accordion-panel--open', !isExpanded);
      }
    });
  });

  // ===================== CAROUSEL =====================
  document.querySelectorAll('.cap-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.cap-carousel-track');
    var slides = carousel.querySelectorAll('.cap-carousel-slide');
    var dots = carousel.querySelectorAll('.cap-carousel-dot');
    var prevBtn = carousel.querySelector('.cap-carousel-btn--prev');
    var nextBtn = carousel.querySelector('.cap-carousel-btn--next');
    var total = slides.length;
    var current = 0;
    var autoTimer;

    if (!track || total === 0) return;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('cap-carousel-dot--active', i === current);
        dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function resetTimer() {
      clearInterval(autoTimer);
      if (total > 1) {
        autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
    });

    carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    carousel.addEventListener('mouseleave', resetTimer);
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(current - 1); resetTimer(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
    });

    resetTimer();
  });
});
