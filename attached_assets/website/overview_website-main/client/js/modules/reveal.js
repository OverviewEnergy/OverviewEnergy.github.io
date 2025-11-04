import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Reveal {
  constructor($section) {
    this.$section = $section;
    this.timelines = [];
    this.init();
  }

  init() {
    const $items = this.$section.find('[data-reveal-item]');
    $items.each((index, item) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          markers: false
        }
      });
      timeline.to(item, {
        opacity: 1,
        duration: 1,
        delay: index * 0.05,
      });
      this.timelines.push(timeline);
    });
  }

  kill() {
    this.timelines.forEach(timeline => timeline.kill());
  }
};

export default Reveal;


