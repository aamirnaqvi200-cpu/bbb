import { useEffect, useRef, useState } from 'react';
import VideoThumbnail from "./components/VideoThumbnail";
import { ClickWrapper } from "./components/ClickWrapper";
import { Mail, Instagram, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroDesign } from './components/HeroDesign';
import heroDesktopHtml from './hero/hero-desktop.html?raw';
import heroMobileHtml from './hero/hero-mobile.html?raw';

gsap.registerPlugin(ScrollTrigger);

function setMobileVH() {
  if (window.innerWidth < 768) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
  }
}

const isMobile = () => window.innerWidth < 768;

interface HeroImage {
  src: string;
  delay?: number;
  isStatic?: boolean;
  zIndex?: number;
  scrollTo?: string;
  href?: string;
  isSmall?: boolean;
  noHover?: boolean;
}

const mobileImages: HeroImage[] = [
  { src: '/mobile/mbme.webp',      isStatic: true, zIndex: 11, },
  { src: '/mobile/mbme.webp',      isStatic: true,              zIndex: 10, scrollTo: '#portfolio' },
];

const desktopImages: HeroImage[] = [
  { src: '/pc/me.webp',    delay: 2.2, isStatic: true,  noHover: false,},
  { src: '/pc/me 2.webp',  delay: 2.4, isStatic: true,  noHover: false, },
];

// Fixed canvas sizes of the exported hero designs
const HERO_DESKTOP = { width: 4591, height: 2350 };
const HERO_MOBILE  = { width: 1080, height: 1920 };

const socialVideos = Array.from({ length: 12 }, (_, i) =>
  `https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/reels/${i + 1}.webm`
);

const featuredVideos = [
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/1.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/2.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/3.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/4.mp4",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/5.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/6.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/7.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/8.webm",
  "https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2%2C5%2C6%2C8%2C9/9.webm",
];

const stats = [
  { value: '3+', label: 'Years Experience'},
  { value: '99+', label: 'Projects Delivered' },
  { value: '12', label: 'Social Formats' },
  { value: '20+', label: 'Happy Clients' },
];

const skills = [
  { name: 'Motion Design'},
  { name: 'Brand Films'},
  { name: 'Social Content'},
  { name: 'Visual Identity'},
  { name: 'Art Direction'},
  { name: 'Storytelling'},
];

