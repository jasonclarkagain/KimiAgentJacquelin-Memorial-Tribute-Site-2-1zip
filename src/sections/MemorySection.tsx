import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Send, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MemorySectionProps {
  className?: string;
}

interface Candle {
  id: number;
  name: string;
}

interface Memory {
  id: number;
  name: string;
  message: string;
}

export default function MemorySection({ className = '' }: MemorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, name: 'Jason' },
  ]);
  const [memories, setMemories] = useState<Memory[]>([
    { 
      id: 1, 
      name: 'Jason', 
      message: 'She was my whole world. Her very existence makes me want to be a better man. She brought color into my b/w world.' 
    },
  ]);
  const [newCandleName, setNewCandleName] = useState('');
  const [newMemoryName, setNewMemoryName] = useState('');
  const [newMemoryMessage, setNewMemoryMessage] = useState('');
  const [showCandleForm, setShowCandleForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

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

  const shareMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryName.trim() && newMemoryMessage.trim()) {
      setMemories([...memories, { id: Date.now(), name: newMemoryName, message: newMemoryMessage }]);
      setNewMemoryName('');
      setNewMemoryMessage('');
      setShowMemoryForm(false);
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
            Share a Memory
          </h2>
          <p className="reveal body-text text-[rgba(26,26,26,0.8)] max-w-xl mx-auto">
            If you have a story, a thought, or a quiet moment you'd like to share, 
            please leave it here. Your words become part of her legacy.
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-16">
          {/* Digital Candles */}
          <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-xl text-[#1A1A1A] flex items-center gap-3">
                <Flame className="w-5 h-5 text-[#C47A1E] candle-glow" />
                Light a Candle
              </h3>
              <button
                onClick={() => setShowCandleForm(!showCandleForm)}
                className="label-mono text-[#C47A1E] hover:text-[#A86018] transition-colors"
              >
                {showCandleForm ? 'Cancel' : 'Light One'}
              </button>
            </div>

            {showCandleForm && (
              <form onSubmit={lightCandle} className="mb-8 p-6 bg-white rounded-sm border border-black/10">
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

          {/* Shared Memories */}
          <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-xl text-[#1A1A1A] flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#C47A1E]" />
                Shared Memories
              </h3>
              <button
                onClick={() => setShowMemoryForm(!showMemoryForm)}
                className="label-mono text-[#C47A1E] hover:text-[#A86018] transition-colors"
              >
                {showMemoryForm ? 'Cancel' : 'Share Yours'}
              </button>
            </div>

            {showMemoryForm && (
              <form onSubmit={shareMemory} className="mb-8 p-6 bg-white rounded-sm border border-black/10">
                <input
                  type="text"
                  value={newMemoryName}
                  onChange={(e) => setNewMemoryName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-transparent border border-black/20 text-[#1A1A1A] placeholder:text-black/40 focus:outline-none focus:border-[#C47A1E] transition-colors mb-4"
                />
                <textarea
                  value={newMemoryMessage}
                  onChange={(e) => setNewMemoryMessage(e.target.value)}
                  placeholder="Share a memory..."
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-black/20 text-[#1A1A1A] placeholder:text-black/40 focus:outline-none focus:border-[#C47A1E] transition-colors mb-4 resize-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C47A1E] hover:bg-[#A86018] text-white label-mono transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Share Memory
                </button>
              </form>
            )}

            <div className="space-y-4">
              {memories.map((memory) => (
                <div 
                  key={memory.id}
                  className="p-6 bg-white hover:bg-white/80 transition-colors border border-black/5 border-l-2 border-l-[#C47A1E]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#C47A1E]/20 flex items-center justify-center">
                      <span className="text-xs text-[#C47A1E]">
                        {memory.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-[#1A1A1A]">{memory.name}</span>
                  </div>
                  <p className="text-sm text-[rgba(26,26,26,0.85)] leading-relaxed pl-11">
                    {memory.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="animate-in pt-16 border-t border-black/10 text-center">
            <div className="max-w-2xl mx-auto mb-14">
              <p className="font-serif text-xl lg:text-2xl text-[#1A1A1A] italic leading-relaxed mb-6">
                "Your life feels different on you, once you greet death and understand your heart's position. You wear your life like a garment from the mission bundle sale ever after – lightly because you realize you never paid nothing for it, cherishing because you know you won't ever come by such a bargain again."
              </p>
              <p className="label-mono text-[rgba(26,26,26,0.68)] text-xs tracking-widest">
                — Louise Erdrich, <em className="not-italic font-medium">Love Medicine</em>
              </p>
            </div>
            <p className="label-mono text-[rgba(26,26,26,0.65)] mb-3 uppercase tracking-widest text-xs">
              Her All-Time Favorite Book
            </p>
            <p className="font-serif text-3xl lg:text-4xl text-[#1A1A1A] italic mb-3">
              Love Medicine
            </p>
            <p className="label-mono text-[rgba(26,26,26,0.7)] mb-10">
              — Louise Erdrich
            </p>
            <p className="text-[11px] text-[rgba(26,26,26,0.5)] mb-1">
              © 2025 Jacquelin Anne Hellenberg Memorial
            </p>
            <p className="text-[11px] text-[rgba(26,26,26,0.45)]">
              Made with ♥ by Jason Clark
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}
