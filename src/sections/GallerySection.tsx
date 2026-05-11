import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  uploader: string;
  caption: string;
  uploadedAt: string;
}

const curatedImages = [
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
  const communityRef = useRef<HTMLDivElement>(null);

  const [communityImages, setCommunityImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/media');
        if (res.ok) {
          const all = await res.json();
          setCommunityImages(
            all.filter((m: { type: string }) => m.type === 'image').slice(0, 12)
          );
        }
      } catch {}
    };
    fetchImages();
    const interval = setInterval(fetchImages, 30000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
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
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );

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
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const community = communityRef.current;
    if (!community || communityImages.length === 0) return;

    const ctx = gsap.context(() => {
      const items = community.querySelectorAll('.community-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: community,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, community);

    return () => ctx.revert();
  }, [communityImages]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`relative bg-[#F8F7F4] pt-14 pb-20 lg:pt-16 lg:pb-28 ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#F0EDE6] to-transparent pointer-events-none z-0" />

      {/* Section Header */}
      <div ref={headerRef} className="px-8 lg:px-16 mb-16">
        <p className="reveal label-mono text-[#1A1A1A] mb-4">Moments in Time</p>
        <h2 className="reveal title-section text-[#1A1A1A]">
          A Life in Photographs
        </h2>
      </div>

      {/* Curated Gallery Grid */}
      <div
        ref={gridRef}
        className="px-8 lg:px-16 grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4"
      >
        {curatedImages.map((image, index) => (
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

      {/* Community Photos — grows as family uploads */}
      {communityImages.length > 0 && (
        <div ref={communityRef} className="px-8 lg:px-16 mt-16">
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-black/10" />
            <div className="text-center">
              <p className="label-mono text-[rgba(26,26,26,0.72)] text-xs tracking-widest uppercase mb-1">
                From Those Who Loved Her
              </p>
              <p className="text-[10px] text-[rgba(26,26,26,0.45)]">
                {communityImages.length} photo{communityImages.length !== 1 ? 's' : ''} added by family & friends
              </p>
            </div>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
            {communityImages.map((image) => (
              <div
                key={image.id}
                className="community-item group relative overflow-hidden aspect-[4/5]"
              >
                <img
                  src={image.url}
                  alt={image.caption || `Shared by ${image.uploader}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-end">
                  <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {image.caption && (
                      <p className="text-white text-xs mb-0.5 truncate">{image.caption}</p>
                    )}
                    <p className="text-white/70 text-[10px]">— {image.uploader}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
