import React from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Cable,
  Home,
  Speaker,
  Sun,
  Tag,
  Zap,
} from 'lucide-react';
import type {CategoryItem, CategoryName} from '../data/catalog';

interface HeroSectionProps {
  categories: CategoryItem[];
  totalProductsCount: number;
  activeCategory: CategoryName | 'All';
  onSelectCategory: (cat: CategoryName | 'All') => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Chargers & Power Banks': <BatteryCharging className="w-4 h-4" />,
  'Cables & Adapters': <Cable className="w-4 h-4" />,
  'Speakers & Earbuds': <Speaker className="w-4 h-4" />,
  'Accessories Battery Charger': <Zap className="w-4 h-4" />,
  'Solar Inverter': <Sun className="w-4 h-4" />,
  'Home Appliances': <Home className="w-4 h-4" />,
};

const getCategoryIcon = (categoryId: string) =>
  CATEGORY_ICONS[categoryId] ?? <Tag className="w-4 h-4" />;

export const HeroSection: React.FC<HeroSectionProps> = ({
  categories,
  totalProductsCount,
  activeCategory,
  onSelectCategory,
}) => {
  const handleCategoryClick = (cat: CategoryName | 'All') => {
    onSelectCategory(cat);
    const target = document.getElementById('just-for-you');
    if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <section
      aria-label="Shop by Department"
      className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-4 pb-2"
    >
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-sm sm:text-base font-bold text-[#212121]">
              Shop by Department
            </h2>
            <span className="text-xs text-[#757575] tabular-nums">
              {categories.length} departments
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCategoryClick('All')}
            className="text-xs font-semibold text-[#F85606] hover:text-[#E04A00] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All {totalProductsCount} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Horizontal Department Strip */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => handleCategoryClick('All')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
              activeCategory === 'All'
                ? 'bg-[#F85606] text-white border-[#F85606]'
                : 'bg-[#FAFAFA] text-[#212121] border-black/[0.08]'
            }`}
          >
            All Departments
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border flex items-center gap-1.5 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#F85606] text-white border-[#F85606]'
                  : 'bg-[#FAFAFA] text-[#212121] border-black/[0.08]'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop Department Cards Grid */}
        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF3EC] border-[#F85606] text-[#F85606]'
                    : 'bg-[#FAFAFA] border-black/[0.06] text-[#212121] hover:bg-white hover:border-[#F85606]/50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#F85606] text-white'
                      : 'bg-white text-[#424242] border border-black/[0.06]'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-snug truncate">{cat.label}</p>
                  <p className="text-[11px] text-[#757575] truncate mt-0.5">{cat.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
