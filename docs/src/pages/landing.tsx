import logoImage from '@assets/Horizontal Black_1762007292488.png';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/satellite-earth.webp)',
          backgroundPosition: '75% center'
        }}
        data-testid="bg-satellite"
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo and Nav Links */}
        <header className="w-full px-6 lg:px-12 py-6 lg:py-8 flex flex-col lg:flex-row items-start lg:items-start justify-between gap-6 lg:gap-0">
          {/* Logo - Top Left */}
          <a href="/" className="flex-shrink-0" data-testid="link-home">
            <img 
              src={logoImage} 
              alt="Company Logo" 
              className="h-8 lg:h-10 w-auto object-contain brightness-0 invert"
              data-testid="img-logo"
            />
          </a>

          {/* Navigation Links - Top Right on desktop, stacked on mobile */}
          <nav className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6" data-testid="nav-main">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScbVg4ouP9L1DLqHT6NqJ0c_Vmfl8TPTSKDIw-2Ea9yVV1xkw/viewform"
              className="text-sm lg:text-base text-white hover:text-white/80 transition-colors font-medium tracking-[0.16px] whitespace-nowrap"
              style={{ fontFamily: 'HelveticaNowText, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              data-testid="link-partner"
            >
              Partner with Us
            </a>

            <span className="hidden lg:inline text-white/60 text-sm lg:text-base" aria-hidden="true">|</span>

            <a
              href="https://jobs.ashbyhq.com/overviewenergy"
              className="text-sm lg:text-base text-white hover:text-white/80 transition-colors font-medium tracking-[0.16px] whitespace-nowrap"
              style={{ fontFamily: 'HelveticaNowText, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              data-testid="link-careers"
            >
              Explore Open Roles
            </a>

            <span className="hidden lg:inline text-white/60 text-sm lg:text-base" aria-hidden="true">|</span>

            <a
              href="https://www.linkedin.com/company/overviewenergy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm lg:text-base text-white hover:text-white/80 transition-colors font-medium tracking-[0.16px] whitespace-nowrap"
              style={{ fontFamily: 'HelveticaNowText, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              data-testid="link-linkedin"
            >
              LinkedIn
            </a>
          </nav>
        </header>

        {/* Spacer to push tagline to bottom */}
        <div className="flex-1" />

        {/* Tagline at Bottom */}
        <section className="w-full px-6 lg:px-12 pb-12 lg:pb-16">
          <h1 
            className="text-[40px] leading-[1.15] lg:text-[80px] lg:leading-[1.1] font-medium tracking-[-0.8px] lg:tracking-[-1.6px] text-white max-w-5xl"
            style={{ fontFamily: 'HelveticaNowDisplay, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            data-testid="text-tagline"
          >
            Space Energy for Earth
          </h1>
        </section>
      </div>
    </div>
  );
}
