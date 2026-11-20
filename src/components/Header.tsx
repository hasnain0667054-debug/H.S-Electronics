import React, {useEffect, useRef, useState} from 'react';
import {Heart, Search, ShoppingCart, User, X} from 'lucide-react';
import {formatPKR, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  userName: string | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenSeller: () => void;
  onLogoClick: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  wishlistCount,
  userName,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenSeller,
  onLogoClick,
  allProducts,
  onSelectProduct,
}) => {
  const [focused, setFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const suggestions =
    searchQuery.trim().length > 0
      ? allProducts
          .filter(
            (p) =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFocused(false);
    onSearchSubmit(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/[0.08] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Brand Logo */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F85606] rounded-md py-1 cursor-pointer"
          aria-label="H.S Electronics Home"
        >
          <img
            src="/assets/aistudio/Sun_26_07_2026_23_56_47_1c88bbed.png"
            alt="H.S Electronics logo"
            referrerPolicy="no-referrer"
            className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0 rounded-md transition-transform duration-150 group-hover:scale-105"
          />
          <span className="hidden sm:inline font-display text-xl lg:text-2xl font-bold tracking-tight text-[#212121]">
            H.S Electronics
          </span>
        </button>

        {/* Center: Large Central Search Bar */}
        <div ref={searchWrapRef} className="relative flex-1 max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center w-full h-11 rounded-lg bg-[#F5F5F5] border transition-colors ${
              focused
                ? 'border-[#F85606] bg-white ring-2 ring-[#F85606]/15'
                : 'border-black/[0.08] hover:border-black/20'
            }`}
          >
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setFocused(true);
              }}
              placeholder="Search headphones, smartwatches, GaN chargers, mechanical keyboards..."
              aria-label="Search products"
              className="flex-1 h-full bg-transparent px-4 text-sm text-[#212121] placeholder:text-[#757575] focus:outline-none min-w-0"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="p-1.5 mr-1 text-[#757575] hover:text-[#212121] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="h-full px-5 bg-[#F85606] hover:bg-[#E04A00] text-white font-semibold text-sm rounded-r-[7px] flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Instant Search Dropdown */}
          {focused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-lg border border-black/10 shadow-xl overflow-hidden z-50">
              <div className="px-3.5 py-2 text-xs font-medium text-[#757575] border-b border-black/[0.06] bg-[#FAFAFA]">
                Matching Products
              </div>
              <ul className="divide-y divide-black/[0.05]">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setFocused(false);
                        onSelectProduct(item);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#F5F5F5] text-left transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-black/[0.06]">
                        <ProductArtwork
                          artworkKey={item.artworkKey}
                          customImageUrls={item.customImageUrls}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#212121] truncate">{item.title}</p>
                        <p className="text-xs text-[#757575]">
                          {item.brand} · {item.category}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#F85606] tabular-nums shrink-0">
                        {formatPKR(item.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Seller Center, Login/Sign Up, Wishlist, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSeller}
            className="hidden md:inline-flex h-10 px-2.5 rounded-lg items-center text-xs font-semibold text-[#424242] hover:text-[#F85606] hover:bg-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Seller Center
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="h-10 px-2.5 sm:px-3 rounded-lg flex items-center gap-2 text-sm font-medium text-[#212121] hover:bg-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F85606]"
          >
            <User className="w-[18px] h-[18px] text-[#424242]" />
            <span className="hidden lg:inline">
              {userName ? userName : 'Login / Sign Up'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative h-10 px-2.5 sm:px-3 rounded-lg flex items-center gap-2 text-sm font-medium text-[#212121] hover:bg-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F85606]"
          >
            <div className="relative">
              <Heart className="w-[18px] h-[18px] text-[#424242]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#212121] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline">Wishlist</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping Cart (${cartCount} items)`}
            className="relative h-10 px-3 sm:px-3.5 rounded-lg flex items-center gap-2 text-sm font-semibold text-[#212121] hover:bg-[#FFF3EC] hover:text-[#F85606] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F85606]"
          >
            <div className="relative">
              <ShoppingCart className="w-[20px] h-[20px]" />
              <span
                data-testid="cart-badge"
                className="absolute -top-2 -right-2.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#F85606] text-white text-[11px] font-bold flex items-center justify-center tabular-nums shadow-sm"
              >
                {cartCount}
              </span>
            </div>
            <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
};
