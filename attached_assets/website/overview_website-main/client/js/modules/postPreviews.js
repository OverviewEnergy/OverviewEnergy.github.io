// NPM
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
class PostPreviews {
  constructor($section) {
    this.$section = $section;
    this.$swiper = $section.find('.swiper');
    this.initSwiper();
  }

  initSwiper() {
    this.swiper = new Swiper(this.$swiper[0], {
      slidesPerView: 1,
      spaceBetween: 30,
      modules: [Navigation],
      navigation: {
        nextEl: this.$section.find('[data-next]')[0],
        prevEl: this.$section.find('[data-prev]')[0],
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
      },
    });
  }

  kill() {
    this.swiper.destroy();
  }
};

export default PostPreviews;


