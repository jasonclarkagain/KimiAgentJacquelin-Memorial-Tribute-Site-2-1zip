import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const artwork = artworkRef.current;
    const text = textRef.current;
    const scrollCue = scrollCueRef.current;

    if (!section || !artwork || !text) return;

    const ctx = gsap.context(() => {
      // Load animation
      const loadTl = gsap.timeline({ delay: 0.3 });

      loadTl.fromTo(
        artwork,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      );

      if (portraitRef.current) {
        loadTl.fromTo(
          portraitRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
          '-=0.9'
        );
      }

      loadTl.fromTo(
        text.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
        '-=0.6'
      );

      if (scrollCue) {
        loadTl.fromTo(
          scrollCue,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }

      // Scroll exit
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=90%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set(artwork, { opacity: 1, scale: 1 });
            gsap.set(text.querySelectorAll('.reveal'), { opacity: 1, y: 0 });
          },
        },
      });

      scrollTl.fromTo(
        artwork,
        { scale: 1, opacity: 1 },
        { scale: 1.15, opacity: 0.3, ease: 'power2.in' },
        0.6
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, stagger: 0.05, ease: 'power2.in' },
        0.6
      );

      if (portraitRef.current) {
        scrollTl.fromTo(
          portraitRef.current,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -30, ease: 'power2.in' },
          0.6
        );
      }

      if (scrollCue) {
        scrollTl.fromTo(
          scrollCue,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.4
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`gallery-section flex-col bg-[#F8F7F4] ${className}`}
    >
      {/* Full-bleed Artwork Background */}
      <div
        ref={artworkRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/1000059981.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F7F4]/80" />

      {/* Portrait Circle */}
      <div
        ref={portraitRef}
        className="relative z-10 mb-8"
      >
        <div
          className="mx-auto"
          style={{
            width: '532px',
            height: '532px',
            marginTop: '40px',
            maskImage: 'radial-gradient(ellipse 55% 53% at 50% 42%, black 48%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 53% at 50% 42%, black 48%, transparent 78%)',
          }}
        >
          <img
            src="/images/jackie_portrait1.jpg"
            alt="Jacquelin Anne Hellenberg"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Centered Text */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-3xl"
        style={{ marginTop: '-230px' }}
      >
        <p className="reveal label-mono text-[#1A1A1A] mb-6">
          In Memory Of
        </p>
        <h1 className="reveal title-hero text-[#1A1A1A] mb-4">
          Jacquelin Anne
          <br />
          <span className="italic">Hellenberg</span>
        </h1>
        <p className="reveal text-lg text-[rgba(26,26,26,0.6)] font-light tracking-wide">
          1965 — 2025
        </p>
        <p className="reveal body-text text-[rgba(26,26,26,0.5)] mt-8 max-w-md mx-auto">
          Mother, daughter, sister, friend.
          Her warmth, her cooking, and her laughter live on in everyone she loved.
        </p>
      </div>

      {/* Scroll Cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="scroll-line text-[#1A1A1A]" />
      </div>
    </section>
  );
}
