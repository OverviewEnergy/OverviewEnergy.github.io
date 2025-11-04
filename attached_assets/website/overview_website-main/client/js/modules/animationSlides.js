// NPM
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import debounce from 'debounce';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

// Local
import { ANIMATION_SCENES } from './animationScenes.js';

gsap.registerPlugin(ScrollTrigger);

const FADE_DURATION = 0.3;
const FADE_EASE = 'power1.out';
const DESKTOP_SLIDE_TRANSLATION = 20;
const MOBILE_SLIDE_TRANSLATION = 7;
const ADJACENT_TRANSITION_SPEED_MULTIPLIER = 2.5;

class AnimationSlides {
  constructor($section) {
    this.$section = $section;
    this.$animationSlides = $section.find('[data-animation-slide]');
    this.$animationContainer = $section.find('[data-animation]');
    this.slideCount = this.$animationSlides.length;
    this.timelines = [];

    // Configuration options
    this.jumpAdjacent = window.location.pathname.includes('/jump');

    // Animation state management
    this.currentScene = 0;
    this.animationState = 'looping'; // 'building' | 'looping'
    this.pendingScene = null;
    this.isScrolling = false;
    this.lottie = null;
    this.hasStarted = false;
    this.isLottieLoaded = false;
    this.activeTransition = null;

    this.initScrollTrigger();
    this.initLinks();
    this.initLottie();
    this.initResponsivePositioning();
  }

