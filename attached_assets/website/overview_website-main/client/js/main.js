// NPM
import Barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Modules
import PageSections from './modules/pageSections';
import Navigation from './modules/navigation';
import ScrollToAnchor from './modules/scrollToAnchor';
import Text from './modules/text';
import Media from './modules/media';
import Breakpoints from './modules/breakpoints';

const Main = {
  init() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    ScrollTrigger.config({
      ignoreMobileResize: true
    });

    Breakpoints.init();

    const navigation = new Navigation();
    const scrollToAnchor = new ScrollToAnchor();
    const text = new Text();
    const media = new Media();
    const pageSections = new PageSections();

    this.initHubspotEvents();

    Barba.init({
      debug: false,
      logLevel: 'error',
      requestError: (trigger, action, url, response) => {
        console.log(response);
      },
      prevent: ({ el, event }) => {
        if (event.defaultPrevented) return true;
      },
      transitions: [{
        name: 'default-transition',
        leave: (data) => {
          pageSections.killSections(data);
          return gsap.fromTo(data.current.container, {
            opacity: 1
          }, {
            opacity: 0,
            duration: 0.1
          });
        },
        enter: (data) => {
          // Drop the old page
          data.current.container.remove();

          // Re-init JS
          media.reinit(data);
          navigation.reinit(data);
          scrollToAnchor.reinit(data);
          text.reinit(data);
          pageSections.initSections(data);

          // Update body classes
          const parser = new DOMParser();
          const $html = $(parser.parseFromString(data.next.html, 'text/html'));
          const bodyClass = $('body', $html).attr('class');
          $('body').attr('class', bodyClass)

          // Scroll to top
          window.scrollTo(0, 0);

          // Reinit RichText scripts
          this.initRichTextScripts();

          // Show the new page
          return gsap.fromTo(data.next.container, {
            opacity: 0
          }, {
            opacity: 1,
            duration: 0.2
          });
        }
      }]
    });
  },

  initRichTextScripts() {
    const $scripts = $('.RichText script, .PostSection--postRichText script, .PostSection--postGate script');
    $scripts.each((index, el) => {
      const $script = $(el);
      const src = $script.attr('src');
      if (src) {
        $.ajax({
          url: src,
          dataType: 'script',
          async: false
        });
      }
      const scriptContent = $script.text();
      eval(scriptContent);
    })
  },

  initHubspotEvents() {
    window.addEventListener('message', (event) => {
      // Refresh scrollTriggers when HubSpot forms are initialized
      if (event.data.type === 'hsFormCallback' &&
          event.data.eventName === 'onFormReady') {
        ScrollTrigger.refresh(true);
      }

      // Scroll to top of section after submit
      if (event.data.type === 'hsFormCallback' &&
          event.data.eventName === 'onFormSubmitted') {
        const $form = $('.hbspt-form');
        const $section = $form.parents('.PageSection');
        if ($section.length > 0) {
          const top = $section.offset().top;
          $('html, body').stop().animate({ scrollTop: top });
        }
      }
    });
  }
}

$(() => {
  Main.init()
})