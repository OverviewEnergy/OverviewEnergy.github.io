// NPM
import { lock, unlock } from 'tua-body-scroll-lock';
import { gsap } from 'gsap';

class Navigation {
  constructor() {
    this.$header = $('Header');
    this.$hamburger = $('[data-hamburger]');
    this.$mobileNav = $('[data-mobile-nav]');
    this.$backdrop = $('[data-header-backdrop]');
    this.init();
  }

  init() {
    this.initHamburger();
  }

  reinit(data) {
    this.updateNavTheme(data);
  }

  initHamburger() {
    const $primaryLinks = this.$mobileNav.find('.Header-mobileLinks a');
    const $mobileLinks = this.$mobileNav.find('a');

    const handleTransitionEnd = () => {
      if (this.$hamburger.attr('data-hamburger') === 'true') {
        gsap.fromTo(this.$mobileNav, {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 0.1,
          ease: 'power2.inOut',
        });

        gsap.fromTo($primaryLinks, {
          opacity: 0,
          x: 20,
        }, {
          opacity: 1,
          x: 0,
          duration: 0.2,
          ease: 'power2.inOut',
          stagger: 0.05,
        });

        return;
      }

      gsap.set(this.$mobileNav, {
        opacity: 0
      });
    };

    this.$hamburger.on('click', () => {
      const isOpen = this.$hamburger.attr('data-hamburger') === 'true';
      if (isOpen) {
        this.$hamburger.attr('data-hamburger', 'false');
        this.$header.attr('data-header-open', 'false');
        unlock(this.$header[0]);
      } else {
        this.$hamburger.attr('data-hamburger', 'true');
        this.$header.attr('data-header-open', 'true');
        this.$backdrop[0].removeEventListener('transitionend', handleTransitionEnd);
        this.$backdrop[0].addEventListener('transitionend', handleTransitionEnd);
        lock(this.$header[0]);
      }
    });

    $mobileLinks.on('click', () => {
      this.$hamburger.attr('data-hamburger', 'false');
      this.$header.attr('data-header-open', 'false');
      unlock(this.$header[0]);
    });
  }

  updateNavTheme(data) {
    const $nextHeader = $(data.next.html).filter('.Header');
    const classes = $nextHeader.attr('class');
    $('.Header').attr('class', classes);
  }
}

export default Navigation;