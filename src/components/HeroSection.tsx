import React, {useEffect, useState} from 'react';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Headphones,
  Laptop,
  Watch,
} from 'lucide-react';
import {CATEGORIES, HERO_SLIDES, type CategoryName} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

interface HeroSectionProps {
  activeCategory: CategoryName | 'All';
  onSelectCategory: (cat: CategoryName | 'All') => void;
}

const CATEGORY_ICONS: Record<CategoryName, React.ReactNode> = {
  'Audio & Headphones': <Headphones className="w-4 h-4" />,
  'Wearables & Mobile': <Watch className="w-4 h-4" />,
  'Laptops & Peripherals': <Laptop className="w-4 h-4" />,
  'Smart Home & Tech': <Cpu className="w-4 h-4" />,
  'Gaming & Cameras': <Camera className="w-4 h-4" />,
};

export const HeroSection: React.FC<HeroSectionProps> = ({activeCategory, onSelectCategory}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [hoveredCat, setHoveredCat] = useState<CategoryName | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const currentSlide = HERO_SLIDES[slideIdx];
  const hoveredCategoryObj = hoveredCat ? CATEGORIES.find((c) => c.id === hoveredCat) : null;

  const handleCategoryClick = (cat: CategoryName) => {
    onSelectCategory(cat);
    setHoveredCat(null);
    const target = document.getElementById('just-for-you');
    if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <section aria-label="Categories and Featured Promotions" className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* Mobile / Tablet Horizontal Category Strip */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-3">
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
            activeCategory === 'All'
              ? 'bg-[#F85606] text-white border-[#F85606]'
              : 'bg-white text-[#212121] border-black/[0.08]'
          }`}
        >
          All Departments
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border flex items-center gap-1.5 transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#F85606] text-white border-[#F85606]'
                : 'bg-white text-[#212121] border-black/[0.08]'
            }`}
          >
            {CATEGORY_ICONS[cat.id]}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop 2-Column Hero Layout: Left Category Sidebar + Right Promotional Banner Slider */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative"
        onMouseLeave={() => setHoveredCat(null)}
      >
        {/* Left Sidebar: Vertical Category Menu */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col justify-between bg-white rounded-xl border border-black/[0.07] py-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative z-20">
          <div>
            <div className="px-4 pt-2 pb-2 text-xs font-semibold text-[#757575] border-b border-black/[0.05]">
              Shop by Category
            </div>
            <ul className="py-1">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const isHovered = hoveredCat === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredCat(cat.id)}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected || isHovered
                          ? 'bg-[#FFF3EC] text-[#F85606]'
                          : 'text-[#212121] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected || isHovered
                              ? 'bg-[#F85606] text-white'
                              : 'bg-[#F5F5F5] text-[#424242]'
                          }`}
                        >
                          {CATEGORY_ICONS[cat.id]}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold leading-tight truncate">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-[#757575] truncate mt-0.5">
                            {cat.tagline}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-4 pt-2 pb-2 border-t border-black/[0.05]">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('All');
                const target = document.getElementById('just-for-you');
                if (target) target.scrollIntoView({behavior: 'smooth'});
              }}
              className="w-full py-2 text-xs font-semibold text-[#F85606] hover:text-[#E04A00] flex items-center justify-between cursor-pointer"
            >
              <span>Browse All 18 Tech Essentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subcategory Flyout Panel on Hover */}
          {hoveredCategoryObj && (
            <div className="absolute left-[calc(100%+8px)] top-0 bottom-0 w-64 bg-white rounded-xl border border-black/10 shadow-xl p-5 z-30 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#F85606] mb-1">Department</p>
                <h3 className="font-display text-lg font-bold text-[#212121] mb-3">
                  {hoveredCategoryObj.label}
                </h3>
                <ul className="space-y-1.5">
                  {hoveredCategoryObj.subcategories.map((sub) => (
                    <li key={sub}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(hoveredCategoryObj.id)}
                        className="w-full text-left py-1.5 px-2.5 rounded-md text-sm text-[#424242] hover:bg-[#F5F5F5] hover:text-[#F85606] transition-colors cursor-pointer"
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleCategoryClick(hoveredCategoryObj.id)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View {hoveredCategoryObj.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </aside>

        {/* Right: Large Promotional Banner Slider */}
        <div
          className="lg:col-span-9 relative rounded-xl overflow-hidden bg-[#1C1D21] min-h-[340px] sm:min-h-[390px] flex items-stretch shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={`w-full bg-gradient-to-br ${currentSlide.bgClass} text-white grid grid-cols-1 md:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-6 transition-all duration-300`}
          >
            {/* Copy Column */}
            <div className="md:col-span-7 space-y-4 z-10">
              <p className="text-xs sm:text-sm font-semibold text-[#FF8A4C] tracking-wide">
                {currentSlide.eyebrow}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-balance">
                {currentSlide.headline}
              </h1>
              <p className="text-sm sm:text-base text-white/75 max-w-lg leading-relaxed">
                {currentSlide.subcopy}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(currentSlide.targetCategory);
                    const target = document.getElementById('just-for-you');
                    if (target) target.scrollIntoView({behavior: 'smooth'});
                  }}
                  className="px-6 py-3 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <span>{currentSlide.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const flash = document.getElementById('flash-sale');
                    if (flash) flash.scrollIntoView({behavior: 'smooth'});
                  }}
                  className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  View Flash Deals
                </button>
              </div>
            </div>

            {/* Studio Visual Showcase Column */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-[300px] aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-3">
                {currentSlide.artworkKey === 'hero-audio' && (
                  <div className="grid grid-cols-2 gap-2.5 h-full">
                    <div className="rounded-lg overflow-hidden h-full">
                      <ProductArtwork artworkKey="headphones" />
                    </div>
                    <div className="grid grid-rows-2 gap-2.5 h-full">
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="smartwatch" />
                      </div>
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="gan-charger" />
                      </div>
                    </div>
                  </div>
                )}
                {currentSlide.artworkKey === 'hero-desk' && (
                  <div className="grid grid-cols-2 gap-2.5 h-full">
                    <div className="rounded-lg overflow-hidden h-full">
                      <ProductArtwork artworkKey="keyboard" />
                    </div>
                    <div className="grid grid-rows-2 gap-2.5 h-full">
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="mouse" />
                      </div>
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="ssd" />
                      </div>
                    </div>
                  </div>
                )}
                {currentSlide.artworkKey === 'hero-smart' && (
                  <div className="grid grid-cols-2 gap-2.5 h-full">
                    <div className="rounded-lg overflow-hidden h-full">
                      <ProductArtwork artworkKey="camera" />
                    </div>
                    <div className="grid grid-rows-2 gap-2.5 h-full">
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="router" />
                      </div>
                      <div className="rounded-lg overflow-hidden">
                        <ProductArtwork artworkKey="purifier" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slider Prev / Next Arrows */}
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlideIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === slideIdx ? 'w-6 bg-[#F85606]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
