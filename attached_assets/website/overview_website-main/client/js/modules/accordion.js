class Accordion {
  constructor($section) {
    this.$section = $section;
    this.$accordions = $('[data-accordion]', $section);
    this.$accordions.each((index, el) => {
      const $accordion = $(el);
      this.initAccordion($accordion);
    });
  }

  initAccordion($accordion) {
    const $items = $('> [data-accordion-item]', $accordion);
    $items.each((index, el) => {
      const $item = $(el);
      const $toggle = $('> [data-accordion-toggle]', $item);
      $toggle.on('click', (e) => {
        e.preventDefault();
        const isOpen = $item.is("[data-accordion-item='open']");
        $items.attr('data-accordion-item', 'closed');
        if (!isOpen) {
          $item.attr('data-accordion-item', 'open');
        }
        this.updateAccordion($accordion);
      })
    });
  }

  updateAccordion($accordion) {
    let openHeight = 0;

    const $items = $('> [data-accordion-item]', $accordion);
    $items.each((index, el) => {
      const $item = $(el);
      const $body = $('> [data-accordion-body]', $item);
      const isOpen = $item.is("[data-accordion-item='open']");
      if (isOpen) {
        openHeight = $body[0].scrollHeight;
        $body[0].style.maxHeight = openHeight + 'px';
      } else {
        $body[0].style.maxHeight = '0';
      }
    });

    // Update parent accordion if this is a nested one
    const $parentAccordion = $accordion.closest('[data-accordion-item]');
    if ($parentAccordion.length) {
      const $parentBody = $parentAccordion.find('> [data-accordion-body]');
      if ($parentBody.length) {
        const isOpen = $parentAccordion.is("[data-accordion-item='open']");
        if (isOpen) {
          const currentHeight = parseInt($parentBody[0].style.maxHeight) || 0;
          const totalHeight = openHeight + currentHeight;
          $parentBody[0].style.maxHeight = totalHeight + 'px';
        }
      }
    }
  }

  kill()  {
  }
};

export default Accordion;


