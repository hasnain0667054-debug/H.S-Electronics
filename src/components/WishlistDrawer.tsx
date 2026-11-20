import React from 'react';
import {Heart, ShoppingCart, Trash2, X} from 'lucide-react';
import {formatPKR, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

interface WishlistDrawerProps {
  open: boolean;
  items: Product[];
  onClose: () => void;
  onMoveToCart: (product: Product) => void;
  onRemove: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  open,
  items,
  onClose,
  onMoveToCart,
  onRemove,
  onSelectProduct,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        aria-label="Wishlist"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
      >
        <div className="px-5 py-4 border-b border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#F85606] fill-[#F85606]" />
            <h2 className="font-display text-lg font-bold text-[#212121]">
              Saved Wishlist ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="w-8 h-8 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center text-[#616161] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-12 h-12 text-[#D4D4D4] mx-auto" />
              <p className="font-display text-lg font-semibold text-[#212121]">
                No saved items yet
              </p>
              <p className="text-sm text-[#757575]">
                Tap the heart icon on any product to keep track of favorites here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.07]">
              {items.map((product) => (
                <li key={product.id} className="py-4 flex gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-20 h-16 rounded-lg overflow-hidden border border-black/[0.07] shrink-0 cursor-pointer"
                  >
                    <ProductArtwork
                      artworkKey={product.artworkKey}
                      customImageUrls={product.customImageUrls}
                    />
                  </button>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="text-left text-sm font-semibold text-[#212121] hover:text-[#F85606] line-clamp-2 cursor-pointer"
                      >
                        {product.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        aria-label="Remove from wishlist"
                        className="text-[#8C8C8C] hover:text-[#DC2626] p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold text-[#F85606] tabular-nums">
                        {formatPKR(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onMoveToCart(product)}
                        className="px-3 py-1.5 rounded-md bg-[#F85606] hover:bg-[#E04A00] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};
