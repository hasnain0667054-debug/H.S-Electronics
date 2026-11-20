import React, {useState} from 'react';
import {Heart, ShoppingCart, Star, Zap} from 'lucide-react';
import {CATEGORIES, formatPKR, type CategoryName, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

interface JustForYouSectionProps {
  products: Product[];
  activeCategory: CategoryName | 'All';
  onSelectCategory: (cat: CategoryName | 'All') => void;
  searchQuery: string;
  onClearFilters: () => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export const JustForYouSection: React.FC<JustForYouSectionProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearFilters,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showAll, setShowAll] = useState(false);

  const filtered = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating || b.reviewCount - a.reviewCount;
    return 0;
  });

  const visibleProducts = showAll || activeCategory !== 'All' || searchQuery ? sorted : sorted.slice(0, 15);

  return (
    <section id="just-for-you" className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
      {/* Section Header + Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#212121]">
            Just For You
          </h2>
          <span className="text-xs sm:text-sm text-[#757575] tabular-nums">
            {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}
          </span>
          {(activeCategory !== 'All' || searchQuery.trim().length > 0) && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-semibold text-[#F85606] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Category Segmented Tabs + Sort Select */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-lg border border-black/[0.07]">
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'All'
                  ? 'bg-[#212121] text-white'
                  : 'text-[#616161] hover:text-[#212121]'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#F85606] text-white'
                    : 'text-[#616161] hover:text-[#212121]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort products"
            className="h-9 px-3 rounded-lg bg-white border border-black/[0.08] text-xs font-medium text-[#212121] focus:outline-none focus:border-[#F85606] cursor-pointer"
          >
            <option value="featured">Sort: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Empty Search State */}
      {visibleProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/[0.07] p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#212121]">
            No products matched your filter
          </p>
          <p className="text-sm text-[#757575]">
            Try clearing your search query or switching to another department.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-2 px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <>
          {/* 5-Column Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {visibleProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <article
                  key={product.id}
                  className="group relative bg-white rounded-xl border border-black/[0.07] hover:border-black/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full block cursor-pointer focus-visible:outline-none"
                      aria-label={`View ${product.title}`}
                    >
                      <ProductArtwork
                        artworkKey={product.artworkKey}
                        customImageUrls={product.customImageUrls}
                        className="group-hover:scale-[1.04] transition-transform duration-300"
                      />
                    </button>

                    {/* Discount tag (single clean tag) */}
                    {product.discountPercent && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#F85606] text-white text-[11px] font-bold tabular-nums pointer-events-none">
                        -{product.discountPercent}%
                      </span>
                    )}

                    {/* Wishlist Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product)}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                        isWishlisted
                          ? 'bg-[#FFF3EC] text-[#F85606]'
                          : 'bg-white/90 text-[#616161] hover:text-[#F85606]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F85606]' : ''}`} />
                    </button>

                    {/* Quick Hover Action Bar (desktop hover + always reachable on touch via bottom buttons) */}
                    <div className="hidden md:flex absolute inset-x-2.5 bottom-2.5 gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="flex-1 h-8 px-2 rounded-md bg-[#FFB000] hover:bg-[#F2A600] text-[#212121] text-[11px] font-bold flex items-center justify-center gap-1 shadow-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onBuyNow(product)}
                        className="flex-1 h-8 px-2 rounded-md bg-[#F85606] hover:bg-[#E04A00] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-[#757575] uppercase tracking-wider">
                        {product.brand}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left text-sm font-semibold text-[#212121] hover:text-[#F85606] line-clamp-2 leading-snug transition-colors cursor-pointer"
                      >
                        {product.title}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {/* Star Rating + Review Count */}
                      <div className="flex items-center gap-1.5 text-xs tabular-nums">
                        <div className="flex items-center gap-0.5 text-[#F59E0B]">
                          {Array.from({length: 5}).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.round(product.rating)
                                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                                  : 'text-[#D4D4D4]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-[#212121]">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-[#757575]">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-lg font-bold text-[#F85606]">
                          {formatPKR(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#8C8C8C] line-through">
                            {formatPKR(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Touch / Mobile Quick Actions */}
                      <div className="flex md:hidden gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => onAddToCart(product)}
                          className="flex-1 py-2 px-2 rounded-md bg-[#FFB000] text-[#212121] text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onBuyNow(product)}
                          className="flex-1 py-2 px-2 rounded-md bg-[#F85606] text-white text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!showAll && sorted.length > 15 && activeCategory === 'All' && !searchQuery && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="px-8 py-2.5 rounded-lg bg-white hover:bg-[#FFF3EC] border border-[#F85606] text-[#F85606] text-sm font-semibold transition-colors cursor-pointer"
              >
                Load All {sorted.length} Products
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
