import React, {useRef, useState} from 'react';
import {
  ArrowLeft,
  Banknote,
  Camera,
  Check,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  ThumbsUp,
  Truck,
  Zap,
  ZoomIn,
} from 'lucide-react';
import {formatPKR, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';
import {buildWhatsAppUrl, WhatsAppIcon} from './WhatsAppButton';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  isWishlisted: boolean;
  onBack: () => void;
  onSelectCategory: (cat: Product['category']) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, variant: string) => void;
  onBuyNow: (product: Product, quantity: number, variant: string) => void;
}

const THUMB_LABELS = ['Front Studio', 'Angled View', 'Detail Macro', 'Warm Ambient'];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  isWishlisted,
  onBack,
  onSelectCategory,
  onSelectProduct,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedView, setSelectedView] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [deliveryZone, setDeliveryZone] = useState('Karachi');

  // Interactive Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomLocked, setZoomLocked] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({x: 50, y: 50});
  const viewerRef = useRef<HTMLDivElement>(null);
  const bottomTabsRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({x, y});
  };

  const jumpToReviews = () => {
    setActiveTab('reviews');
    window.setTimeout(() => {
      bottomTabsRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 60);
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({...prev, [reviewId]: !prev[reviewId]}));
  };

  const filteredReviews =
    starFilter === null
      ? product.reviews
      : product.reviews.filter((r) => r.rating === starFilter);

  const zoomActive = isZooming || zoomLocked;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-3">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-[#6E6E6E]">
          <li>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#F85606] font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-[#9E9E9E]" />
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory(product.category)}
              className="hover:text-[#F85606] font-medium transition-colors cursor-pointer"
            >
              {product.category}
            </button>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-[#9E9E9E]" />
          <li className="text-[#212121] font-medium truncate max-w-[260px] sm:max-w-md">
            {product.title}
          </li>
        </ol>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#212121] hover:text-[#F85606] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </nav>

      {/* Top Two-Column Product Overview Container (+ Far-Right Delivery Sidebar) */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* LEFT COLUMN: Main Product Image Viewer with Zoom + 4 Clickable Thumbnails */}
          <div className="lg:col-span-5 space-y-3">
            <div
              ref={viewerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setZoomLocked((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label="Toggle product image zoom"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setZoomLocked((prev) => !prev);
                }
              }}
              className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-black/[0.08] bg-[#FAFAFA] cursor-zoom-in select-none group"
            >
              <div
                className="w-full h-full transition-transform duration-150 ease-out"
                style={{
                  transform: zoomActive ? 'scale(1.85)' : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
              >
                <ProductArtwork
                  artworkKey={product.artworkKey}
                  customImageUrls={product.customImageUrls}
                  viewIndex={selectedView}
                />
              </div>

              {/* View angle label */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-white/90 border border-black/[0.06] text-[11px] font-medium text-[#424242] pointer-events-none">
                {THUMB_LABELS[selectedView]}
              </span>

              {/* Zoom Affordance Indicator */}
              <span className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-md bg-[#212121]/80 text-white text-[11px] font-medium inline-flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{zoomLocked ? 'Zoom Locked (Click to Reset)' : 'Hover or Click to Zoom'}</span>
              </span>
            </div>

            {/* 4 Clickable Thumbnail Images Below */}
            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const active = selectedView === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedView(idx)}
                    aria-label={`View ${THUMB_LABELS[idx]}`}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      active
                        ? 'border-[#F85606] ring-2 ring-[#F85606]/20'
                        : 'border-black/[0.08] hover:border-black/25 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductArtwork
                      artworkKey={product.artworkKey}
                      customImageUrls={product.customImageUrls}
                      viewIndex={idx}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Module + Far-Right Delivery & Return Info Sidebar */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Core Purchase Controls */}
            <div className="md:col-span-7 space-y-5">
              {/* Brand & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#6E6E6E]">
                  <span className="font-semibold text-[#212121]">{product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-[28px] font-bold text-[#212121] leading-tight text-balance">
                  {product.title}
                </h1>

                {/* Star Rating with Clickable Total Reviews Link */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating)
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'text-[#D4D4D4]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#212121] tabular-nums">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[#D4D4D4]" aria-hidden="true">|</span>
                  <button
                    type="button"
                    onClick={jumpToReviews}
                    className="text-xs sm:text-sm font-medium text-[#F85606] hover:underline tabular-nums cursor-pointer"
                  >
                    {product.reviewCount.toLocaleString()} Verified Reviews
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    className={`ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'border-[#F85606] bg-[#FFF3EC] text-[#F85606]'
                        : 'border-black/10 text-[#616161] hover:text-[#F85606]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#F85606]' : ''}`} />
                    <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Price & Discount Tag */}
              <div className="py-4 px-4 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1">
                <div className="flex flex-wrap items-baseline gap-3 tabular-nums">
                  <span className="font-display text-3xl sm:text-[34px] font-bold text-[#F85606]">
                    {formatPKR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-[#8C8C8C] line-through">
                      {formatPKR(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="px-2 py-0.5 rounded bg-[#FFF3EC] border border-[#F85606]/30 text-[#F85606] text-xs font-bold">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6E6E6E]">
                  Inclusive of taxes · {product.shippingNote}
                </p>
              </div>

              {/* Color / Size Variant Selector Pills */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-[#212121]">
                    {product.variantLabel ?? 'Option'}:
                  </span>
                  <span className="text-[#6E6E6E] font-medium">{selectedVariant}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = selectedVariant === variant;
                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'border-[#F85606] bg-[#FFF3EC] text-[#F85606] font-semibold'
                            : 'border-black/12 bg-white text-[#212121] hover:border-black/30'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span>{variant}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector (- 1 +) */}
              <div className="flex items-center gap-4">
                <span className="text-xs sm:text-sm font-semibold text-[#212121]">Quantity</span>
                <div className="inline-flex items-center rounded-lg border border-black/15 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center text-[#424242] hover:bg-[#F5F5F5] disabled:opacity-35 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    data-testid="pdp-quantity"
                    className="w-11 h-9 flex items-center justify-center text-sm font-bold text-[#212121] border-x border-black/10 tabular-nums"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center text-[#424242] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-[#6E6E6E] tabular-nums">
                  {product.stockLeft ? `${product.stockLeft} units remaining` : 'In Stock & Ready'}
                </span>
              </div>

              {/* Two Prominent Action Buttons: Buy Now (Solid Orange) & Add to Cart (Amber/Yellow) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onBuyNow(product, quantity, selectedVariant)}
                  className="h-12 px-5 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddToCart(product, quantity, selectedVariant)}
                  className="h-12 px-5 rounded-lg bg-[#FFB000] hover:bg-[#F0A400] text-[#212121] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Far-Right Delivery & Return Info Sidebar Card */}
            <aside className="md:col-span-5 bg-[#FAFAFA] rounded-xl border border-black/[0.08] p-4 space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#757575]">Delivery Options</span>
                  <MapPin className="w-4 h-4 text-[#F85606]" />
                </div>

                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  aria-label="Select delivery city"
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-black/10 text-xs font-medium text-[#212121] focus:outline-none focus:border-[#F85606] cursor-pointer"
                >
                  <option value="Karachi">Karachi (Same/Next-Day)</option>
                  <option value="Lahore">Lahore (1–2 Days)</option>
                  <option value="Islamabad">Islamabad (1–2 Days)</option>
                  <option value="Rawalpindi">Rawalpindi (1–2 Days)</option>
                  <option value="Other Cities">Other Cities across Pakistan (2–4 Days)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-black/[0.07] text-xs">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-[#424242] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-[#212121] tabular-nums">
                      <span>Standard Delivery ({deliveryZone})</span>
                      <span>{deliveryZone === 'Karachi' ? 'Rs. 200' : 'Rs. 300'}</span>
                    </div>
                    <p className="text-[#757575] mt-0.5">
                      Karachi Rs. 200 · Other cities Rs. 300
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Banknote className="w-4 h-4 text-[#424242] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#212121]">Cash on Delivery Available</p>
                    <p className="text-[#757575] mt-0.5">Inspect package before paying at door</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-black/[0.07] text-xs">
                <span className="text-xs font-semibold text-[#757575] block">
                  Return & Warranty
                </span>

                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#424242] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#212121]">14-Day Free & Easy Returns</p>
                    <p className="text-[#757575] mt-0.5">Instant courier pickup for unused items</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#424242] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#212121]">{product.warrantyNote}</p>
                    <p className="text-[#757575] mt-0.5">100% Authentic Verified Brand Stock</p>
                  </div>
                </div>
              </div>

              {/* Verified Seller Info */}
              <div className="pt-3 border-t border-black/[0.07] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-white border border-black/10 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-[#F85606]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#212121] truncate">
                        {product.sellerName}
                      </p>
                      <p className="text-[11px] text-[#757575] tabular-nums">
                        {product.sellerRating}% Positive Seller Rating
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat on WhatsApp button with pre-filled product name */}
                <a
                  href={buildWhatsAppUrl(
                    `Hello H.S Electronics, I have a question about ${product.title}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 px-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabbed Content Area (Product Description & Customer Reviews) */}
      <div
        ref={bottomTabsRef}
        className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-black/[0.08] bg-[#FAFAFA] px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-[#F85606] text-[#F85606] bg-white'
                : 'border-transparent text-[#6E6E6E] hover:text-[#212121]'
            }`}
          >
            Product Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
              activeTab === 'reviews'
                ? 'border-[#F85606] text-[#F85606] bg-white'
                : 'border-transparent text-[#6E6E6E] hover:text-[#212121]'
            }`}
          >
            Customer Reviews ({product.reviewCount.toLocaleString()})
          </button>
        </div>

        {/* Tab Panel 1: Product Description + Bullet Points + Specification Table */}
        {activeTab === 'description' && (
          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#212121] mb-2.5">
                  Overview
                </h2>
                <p className="text-sm sm:text-[15px] text-[#424242] leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-[#212121] mb-3">
                  Key Highlights
                </h3>
                <ul className="space-y-2.5">
                  {product.highlights.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#424242]">
                      <span className="w-5 h-5 rounded-full bg-[#FFF3EC] text-[#F85606] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specification Table */}
            <div className="lg:col-span-5">
              <h3 className="font-display text-base font-bold text-[#212121] mb-3">
                Technical Specifications
              </h3>
              <div className="rounded-xl border border-black/[0.08] overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <tbody className="divide-y divide-black/[0.07]">
                    {product.specs.map((spec, idx) => (
                      <tr
                        key={spec.label}
                        className={idx % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
                      >
                        <th
                          scope="row"
                          className="py-3 px-4 text-left font-semibold text-[#6E6E6E] w-[42%]"
                        >
                          {spec.label}
                        </th>
                        <td className="py-3 px-4 text-[#212121] font-medium tabular-nums">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Panel 2: Customer Reviews (Rating Breakdown, Star Bars, Customer Photos, Buyer Comments) */}
        {activeTab === 'reviews' && (
          <div className="p-5 sm:p-8 space-y-8">
            {/* Rating Breakdown + Customer Photos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-7 border-b border-black/[0.08]">
              {/* Overall Rating Score */}
              <div className="lg:col-span-3 flex flex-col justify-center items-start space-y-2">
                <div className="flex items-baseline gap-1.5 tabular-nums">
                  <span className="font-display text-5xl font-bold text-[#212121]">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-lg font-semibold text-[#757575]">/ 5</span>
                </div>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {Array.from({length: 5}).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#D4D4D4]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#6E6E6E] tabular-nums">
                  Based on {product.reviewCount.toLocaleString()} verified ratings
                </p>
              </div>

              {/* Interactive Star Bars */}
              <div className="lg:col-span-5 space-y-2">
                {[5, 4, 3, 2, 1].map((stars, idx) => {
                  const pct = product.ratingBreakdown[idx] ?? 0;
                  const isFiltered = starFilter === stars;
                  return (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setStarFilter(isFiltered ? null : stars)}
                      className={`w-full flex items-center gap-3 text-xs py-1 px-2 rounded-md transition-colors cursor-pointer ${
                        isFiltered ? 'bg-[#FFF3EC]' : 'hover:bg-[#F5F5F5]'
                      }`}
                    >
                      <span className="w-12 text-left font-semibold text-[#212121] tabular-nums flex items-center gap-1">
                        {stars} <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-[#EFEFEF] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#F59E0B]"
                          style={{width: `${pct}%`}}
                        />
                      </div>
                      <span className="w-10 text-right font-medium text-[#6E6E6E] tabular-nums">
                        {pct}%
                      </span>
                    </button>
                  );
                })}
                {starFilter !== null && (
                  <button
                    type="button"
                    onClick={() => setStarFilter(null)}
                    className="text-xs font-semibold text-[#F85606] hover:underline pl-2 pt-1 cursor-pointer"
                  >
                    Clear {starFilter}-Star Filter
                  </button>
                )}
              </div>

              {/* Customer Photos Strip */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#212121]">
                  <Camera className="w-4 h-4 text-[#F85606]" />
                  <span>Customer Photos</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedView(idx);
                        window.scrollTo({top: 0, behavior: 'smooth'});
                      }}
                      aria-label={`Inspect customer photo ${idx + 1}`}
                      className="aspect-square rounded-lg overflow-hidden border border-black/10 hover:border-[#F85606] transition-colors cursor-pointer"
                    >
                      <ProductArtwork
                        artworkKey={product.artworkKey}
                        customImageUrls={product.customImageUrls}
                        viewIndex={idx}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#757575]">
                  Click any photo to inspect in the main gallery viewer.
                </p>
              </div>
            </div>

            {/* Verified Buyer Comments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#212121]">
                  Verified Buyer Comments
                </h3>
                <span className="text-xs text-[#757575] tabular-nums">
                  Showing {filteredReviews.length} of {product.reviews.length} featured reviews
                </span>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#757575] bg-[#FAFAFA] rounded-xl border border-black/[0.06]">
                  No featured comments for {starFilter} stars.{' '}
                  <button
                    type="button"
                    onClick={() => setStarFilter(null)}
                    className="text-[#F85606] font-semibold hover:underline cursor-pointer"
                  >
                    Show all reviews
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/[0.07]">
                  {filteredReviews.map((review) => {
                    const voted = Boolean(helpfulVotes[review.id]);
                    const count = review.helpfulCount + (voted ? 1 : 0);
                    return (
                      <article key={review.id} className="py-5 first:pt-1 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-0.5 text-[#F59E0B]">
                              {Array.from({length: 5}).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating
                                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                                      : 'text-[#D4D4D4]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-[#212121]">
                              {review.author}
                            </span>
                            <span className="text-xs text-[#15803D] font-medium">
                              Verified Purchase
                            </span>
                          </div>
                          <span className="text-xs text-[#757575] tabular-nums">
                            {review.date}
                          </span>
                        </div>

                        <p className="text-xs text-[#757575]">Option: {review.variant}</p>
                        <p className="text-sm text-[#424242] leading-relaxed max-w-3xl">
                          {review.comment}
                        </p>

                        {review.hasPhoto && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-black/10">
                            <ProductArtwork
                              artworkKey={product.artworkKey}
                              customImageUrls={product.customImageUrls}
                              viewIndex={1}
                            />
                          </div>
                        )}

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => toggleHelpful(review.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer tabular-nums ${
                              voted
                                ? 'border-[#F85606] bg-[#FFF3EC] text-[#F85606]'
                                : 'border-black/10 text-[#616161] hover:border-black/25'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({count})</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Strip */}
      {relatedProducts.length > 0 && (
        <section className="pt-2 space-y-3">
          <h2 className="font-display text-lg font-bold text-[#212121]">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {relatedProducts.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectProduct(item);
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className="group bg-white rounded-xl border border-black/[0.07] hover:border-[#F85606]/40 hover:shadow-md transition-all overflow-hidden text-left cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ProductArtwork
                    artworkKey={item.artworkKey}
                    customImageUrls={item.customImageUrls}
                    className="group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-[#212121] line-clamp-2 group-hover:text-[#F85606] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm font-bold text-[#F85606] tabular-nums">
                    {formatPKR(item.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
