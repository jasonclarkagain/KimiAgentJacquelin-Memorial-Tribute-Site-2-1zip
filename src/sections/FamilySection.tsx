import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FamilySectionProps {
  className?: string;
}

export default function FamilySection({ className = '' }: FamilySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !image || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=95%',
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE
      scrollTl.fromTo(
        image,
        { x: '30vw', opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, ease: 'none' },
        0.1
      );

      // EXIT
      scrollTl.fromTo(
        image,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { y: 0, opacity: 1 },
        { y: -30, opacity: 0, stagger: 0.03, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="family"
      className={`gallery-section bg-[#F0EDE6] ${className}`}
    >
      {/* Large Artwork as Background Element */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 w-[60vw] h-full"
        style={{
          backgroundImage: 'url(/images/1000059988.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center left',
        }}
      />

      {/* Text Content */}
      <div
        ref={textRef}
        className="absolute left-8 lg:left-20 top-1/2 -translate-y-1/2 max-w-md z-10"
      >
        <p className="reveal label-mono text-[#1A1A1A] mb-6">Family</p>
        <h2 className="reveal title-section text-[#1A1A1A] mb-8">
          Her People,<br />Her Home
        </h2>
        <div className="reveal space-y-4 body-text text-[rgba(26,26,26,0.7)]">
          <p>
            Jacquelin was the kind of person who made every room warmer just 
            by being in it. To her family, she was the steady heart — present, 
            generous, and full of life.
          </p>
          <p>
            She loved deeply and without condition. Her home was always open, 
            her table always set, and her laugh always the loudest in the room.
          </p>
          <p>
            Those lucky enough to know her carry something of her with them 
            every single day.
          </p>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-12 left-8 lg:left-20">
        <div className="w-16 h-px bg-[#1A1A1A]/20" />
      </div>
    </section>
  );
}