function App() {
  const [showContact, setShowContact] = useState(false);
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroImages = isMobile()
      ? ['/mobile/mbbg.webp', '/mobile/mbme.webp']
      : ['/pc/bg.webp', '/pc/me.webp', '/pc/me 2.webp'];

    const loaded = new Set<string>();
    const checkDone = () => {
      if (loaded.size === heroImages.length) {
        requestAnimationFrame(() => {
          setReady(true);
          const loader = document.getElementById('initial-loader');
          if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 600);
          }
        });
      }
    };

    heroImages.forEach((src) => {
      const img = new Image();
      img.onload = () => { loaded.add(src); checkDone(); };
      img.onerror = () => { loaded.add(src); checkDone(); };
      img.src = src;
    });

    const timeout = setTimeout(() => {
      setReady(true);
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 600);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setMobileVH();
    const update = () => setMobileVH();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.addEventListener('scroll', setMobileVH);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.removeEventListener('scroll', setMobileVH);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (!portfolioSectionRef.current) return;

    const mobile = isMobile();
    const desktopEls = gsap.utils.toArray(".desktop-image");
    const mobileEls  = gsap.utils.toArray(".mobile-image");

    gsap.to(desktopEls, {
      opacity: 0,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "center top", end: "top top", scrub: 0 }
    });
    gsap.to(mobileEls, {
      opacity: 0,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top top", end: "top center", scrub: 0 }
    });
    const desktopParallaxEls = desktopEls.filter((el: Element) => !el.classList.contains('no-parallax-y'));
    gsap.timeline({
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 }
    }).to(desktopParallaxEls, { y: 200, ease: "power1.out" });

    gsap.to(portfolioSectionRef.current, {
      y: mobile ? -900 : -900,
      scrollTrigger: { trigger: portfolioSectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 }
    });

    ScrollTrigger.create({
      trigger: portfolioSectionRef.current, start: "center bottom", fastScrollEnd: true,
      onEnter: () => setShowContact(true), onLeaveBack: () => setShowContact(false),
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const vh = (n: number) => window.innerWidth < 768 ? `calc(var(--mobile-vh) * ${n})` : `${n}vh`;

  return (
    <div className="relative" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease-out' }}>
{/* Fixed background — desktop */}
      <ClickWrapper
        className="fixed inset-0 z-0 bg-interactive hidden md:block"
        scrollTo="#portfolio"
        glowColor="rgba(255,255,255,0.15)"
        noHover
        style={{
          backgroundImage: `url('/pc/bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />
      </ClickWrapper>

      {/* Fixed background — mobile */}
      <ClickWrapper
        className="fixed inset-0 z-0 bg-interactive md:hidden"
        scrollTo="#portfolio"
        glowColor="rgba(255,255,255,0.15)"
        noHover
        style={{
          backgroundImage: `url('/mobile/mbbg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />
      </ClickWrapper>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden bg-transparent"
        style={{ minHeight: vh(100), height: vh(100) }}
      >
        {/* Mobile layers */}
        <div className="md:hidden">
          {mobileImages.map((img, index) => (
            <ClickWrapper
              key={index}
              href={img.href}
              scrollTo={img.scrollTo}
              glowColor="rgba(201,168,76,0.3)"
              noHover
              className="mobile-image hero-image-layer fixed overflow-hidden"
              style={{
                ...(img.isStatic
                  ? { inset: 0, width: '100%', height: '100%', zIndex: img.zIndex }
                  : {
                      inset: 0, width: '100%', height: '100%',
                      zIndex: img.zIndex,
                      animation: `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: 'translateY(100vh)',
                    })
              }}
            >
              <img src={img.src} alt="" decoding="async" className="w-full h-full object-contain" />
            </ClickWrapper>
          ))}

          {/* Mobile-only hero design (mobile.html) */}
          <HeroDesign
            html={heroMobileHtml}
            width={HERO_MOBILE.width}
            height={HERO_MOBILE.height}
            fit="contain"
            className="mobile-image hero-image-layer fixed no-parallax-y"
            style={{ inset: 0, width: '100%', height: '100%', zIndex: 20 }}
          />
        </div>

        {/* Desktop layers */}
        <div className="hidden md:block">
          {desktopImages.map((img, index) => (
            <ClickWrapper
              key={index}
              href={img.href}
              scrollTo={img.scrollTo}
              glowColor="rgba(201,168,76,0.3)"
              noHover
              className={`desktop-image hero-image-layer fixed overflow-hidden ${img.isSmall ? 'name-hover' : ''}`}
              style={{
                ...(img.isSmall
                  ? {
                      top: -10, left: -30, width: '38%', maxWidth: 520, height: 'auto', zIndex: 50,
                      animation: `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: 'translateY(100vh)',
                    }
                  : {
                      inset: 0, width: '100%', height: '100%',
                      zIndex: img.isStatic ? 0 : index + 10,
                      animation: img.isStatic ? 'none' : `slideUp 1s ease-out ${img.delay}s forwards`,
                      transform: img.isStatic ? 'translateY(0)' : 'translateY(100vh)',
                    })
              }}
            >
              <img src={img.src} alt="" decoding="async" className={img.isSmall ? 'w-full h-auto' : 'w-full h-full object-contain'} />
            </ClickWrapper>
          ))}

          {/* Desktop-only hero design (hm (1).html) */}
          <HeroDesign
            html={heroDesktopHtml}
            width={HERO_DESKTOP.width}
            height={HERO_DESKTOP.height}
            fit="contain"
            className="desktop-image hero-image-layer fixed no-parallax-y"
            style={{ inset: 0, width: '100%', height: '100%', zIndex: 20 }}
          />
        </div>

        {/* Scroll indicator arrow */}
        <div
          className="bounce-arrow absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2"
          onClick={() => {
            const el = document.querySelector('#portfolio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="scroll-circle-btn">
        <ChevronDown className="w-5 h-5 text-[#8A1212]" strokeWidth={2} />
          </div>
         <span className="text-[#181F21] text-[10px] uppercase tracking-[0.25em] font-bold ibm-font drop-shadow-[0_2px_6px_rgba(233,227,215,0.9)]">
  Scroll Down
</span>
        </div>
      </div>


      {/* Portfolio Panel */}
      <div
        ref={portfolioSectionRef}
        id="portfolio"
        className="relative w-full portfolio-panel z-[9999]"
        style={{
          minHeight: vh(100),
          boxShadow: `0 -30px 80px -10px rgba(255,255,255,0.12), 0 -60px 120px -20px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 80px -10px rgba(0,0,0,0.35)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">

          {/* Header */}
          <div className="text-center mb-20">
        
              <h2 className="syne text-black/90 mb-5 leading-none interactive-heading"
                  style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.04em' }}>
                PORTFOLIO
              </h2>
          
          
         
              <p className="ibm-font text-black/55 max-w-2xl mx-auto text-base md:text-lg leading-relaxed interactive-text">
                Visual stories crafted to move people — from scroll-stopping reels to brand-defining films.
              </p>
         

            {/* Skill tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {skills.map((s) => (
                <ClickWrapper
                  key={s.name}
                
                  glowColor="rgba(201,168,76,0.3)"
                  className="tag-pill"
                >
                  {s.name}
                </ClickWrapper>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((s, i) => (
              <ClickWrapper
                key={i}
               
                glowColor="rgba(201,168,76,0.4)"
                className="stat-card glow-border"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  animationDelay: `${i * 0.4}s`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div className="syne font-bold text-black/90 stat-number-pulse"
                     style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', animationDelay: `${i * 0.4}s` }}>
                  {s.value}
                </div>
                <div className="ibm-font text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--warm-gray)' }}>
                  {s.label}
                </div>
              </ClickWrapper>
            ))}
          </div>

          {/* Showreel */}
          <div className="mb-20">
            <ClickWrapper
              scrollTo="#showreel"
              glowColor="rgba(201,168,76,0.3)"
              className="section-rule section-rule-interactive"
            >
              <span className="syne text-sm font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                SHOW REEL
              </span>
            </ClickWrapper>
            <div id="showreel" className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
                 style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <VideoThumbnail
                src="https://cdn.jsdelivr.net/gh/Aamirnaqvi-mal/Videos@main/Portfolio/long/2,5,6,8,9/1.mp4"
                title="SHOW REEL 2026"
                isShowreel={true}
                thumbnailIndex={1}
              />
            </div>
          </div>

          {/* Social Content */}
          <div className="mb-20">
            <ClickWrapper
              scrollTo="#social"
              glowColor="rgba(201,168,76,0.3)"
              className="section-rule section-rule-interactive"
            >
              <span className="syne text-sm font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                SOCIAL CONTENT
              </span>
            </ClickWrapper>
            <div id="social" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {socialVideos.map((url, i) => (
                <VideoThumbnail
                  key={i}
                  src={url}
                  title={`REEL ${String(i + 1).padStart(2, '0')}`}
                  aspectRatio="vertical"
                  thumbnailIndex={i + 11}
                />
              ))}
            </div>
          </div>

          {/* Featured Work */}
          <div className="mb-20">
            <ClickWrapper
              scrollTo="#featured"
              glowColor="rgba(201,168,76,0.3)"
              className="section-rule section-rule-interactive"
            >
              <span className="syne text-sm font-semibold tracking-[0.25em] uppercase text-black/40 flex items-center gap-2">
                <span className="gold-dot" />
                FEATURED WORK
              </span>
            </ClickWrapper>
            <div id="featured" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredVideos.map((url, i) => (
                <VideoThumbnail
                  key={i}
                  src={url}
                  title={`PROJECT ${String(i + 1).padStart(2, '0')}`}
                  isShowreel={false}
                  thumbnailIndex={i + 2}
                />
              ))}
            </div>
          </div>

          {/* Bottom disclaimer */}
            <p className="text-center ibm-font text-xs mt-12 pb-4" >
              All content is original work. Brands and clients belong to their respective owners.
            </p>
        </div>
      </div>

       {/* Contact Section */}
      {showContact && (
        <div
          id="contact-section"
          className="fixed bottom-0 left-0 right-0 w-full overflow-hidden flex flex-col items-center justify-center z-30 bg-transparent opacity-0 animate-fade-in-delayed contact-fluid"
          style={{
            height: window.innerWidth < 768 ? 'calc(var(--mobile-vh) * 100)' : '100vh',
            animationDelay: '0.2s',
            animationFillMode: 'forwards',
            pointerEvents: 'auto'
          }}
        >
         {/* Main Heading */}
          <h2 className="font-bosenAlt text-[#181f22] text-center tracking-wide contact-heading">
            LET'S START A CONVERSATION
          </h2>

         {/* Subheading */}
          <p className="text-[#181f22] ibm-font text-center contact-subheading">
            Drop me a message, let's make something users will love.
          </p>

          <div className="text-center w-full contact-links-group">
            {/* Email */}
            <div className="flex flex-col items-center contact-link-block">
              <Mail className="text-[#181f22] contact-icon" />
              <a
                href="https://mail.google.com/mail/?view=cm&to=Aamirnaqvi03@gmail.com" target="_blank"
                className="text-[#181f22] font-bosenAlt tracking-wide hover:text-blue-500 transition-colors duration-200 break-words contact-link-text"
              >
                AAMIRNAQVI03@GMAIL.COM
              </a>
              <p className="text-[#181f22] ibm-font text-center contact-link-desc">
                Let's create something that actually works.
              </p>
            </div>

            {/* Whatsapp */}
            <div className="flex flex-col items-center contact-link-block">
              <svg className="text-[#181f22] contact-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <a
                href="https://wa.link/uhhv7i"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#181f22] font-bosenAlt tracking-wide hover:text-blue-500 transition-colors duration-200 contact-link-text"
              >
                WHATSAPP
              </a>
              <p className="text-[#181f22] ibm-font text-center contact-link-desc">
                Lets talk more further
              </p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center contact-link-block">
              <Instagram className="text-[#181f22] contact-icon" />
              <a
                href="https://www.instagram.com/aamir.naqvii/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#181f22] font-bosenAlt tracking-wide hover:text-blue-500 transition-colors duration-200 contact-link-text"
              >
                INSTAGRAM
              </a>
              <p className="text-[#181f22] ibm-font text-center contact-link-desc">
                Tap in for visuals with purpose. - follow the flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
