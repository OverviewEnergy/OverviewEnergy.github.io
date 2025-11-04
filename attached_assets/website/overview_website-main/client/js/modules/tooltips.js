class Tooltips {
  constructor($section) {
    this.$section = $section;
    this.$tooltips = $('[data-tooltip]', $section);
    this.$mobileContentContainer =
      $('[data-tooltip-mobile-content-container]', $section);
    this.$tooltips.each((index, el) => {
      const $tooltip = $(el);
      this.init($tooltip, index);
    });
  }

  init($tooltip, index) {
    const $toggle = $tooltip.find('[data-tooltip-toggle]');
    const $content = $tooltip.find('[data-tooltip-content]');
    const $mobileContent = this.$mobileContentContainer.find(
      '[data-tooltip-mobile-content]',
    ).eq(index);

    $toggle.on('click', (e) => {
      e.preventDefault();
      if ($tooltip.attr('data-tooltip') === 'open') {
        $tooltip.attr('data-tooltip', null);
        $mobileContent.attr('data-tooltip-mobile-content', null);
      } else {
        $tooltip.attr('data-tooltip', 'open');
        $mobileContent.attr('data-tooltip-mobile-content', 'open');
      }
    });

    $content.on('click', (e) => {
      e.preventDefault();
      if ($tooltip.attr('data-tooltip') === 'open') {
        $tooltip.attr('data-tooltip', null);
        $mobileContent.attr('data-tooltip-mobile-content', null);
      } else {
        $tooltip.attr('data-tooltip', 'open');
        $mobileContent.attr('data-tooltip-mobile-content', 'open');
      }
    });

    $mobileContent.on('click', (e) => {
      e.preventDefault();
      if ($mobileContent.attr('data-tooltip-mobile-content') === 'open') {
        $mobileContent.attr('data-tooltip-mobile-content', null);
        $tooltip.attr('data-tooltip', null);
      } else {
        $mobileContent.attr('data-tooltip-mobile-content', 'open');
        $tooltip.attr('data-tooltip', 'open');
      }
    });
  }

  kill()  {
  }
};

export default Tooltips;


