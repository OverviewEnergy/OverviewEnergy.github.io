// import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import lottie from 'lottie-web';
import imagesLoaded from 'imagesloaded';

import Breakpoints from './breakpoints';

class Media {
  constructor() {
    this.reinit();
    this.onResize = this.onResize.bind(this);
    window.addEventListener('breakpointChange', this.onResize);
  }

  reinit() {
    this.initLottie();
    this.initResponsiveVideos();
    this.initLoaded();
  }

  onResize() {
    this.initResponsiveVideos();
  }

  initLoaded() {
    $('.MediaItem--image').each((index, el) => {
      imagesLoaded(el, () => {
        $(el).addClass('MediaItem--loaded');
      });
    });
  }
  
  initResponsiveVideos() {
    const currentBreakpointIndex = Breakpoints.index;
    
    $('[data-responsive-video]').each((index, video) => {
      const $video = $(video);
      const $allSources = $('[data-src]', $video);
      
      let bestBreakpoint = 0;
      
      $allSources.each((i, source) => {
        const breakpoint = parseInt($(source).attr('data-breakpoint'));
        if (breakpoint <= currentBreakpointIndex &&
            breakpoint > bestBreakpoint) {
          bestBreakpoint = breakpoint;
        }
      });
      
      const $breakpointSources = $(`[data-breakpoint="${bestBreakpoint}"]`, $video);
      const $mp4 = $breakpointSources.filter('[data-type="video/mp4"]');
      const $webm = $breakpointSources.filter('[data-type="video/webm"]');
      
      let $theSource = $webm;
      if (this.isSafari()) $theSource = $mp4;
      if ($theSource.length === 0) return;

      const src = $theSource.attr('data-src');
      const currentSrc = $video.attr('src');

      if (!src) return;
      if (src === currentSrc) return;

      $video.attr({
        src,
        poster: $theSource.attr('data-poster'),
        autoplay: true
      });

      video.load();
    });
  }

  initLottie() {
    $('[data-lottie-src]').each((index, el) => {
      const $el = $(el);
      const src = $el.attr('data-lottie-src');
      
      const animation = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: src
      });

      // Switched from dotLottie-web to lottie-web for
      // performance reasons. Leaving dotLottie-web stuff
      // commented out for now, just in case.

      // const animation = new DotLottie({
      //   autoplay: true,
      //   loop: true,
      //   canvas: el,
      //   layout: {
      //     fit: 'contain',
      //     align: [0.5, 0.5]
      //   },
      //   src
      // });
      
      $.data(el, 'animation', animation);
    });
  }

  playVideo() {
    $('.MediaItem.MediaItem--video').each((index, el) => {
      const $el = $(el);
      const $video = $('video', $el);
      $video[0].play();
    });
  }

  isSafari() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isSafari;
  }

  sortVideoSources() {
    $('video').each((index, video) => {
      const $video = $(video);
      const $sources = $('source', $video);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const $mp4 = $('[type="video/mp4"]', $video);
      const $webm = $('[type="video/webm"]', $video);
      if (!isSafari && $webm.length > 0) {
        video.src = $webm.attr('src');
        video.load();
      }
    });
  }
};

export default Media;
