import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
}

const galleryImages = [
  { src: '/images/jackie_portrait1.jpg', alt: 'Jackie' },
  { src: '/images/jackie_sunset.jpg', alt: 'Golden hour' },
  { src: '/images/jackie_with_elder.jpg', alt: 'With loved ones' },
  { src: '/images/jackie_baby.jpg', alt: 'Early years' },
  { src: '/images/jackie_kids_hammock.jpg', alt: 'Childhood joy' },
  { src: '/images/jackie_portrait2.jpg', alt: 'Her light' },
];

export default function GallerySection({ className = '' }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Grid items animation
      const items = grid.querySelectorAll('.gallery-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`relative bg-[#F8F7F4] py-32 lg:py-48 ${className}`}
    >
      {/* Gradient bridge from FamilySection */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#F0EDE6] to-transparent pointer-events-none z-0" />

      {/* Section Header */}
      <div ref={headerRef} className="px-8 lg:px-16 mb-16">
        <p className="reveal label-mono text-[#1A1A1A] mb-4">Moments in Time</p>
        <h2 className="reveal title-section text-[#1A1A1A]">
          A Life in Photographs
        </h2>
      </div>

      {/* Gallery Grid */}
      <div 
        ref={gridRef}
        className="px-8 lg:px-16 grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4"
      >
        {galleryImages.map((image, index) => (
          <div 
            key={index}
            className="gallery-item group relative overflow-hidden aspect-[4/5]"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="px-8 lg:px-16 mt-16 text-center">
        <p className="body-text text-[rgba(26,26,26,0.5)]">
          "Every photograph is a certificate of presence."
          <br />
          <span className="label-mono not-italic mt-2 block">— Roland Barthes</span>
        </p>
      </div>
    </section>
  );
}