  initResponsivePositioning() {
    this.isPositioning = false;

    // Debounced resize handler with longer delay for stability
    this.debouncedResize = debounce(() => {
      this.updateAnimationPosition();
    }, 200);

    window.addEventListener('resize', this.debouncedResize);

    // Initial positioning with longer delay and RAF for DOM stability
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.updateAnimationPosition();
      });
    }, 250);
  }

  isSmallScreen() {
    return window.innerWidth < 1024; // lg breakpoint
  }

  resetSpacerHeights() {
    // Reset all spacer heights and flex-grow to their original state
    this.$animationSlides.each((index, el) => {
      const $spacer = $(el).find('[data-animation-slide-spacer]');
      if ($spacer.length) {
        $spacer[0].style.height = '';
        $spacer[0].style.flexGrow = '';
      }
    });
  }

  resizeSpacersToShortest() {
    // First reset all spacers to get their default sizes
    this.resetSpacerHeights();

    const spacers = [];

    // Get all spacer elements and their original heights
    this.$animationSlides.each((index, el) => {
      const $spacer = $(el).find('[data-animation-slide-spacer]');
      if ($spacer.length) {
        const rect = $spacer[0].getBoundingClientRect();
        spacers.push({
          element: $spacer[0],
          height: rect.height,
          width: rect.width
        });
      }
    });

    if (spacers.length === 0) return;

    // Find the shortest height
    let minHeight = Math.min(...spacers.map(s => s.height));

    // On small screens, check if the shortest spacer's aspect ratio would make it taller than 6/7
    if (this.isSmallScreen()) {
      const shortestSpacer = spacers.find(s => s.height === minHeight);
      if (shortestSpacer) {
        const aspectRatio = shortestSpacer.width / shortestSpacer.height;
        const maxAspectRatio = 6 / 7;

        if (aspectRatio < maxAspectRatio) {
          // Update height to maintain 6/7 aspect ratio
          minHeight = shortestSpacer.width / maxAspectRatio;
        }
      }
    }

    // Set all spacers to the shortest height and remove flex-grow
    spacers.forEach(spacer => {
      spacer.element.style.height = `${minHeight}px`;
      spacer.element.style.flexGrow = '0';
    });
  }

  getMostRestrictiveSpacerBounds() {
    const spacers = [];

    // Get all spacer elements and their bounds
    this.$animationSlides.each((index, el) => {
      const $spacer = $(el).find('[data-animation-slide-spacer]');
      if ($spacer.length) {
        const rect = $spacer[0].getBoundingClientRect();
        spacers.push({
          width: rect.width,
          height: rect.height,
          rect: rect
        });
      }
    });

    if (spacers.length === 0) return null;

    // Find the most restrictive (smallest) dimensions
    const minWidth = Math.min(...spacers.map(s => s.width));
    const minHeight = Math.min(...spacers.map(s => s.height));

    // Get the first spacer's position relative to the animation container's positioning context
    const firstSpacerRect = spacers[0].rect;
    const animationContainerOffsetParent = this.$animationContainer[0].offsetParent || document.body;
    const offsetParentRect = animationContainerOffsetParent.getBoundingClientRect();

    return {
      top: firstSpacerRect.top - offsetParentRect.top,
      left: firstSpacerRect.left - offsetParentRect.left,
      width: minWidth,
      height: minHeight
    };
  }

  updateAnimationPosition() {
    // Prevent concurrent positioning updates
    if (this.isPositioning) return;
    this.isPositioning = true;

    // Use requestAnimationFrame to ensure DOM is ready for measurements
    requestAnimationFrame(() => {
      try {
        if (!this.isSmallScreen()) {
          // Reset spacer heights when switching to larger screens
          this.resetSpacerHeights();

          // Reset to original Tailwind classes on larger screens
          this.$animationContainer.css({
            'position': '',
            'transform': '',
            'width': '',
            'height': '',
            'top': '',
            'left': ''
          });

          // Restore original non-lg Tailwind classes
          this.$animationContainer.addClass([
            'z-10', 'absolute', 'flex', 'items-center', 'justify-center',
            'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
            'aspect-[0.9/1]', 'h-auto', 'w-full', 'max-w-[70%]'
          ].join(' '));

          this.isPositioning = false;
          return;
        }

        this.performMobilePositioning();
      } catch (error) {
        console.error('Error in updateAnimationPosition:', error);
        this.isPositioning = false;
      }
    });
  }

  performMobilePositioning() {
    // First, resize all spacers to match the shortest one
    this.resizeSpacersToShortest();

    const spacerBounds = this.getMostRestrictiveSpacerBounds();
    if (!spacerBounds) {
      this.isPositioning = false;
      return;
    }

    // Calculate the maximum size that fits within the most restrictive spacer bounds
    // Maintain aspect ratio of 0.9/1 (width/height) as defined in the original CSS
    const targetAspectRatio = 0.9;
    const availableWidth = spacerBounds.width;
    const availableHeight = spacerBounds.height;

    let animationWidth, animationHeight;

    if (availableWidth / availableHeight > targetAspectRatio) {
      // Height is the limiting factor
      animationHeight = availableHeight;
      animationWidth = animationHeight * targetAspectRatio;
    } else {
      // Width is the limiting factor
      animationWidth = availableWidth;
      animationHeight = animationWidth / targetAspectRatio;
    }

    // Center the animation within the spacer bounds
    const animationLeft = spacerBounds.left + (availableWidth - animationWidth) / 2;
    const animationTop = spacerBounds.top + (availableHeight - animationHeight) / 2;

    // Remove only non-lg positioning classes, keep lg: classes intact
    const nonLgClasses = [
      'absolute', 'relative', 'fixed', 'sticky', 'static',
      'flex', 'items-center', 'justify-center',
      'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
      'aspect-[0.9/1]', 'h-auto', 'w-full', 'max-w-[70%]',
      'z-10'
    ];

    this.$animationContainer.removeClass(nonLgClasses.join(' '));

    // Apply positioning - use the spacer bounds directly
    this.$animationContainer.css({
      'position': 'absolute',
      'top': `${animationTop}px`,
      'left': `${animationLeft}px`,
      'width': `${animationWidth}px`,
      'height': `${animationHeight}px`,
      'transform': 'none'
    });

    // Allow another positioning update
    this.isPositioning = false;
  }

  initLottie() {
    const $lottie = this.$section.find('[data-lottie]');
    this.lottie = new DotLottieWorker(
      {
        canvas: $lottie[0],
        loop: false, // We'll control looping manually
        useFrameInterpolation: false,
        autoplay: true,
        speed: 1,
        src: new URL('/assets/lottie/solar.lottie?v=2', window.location.origin).href,
        workerId: 'solar',
        layout: {
          fit: 'contain',
          align: [0.5, 0.5]
        }
      }
    );

    this.lottie.addEventListener('load', () => {
      this.isLottieLoaded = true;

      // Set initial frame and pause
      this.lottie.setFrame(ANIMATION_SCENES[0].build.start);
      this.lottie.pause();

      // If we already tried to start the animation, do it now
      if (this.hasStarted) {
        // Use current scene, not scene 0
        if (this.currentScene === 0) {
          this.playSceneBuild(0);
        } else {
          // Jump directly to the current scene's loop
          this.startSceneLoop(this.currentScene);
        }
      }
    });

    this.lottie.addEventListener('frame', ({ currentFrame }) => {
      this.handleFrameUpdate(currentFrame);
    });
  }

  handleFrameUpdate(currentFrame) {
    const scene = ANIMATION_SCENES[this.currentScene];

    if (this.animationState === 'looping') {
      // Check if we've reached the end of the loop
      if (currentFrame >= scene.loop.end) {
        this.lottie.setFrame(scene.loop.start);
      }
    } else if (this.animationState === 'building') {
      // Check if build is complete
      if (currentFrame >= scene.build.end) {
        this.startSceneLoop(this.currentScene);
      }
    } else if (this.animationState === 'fast-transitioning') {
      // Fast transitioning is handled by the fastTransitionToScene method
      // This state is just for tracking purposes
    }
  }

  initScrollTrigger() {
    const $pinContainer = this.$section.closest('.PinContainer');

    // Debounced scroll stop handler
    const debouncedScrollStop = debounce(() => {
      this.handleScrollStop();
    }, 150);

    this.primaryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.$section,
        start: 'top top',
        end: `+=${(this.slideCount + 2) * 100}%`,
        scrub: true,
        pin: true,
        pinReparent: false,
        onUpdate: () => {
          this.updateCounter();
          this.isScrolling = true;
          debouncedScrollStop();
        },
        pinSpacer: $pinContainer[0]
      }
    });

    this.$animationSlides.each((index, el) => {
      const $slide = $(el);
      this.initSlideAnimation({
        $slide,
        timeline: this.primaryTimeline,
        index
      });
    });

    this.timelines.push(this.primaryTimeline);
  }

    handleScrollStop() {
    this.isScrolling = false;
    if (this.pendingScene !== null) {
      // Cancel any active transition before jumping
      if (this.activeTransition) {
        this.activeTransition.cancel = true;
        this.activeTransition = null;
      }

      // Check if pending scene is adjacent for fast transition
      const distance = Math.abs(this.pendingScene - this.currentScene);
      if (distance === 1) {
        if (this.jumpAdjacent) {
          this.jumpToScene(this.pendingScene);
        } else {
          this.fastTransitionToScene(this.pendingScene);
        }
      } else {
        this.jumpToScene(this.pendingScene);
      }
      this.pendingScene = null;
    }
  }

  updateCounter() {
    const $animation = this.$section.find('[data-animation]');
    const $counter = $animation.find('span');
    const progress = this.primaryTimeline.scrollTrigger.progress;
    $counter.text(`${Math.round(progress * 100)}%`);
  }

  initLinks() {
    this.$animationSlides.each((index, el) => {
      const $slide = $(el);
      const $link = $slide.find('a[href^="#"]');
      if ($link.length) {
        $link.on('click', (e) => {
          e.preventDefault();
          const nextProgress = (index + 1) / (this.slideCount - 1);
          const scrollStart = this.primaryTimeline.scrollTrigger.start;
          const scrollEnd = this.primaryTimeline.scrollTrigger.end;
          const scrollDistance = scrollEnd - scrollStart;
          const targetScroll = scrollStart + (scrollDistance * nextProgress);
          window.scrollTo({
            top: targetScroll, behavior: 'smooth'
          });
        });
      }
    });
  }

  initSlideAnimation({ $slide, timeline, index }) {
    const position = index;

    // Reveal the slide (and hide the previous slide)
    timeline.add(() => {
      this.activateSlide({ index });
    }, position);

    // Add translation to the slide - smaller movement on mobile
    const translationAmount = this.isSmallScreen() ?
      MOBILE_SLIDE_TRANSLATION : DESKTOP_SLIDE_TRANSLATION;

      timeline.fromTo(
      $slide,
      { y: translationAmount },
      { y: -translationAmount, duration: 1, ease: 'none' },
      position
    );
  }

    activateSlide({ index }) {
    const direction = this.primaryTimeline.scrollTrigger.direction;
    let inIndex;
    let outIndex;

    if (direction === 1) {
      inIndex = index;
      outIndex = index - 1;
    } else {
      inIndex = index - 1;
      outIndex = index;
    }

        // Handle initial animation start
    if (!this.hasStarted && inIndex === 0) {
      this.hasStarted = true;

      // Only start animation if Lottie is loaded
      if (this.isLottieLoaded) {
        this.playSceneBuild(0);
      }
      return;
    }

        // Handle scene changes
    if (inIndex >= 0 && inIndex < this.slideCount && inIndex !== this.currentScene) {
      if (this.isScrolling && this.shouldDebounceTransition(inIndex)) {
        // Cancel any active transition when debouncing
        if (this.activeTransition) {
          this.activeTransition.cancel = true;
          this.activeTransition = null;
        }

        this.pendingScene = inIndex;
      } else {
        // Check if this is an adjacent section transition
        const distance = Math.abs(inIndex - this.currentScene);
        if (distance === 1) {
          if (this.jumpAdjacent) {
            this.jumpToScene(inIndex);
          } else {
            this.fastTransitionToScene(inIndex);
          }
        } else {
          this.transitionToScene(inIndex);
        }
      }
    }

    // Animate in
    if (inIndex >= 0 && inIndex < this.slideCount) {
      const $inSlide = this.$animationSlides.eq(inIndex);
      gsap.to(
        $inSlide,
        {
          opacity: 1,
          pointerEvents: 'auto',
          duration: FADE_DURATION,
          ease: FADE_EASE
        }
      );
    }

    // Animate out
    if (outIndex >= 0 && outIndex < this.slideCount) {
      // If the direction is up and the out index is
      // the first slide, don't animate out
      const upAndFirst = direction == -1 && outIndex == 0;
      if (!upAndFirst) {
        const $outSlide = this.$animationSlides.eq(outIndex);
        gsap.to(
          $outSlide,
          {
            opacity: 0,
            pointerEvents: 'none',
            duration: FADE_DURATION,
            ease: FADE_EASE
          }
        );
      }
    }
  }

  shouldDebounceTransition(targetScene) {
    // Debounce for reverse scrolling or rapid scene changes
    const direction = this.primaryTimeline.scrollTrigger.direction;
    const isReverse = direction === -1;
    const isRapidChange = Math.abs(targetScene - this.currentScene) > 1;

    return isReverse || isRapidChange;
  }

  transitionToScene(targetScene) {
    if (!this.lottie || targetScene < 0 || targetScene >= ANIMATION_SCENES.length) {
      return;
    }

    // If Lottie isn't loaded yet, just update current scene and wait
    if (!this.isLottieLoaded) {
      this.currentScene = targetScene;
      return;
    }

    // Safety measure: Reset speed for standard transitions
    this.resetAnimationSpeed();

    // Cancel any existing transition
    if (this.activeTransition) {
      this.activeTransition.cancel = true;
    }

    // Create new transition tracker
    const transition = { cancel: false, targetScene };
    this.activeTransition = transition;

    if (this.animationState === 'looping') {
      // Wait for current loop to complete, then transition
      this.waitForLoopCompletion(this.currentScene, transition).then(() => {
        if (!transition.cancel) {
          this.playSceneBuild(targetScene);
        }
      });
    } else if (this.animationState === 'building') {
      // Let current build finish, then transition
      this.waitForBuildCompletion(this.currentScene, transition).then(() => {
        if (!transition.cancel) {
          this.playSceneBuild(targetScene);
        }
      });
    }
  }

  fastTransitionToScene(targetScene) {
    if (!this.lottie || targetScene < 0 || targetScene >= ANIMATION_SCENES.length) {
      return;
    }

    // If Lottie isn't loaded yet, just update current scene and wait
    if (!this.isLottieLoaded) {
      this.currentScene = targetScene;
      return;
    }

    // Cancel any existing transition
    if (this.activeTransition) {
      this.activeTransition.cancel = true;
    }

    // Create new transition tracker
    const transition = { cancel: false, targetScene };
    this.activeTransition = transition;

    const targetScene_obj = ANIMATION_SCENES[targetScene];
    const targetBuildStart = targetScene_obj.build.start;

    // Speed up the animation to reach the target build start
    this.setAnimationSpeed(ADJACENT_TRANSITION_SPEED_MULTIPLIER);
    this.animationState = 'fast-transitioning';

    // Create a promise that resolves when we reach the target build start
    const reachTargetBuildStart = new Promise((resolve) => {
      const startTime = Date.now();
      const maxWaitTime = 3000; // 3 second safety timeout
      
      const checkFrame = () => {
        if (transition.cancel) {
          this.resetAnimationSpeed();
          resolve();
          return;
        }

        // Safety timeout to prevent infinite waiting
        if (Date.now() - startTime > maxWaitTime) {
          this.resetAnimationSpeed();
          this.jumpToScene(targetScene);
          resolve();
          return;
        }

        const currentFrame = this.lottie.currentFrame;
        
        // Check if we've reached or passed the target build start
        if (currentFrame >= targetBuildStart) {
          resolve();
        } else {
          requestAnimationFrame(checkFrame);
        }
      };
      checkFrame();
    });

    // Start playing towards the target
    this.lottie.play();

    // When we reach the target build start, reset speed and start normal build
    reachTargetBuildStart.then(() => {
      if (!transition.cancel) {
        this.resetAnimationSpeed();
        this.playSceneBuild(targetScene);
      }
    });
  }

  jumpToScene(targetScene) {
    if (!this.lottie || targetScene < 0 || targetScene >= ANIMATION_SCENES.length) {
      return;
    }

    // Safety measure: Always reset speed when jumping to a scene
    this.resetAnimationSpeed();
    this.currentScene = targetScene;
    this.startSceneLoop(targetScene);
  }

  playSceneBuild(targetScene) {
    const scene = ANIMATION_SCENES[targetScene];
    this.currentScene = targetScene;
    this.animationState = 'building';

    // Safety measure: Ensure speed is reset for build animations
    this.resetAnimationSpeed();
    this.lottie.setFrame(scene.build.start);
    this.lottie.play();
  }

  startSceneLoop(targetScene) {
    const scene = ANIMATION_SCENES[targetScene];
    this.currentScene = targetScene;
    this.animationState = 'looping';

    // Safety measure: Ensure speed is reset for loop animations
    this.resetAnimationSpeed();
    this.lottie.setFrame(scene.loop.start);
    this.lottie.play();
  }

  setAnimationSpeed(speed) {
    if (this.lottie && this.lottie.setSpeed) {
      this.lottie.setSpeed(speed);
    }
  }

  resetAnimationSpeed() {
    this.setAnimationSpeed(1);
  }

      waitForLoopCompletion(sceneIndex, transition) {
    return new Promise((resolve) => {
      const scene = ANIMATION_SCENES[sceneIndex];

      const checkFrame = () => {
        if (transition.cancel) {
          resolve();
          return;
        }

        const currentFrame = this.lottie.currentFrame;
        // Check if we're in a completely different scene (animation jumped ahead)
        if (currentFrame < scene.loop.start || currentFrame > scene.loop.end + 50) {
          resolve();
          return;
        }

        if (currentFrame >= scene.loop.end - 1) {
          resolve();
        } else {
          requestAnimationFrame(checkFrame);
        }
      };
      checkFrame();
    });
  }

      waitForBuildCompletion(sceneIndex, transition) {
    return new Promise((resolve) => {
      const scene = ANIMATION_SCENES[sceneIndex];

      const checkFrame = () => {
        if (transition.cancel) {
          resolve();
          return;
        }

        const currentFrame = this.lottie.currentFrame;
        // Check if we're in a completely different scene (animation jumped ahead)
        if (currentFrame < scene.build.start || currentFrame > scene.build.end + 200) {
          // Don't start the loop for the wrong scene
          resolve();
          return;
        }

        if (currentFrame >= scene.build.end - 1) {
          // Only start loop if transition hasn't been canceled
          if (!transition.cancel) {
            this.startSceneLoop(sceneIndex);
          }
          resolve();
        } else {
          requestAnimationFrame(checkFrame);
        }
      };
      checkFrame();
    });
  }

  kill() {
    this.timelines.forEach((timeline) => {
      timeline.kill();
    });
    this.timelines = [];

    if (this.lottie) {
      this.resetAnimationSpeed();
      this.lottie.destroy();
    }

    // Clean up resize handler
    if (this.debouncedResize) {
      window.removeEventListener('resize', this.debouncedResize);
    }
  }
}

export default AnimationSlides;


