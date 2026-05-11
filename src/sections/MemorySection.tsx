import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MemorySectionProps {
  className?: string;
}

interface Candle {
  id: number;
  name: string;
}

export default function MemorySection({ className = '' }: MemorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, name: 'Jason' },
  ]);
  const [newCandleName, setNewCandleName] = useState('');
  const [showCandleForm, setShowCandleForm] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const content = contentRef.current;

    if (!section || !header || !content) return;

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

      gsap.fromTo(
        content.querySelectorAll('.animate-in'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const lightCandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCandleName.trim()) {
      setCandles([...candles, { id: Date.now(), name: newCandleName }]);
      setNewCandleName('');
      setShowCandleForm(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="memory"
      className={`relative bg-[#F8F7F4] text-[#1A1A1A] pt-14 pb-20 lg:pt-16 lg:pb-28 ${className}`}
    >
      {/* Subtle Artwork Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/images/1000060032.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 px-8 lg:px-16 max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <p className="reveal label-mono text-[rgba(26,26,26,0.72)] mb-4">Leave a Light</p>
          <h2 className="reveal title-section text-[#1A1A1A] mb-6">
            Light a Candle
          </h2>
          <p className="reveal body-text text-[rgba(26,26,26,0.8)] max-w-xl mx-auto">
            Light a candle in her memory. Every flame is a reminder that she is
            still thought of, still loved, still here.
          </p>
        </div>

        {/* Candles */}
        <div ref={contentRef}>
          <div className="animate-in">
            <div className="flex items-center justify-end mb-8">
              <button
                onClick={() => setShowCandleForm(!showCandleForm)}
                className="label-mono text-[#C47A1E] hover:text-[#A86018] transition-colors"
              >
                {showCandleForm ? 'Cancel' : 'Light One'}
              </button>
            </div>

            {showCandleForm && (
              <form onSubmit={lightCandle} className="mb-10 p-6 bg-white rounded-sm border border-black/10">
                <input
                  type="text"
                  value={newCandleName}
                  onChange={(e) => setNewCandleName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-transparent border border-black/20 text-[#1A1A1A] placeholder:text-black/40 focus:outline-none focus:border-[#C47A1E] transition-colors mb-4"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C47A1E] hover:bg-[#A86018] text-white label-mono transition-colors flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  Light Candle
                </button>
              </form>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {candles.map((candle) => (
                <div
                  key={candle.id}
                  className="flex flex-col items-center text-center p-3"
                >
                  <Flame className="w-6 h-6 text-[#C47A1E] candle-glow mb-2" />
                  <span className="text-[10px] text-[rgba(26,26,26,0.8)]">{candle.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
