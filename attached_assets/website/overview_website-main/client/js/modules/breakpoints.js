import gsap from  'gsap';

const Breakpoints = {
  index: null,
  current: null,
  init: () => {
    const matchMedia = gsap.matchMedia();
    const tablet = 640;
    const desktop = 1024;
    const desktopXL = 1200;

    
    // Mobile
    matchMedia.add(`(max-width: ${tablet - 1}px)`, () => {
      Breakpoints.current = 'mobile';
      Breakpoints.index = 0;
      Breakpoints.dispatch();
    });
    
    // Tablet
    matchMedia.add(`(min-width: ${tablet}px) and (max-width: ${desktop - 1}px)`, () => {
      Breakpoints.current = 'tablet';
      Breakpoints.index = 1;
      Breakpoints.dispatch();
    });

    // Desktop
    matchMedia.add(`(min-width: ${desktop}px) and (max-width: ${desktopXL - 1}px)`, () => {
      Breakpoints.current = 'desktop';
      Breakpoints.index = 2;
      Breakpoints.dispatch();
    });

    // Desktop XL
    matchMedia.add(`(min-width: ${desktopXL}px)`, () => {
      Breakpoints.current = 'desktopXL';
      Breakpoints.index = 3;
      Breakpoints.dispatch();
    });
  },

  dispatch: () => {
    const e = new CustomEvent('breakpointChange', {
      detail: {
        current: Breakpoints.current,
        index: Breakpoints.index 
      }
    });
    window.dispatchEvent(e);
  }
}

export default Breakpoints;
