import React, {useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Flame, ShoppingCart} from 'lucide-react';
import {formatPKR, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  // 4 hours, 38 minutes, 42 seconds live countdown
  const [secondsLeft, setSecondsLeft] = useState(4 * 3600 + 38 * 60 + 42);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 4 * 3600 + 38 * 60 + 42));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const scrollRow = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section id="flash-sale" className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-5">
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Flash Sale Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#F85606]" />
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#212121]">
                Flash Sale
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#757575] font-medium">Ending in</span>
              <div className="flex items-center gap-1 tabular-nums font-bold">
                <span className="inline-flex items-center justify-center w-8 h-7 rounded bg-[#F85606] text-white text-xs sm:text-sm">
                  {hours}
                </span>
                <span className="text-[#F85606]">:</span>
                <span className="inline-flex items-center justify-center w-8 h-7 rounded bg-[#F85606] text-white text-xs sm:text-sm">
                  {minutes}
                </span>
                <span className="text-[#F85606]">:</span>
                <span className="inline-flex items-center justify-center w-8 h-7 rounded bg-[#F85606] text-white text-xs sm:text-sm">
                  {seconds}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRow('left')}
              aria-label="Scroll flash sale left"
              className="w-8 h-8 rounded-lg border border-black/10 hover:bg-[#F5F5F5] flex items-center justify-center text-[#424242] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRow('right')}
              aria-label="Scroll flash sale right"
              className="w-8 h-8 rounded-lg border border-black/10 hover:bg-[#F5F5F5] flex items-center justify-center text-[#424242] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Row of Flash Sale Cards */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto no-scrollbar p-4 sm:p-5 snap-x"
        >
          {products.map((product) => {
            const totalUnits = (product.soldCount ?? 50) + (product.stockLeft ?? 10);
            const soldPct = Math.min(92, Math.round(((product.soldCount ?? 50) / totalUnits) * 100));

            return (
              <article
                key={product.id}
                className="group w-[200px] sm:w-[214px] shrink-0 snap-start bg-white rounded-lg border border-black/[0.07] hover:border-[#F85606]/40 hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)] transition-all duration-200 flex flex-col overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F85606]"
                >
                  <ProductArtwork
                    artworkKey={product.artworkKey}
                    customImageUrls={product.customImageUrls}
                    className="group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  {product.discountPercent && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#F85606] text-white text-[11px] font-bold tabular-nums">
                      -{product.discountPercent}%
                    </span>
                  )}
                </button>

                <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-left text-[13px] font-medium text-[#212121] hover:text-[#F85606] line-clamp-2 leading-snug transition-colors cursor-pointer"
                    >
                      {product.title}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="text-base font-bold text-[#F85606]">
                        {formatPKR(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#8C8C8C] line-through">
                          {formatPKR(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock progress bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-[#F0F0F0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#F85606]"
                          style={{width: `${soldPct}%`}}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#757575] tabular-nums">
                        <span>{product.soldCount} sold</span>
                        <span className="text-[#F85606] font-medium">{product.stockLeft} left</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="w-full py-1.5 px-3 rounded-md bg-[#FFF3EC] hover:bg-[#F85606] text-[#F85606] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
