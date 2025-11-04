class ScrollToAnchor {
  constructor() {
    this.reinit();
  }

  reinit() {
    const hash = $(location).attr('hash');
    const pathname = $(location).attr('pathname');

    $('a').off('click', this.clickHandler);
    $('a[href^="#"]').on('click', this.clickHandler);
    $(`a[href^="${pathname}#"]`).on('click', this.clickHandler);

    if (hash.includes('/')) return;

    const $target = $(hash);
    if ($target.length > 0) {
      const top = $target.offset().top;
      setTimeout(() => {
        $('html, body').stop().animate({ scrollTop: top });
      }, 200);
    }
  }

  clickHandler(e) {
    e.preventDefault();
    const pathname = $(location).attr('pathname');
    const $el = $(e.currentTarget);
    let link = $el.attr('href');
    link = link.replace(pathname, '');
    link = link.replace('/', '');
    if (link === '#') return;
    let $target = $(`${link}`);

    if ($target.is('[data-accordion-item]')) {
      const $toggle = $('> [data-accordion-toggle]', $target);
      $toggle.trigger('click');
    }

    // Delay offset calculation to allow animation slides positioning to complete
    setTimeout(() => {
      const top = $target.offset().top;
      $('html, body').stop().animate({ scrollTop: top });
    }, 300); // Increased from 200ms to 300ms to account for AnimationSlides delay
  }
};

export default ScrollToAnchor;
