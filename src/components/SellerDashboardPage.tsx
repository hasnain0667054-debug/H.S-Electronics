import React, {useRef, useState} from 'react';
import {
  ArrowLeft,
  Bold,
  Check,
  Eye,
  Heading2,
  ImagePlus,
  Italic,
  LayoutDashboard,
  List,
  ListOrdered,
  MessageSquare,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Table,
  Trash2,
  Truck,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  formatPKR,
  type CategoryName,
  type Product,
  type ProductArtworkKey,
} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

export type SellerNavSection = 'dashboard' | 'products' | 'orders' | 'reviews';

export type CourierPartner = 'TCS' | 'Leopards' | 'PostEx' | 'Trax';

export const COURIER_PARTNERS: CourierPartner[] = ['TCS', 'Leopards', 'PostEx', 'Trax'];

export interface SellerOrderRecord {
  id: string;
  customer: string;
  city?: string;
  itemsSummary: string;
  total: number;
  date: string;
  payment: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  courier?: CourierPartner | '';
  trackingId?: string;
}

interface MediaSlot {
  id: string;
  name: string;
  url?: string;
  artworkKey?: ProductArtworkKey;
}

interface SellerDashboardPageProps {
  products: Product[];
  orders: SellerOrderRecord[];
  onSaveProduct: (product: Product, mode: 'draft' | 'published') => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: SellerOrderRecord['status']) => void;
  onUpdateOrderTracking: (
    orderId: string,
    updates: {
      courier?: CourierPartner | '';
      trackingId?: string;
      status?: SellerOrderRecord['status'];
    }
  ) => void;
  onViewProductInStore: (product: Product) => void;
  onBackToStore: () => void;
}

const DEFAULT_ARTWORK_FOR_CATEGORY: Record<CategoryName, ProductArtworkKey> = {
  'Audio & Headphones': 'headphones',
  'Wearables & Mobile': 'smartwatch',
  'Laptops & Peripherals': 'keyboard',
  'Smart Home & Tech': 'router',
  'Gaming & Cameras': 'camera',
};

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  products,
  orders,
  onSaveProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateOrderTracking,
  onViewProductInStore,
  onBackToStore,
}) => {
  // Default to 'products' so the main 'Add New Product' form area is immediately visible
  const [activeNav, setActiveNav] = useState<SellerNavSection>('products');
  const [productsSubTab, setProductsSubTab] = useState<'add' | 'list'>('add');

  // Add New Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryName>('Audio & Headphones');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('25');
  const [description, setDescription] = useState(
    'Engineered for everyday durability and clean performance.\n\n**Key Features**\n- Precision build with verified materials\n- Ready for fast same-day dispatch\n\n**Specifications**\n- Warranty: 1-Year Brand Coverage\n- Packaging: Eco-friendly retail box'
  );
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  // Orders & Reviews state
  const [orderFilter, setOrderFilter] = useState<'All' | SellerOrderRecord['status']>('All');
  const [orderValidationError, setOrderValidationError] = useState<string | null>(null);
  const [reviewReplies, setReviewReplies] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaSlots((prev) => [
            ...prev.slice(0, 7),
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              url: reader.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeMediaSlot = (id: string) => {
    setMediaSlots((prev) => prev.filter((m) => m.id !== id));
  };

  const applyFormatting = (type: 'bold' | 'italic' | 'heading' | 'ul' | 'ol' | 'spec') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = description.slice(start, end);

    let insertion = '';
    if (type === 'bold') {
      insertion = `**${selected || 'bold text'}**`;
    } else if (type === 'italic') {
      insertion = `*${selected || 'italic text'}*`;
    } else if (type === 'heading') {
      insertion = `\n## ${selected || 'Section Heading'}\n`;
    } else if (type === 'ul') {
      insertion = `\n- ${selected || 'Key product highlight'}\n- `;
    } else if (type === 'ol') {
      insertion = `\n1. ${selected || 'Step or specification'}\n2. `;
    } else if (type === 'spec') {
      insertion = `\n**Specifications**\n- Dimensions: 24 × 18 × 8 cm\n- Material: Brushed Aluminum\n- Warranty: 2 Years\n`;
    }

    const updated = description.slice(0, start) + insertion + description.slice(end);
    setDescription(updated);
    window.setTimeout(() => {
      el.focus();
      const cursor = start + insertion.length;
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const numericPrice = parseFloat(price);
  const numericDiscount = parseFloat(discountedPrice);
  const hasValidDiscount =
    !Number.isNaN(numericPrice) &&
    !Number.isNaN(numericDiscount) &&
    numericDiscount > 0 &&
    numericDiscount < numericPrice;
  const computedDiscountPct = hasValidDiscount
    ? Math.round(((numericPrice - numericDiscount) / numericPrice) * 100)
    : undefined;

  const handleSubmitProduct = (status: 'draft' | 'published') => {
    if (!title.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormNotice('Please enter a valid Product Title and Price before saving.');
      return;
    }

    const finalPrice = hasValidDiscount ? numericDiscount : numericPrice;
    const originalPrice = hasValidDiscount ? numericPrice : undefined;
    const stock = Math.max(0, parseInt(stockQuantity || '0', 10) || 0);

    const parsedLines = description
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const bulletHighlights = parsedLines
      .filter((l) => l.startsWith('- ') || /^\d+\./.test(l))
      .map((l) => l.replace(/^(-\s+|\d+\.\s+)/, '').replace(/\*\*/g, ''))
      .slice(0, 5);

    const specPairs = parsedLines
      .filter((l) => l.startsWith('- ') && l.includes(':'))
      .map((l) => {
        const clean = l.replace(/^-\s+/, '').replace(/\*\*/g, '');
        const [k, ...rest] = clean.split(':');
        return {label: k.trim(), value: rest.join(':').trim()};
      })
      .filter((s) => s.label && s.value);

    const uploadedUrls = mediaSlots.map((m) => m.url).filter((u): u is string => Boolean(u));

    const newProduct: Product = {
      id: `seller-${Date.now()}`,
      title: title.trim(),
      brand: 'H.S Electronics',
      category,
      price: finalPrice,
      originalPrice,
      discountPercent: computedDiscountPct,
      rating: 5.0,
      reviewCount: 1,
      artworkKey: DEFAULT_ARTWORK_FOR_CATEGORY[category],
      customImageUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      status,
      stockLeft: stock,
      variants: ['Standard Edition'],
      variantLabel: 'Edition',
      description: description.replace(/[#*]/g, '').trim(),
      highlights:
        bulletHighlights.length > 0
          ? bulletHighlights
          : ['Verified H.S Electronics listing', 'Fast 24-hour warehouse dispatch'],
      specs:
        specPairs.length > 0
          ? specPairs
          : [
              {label: 'Category', value: category},
              {label: 'Stock Units', value: `${stock} Available`},
            ],
      shippingNote: 'Standard Courier Delivery',
      warrantyNote: '1-Year Seller Warranty',
      sellerName: 'Your Seller Store',
      sellerRating: 99,
      ratingBreakdown: [100, 0, 0, 0, 0],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Store Verification',
          rating: 5,
          date: 'Nov 20, 2026',
          variant: 'Standard Edition',
          comment: 'Newly published listing verified for storefront quality.',
          helpfulCount: 1,
        },
      ],
    };

    onSaveProduct(newProduct, status);
    setFormNotice(
      status === 'published'
        ? `"${newProduct.title}" is now live in the storefront catalog.`
        : `"${newProduct.title}" saved to Drafts.`
    );
    setTitle('');
    setPrice('');
    setDiscountedPrice('');
    setStockQuantity('25');
    setMediaSlots([]);
  };

  // Dashboard metrics
  const publishedCount = products.filter((p) => p.status !== 'draft').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Processing').length;

  const allReviews = products.flatMap((p) =>
    p.reviews.map((r) => ({...r, productId: p.id, productTitle: p.title}))
  );

  const navItems: {id: SellerNavSection; label: string; icon: React.ReactNode; badge?: number}[] = [
    {id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />},
    {
      id: 'products',
      label: 'Products',
      icon: <Package className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: orders.length,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 sm:py-6">
      {/* Top Seller Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#212121] hover:text-[#F85606] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <span className="text-[#D4D4D4]" aria-hidden="true">|</span>
          <h1 className="font-display text-lg sm:text-xl font-bold text-[#212121]">
            Seller Center
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveNav('products');
            setProductsSubTab('add');
          }}
          className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Mobile Horizontal Nav */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveNav(item.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 border transition-colors ${
              activeNav === item.id
                ? 'bg-[#F85606] text-white border-[#F85606]'
                : 'bg-white text-[#212121] border-black/[0.08]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop Left Sidebar + Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-black/[0.07] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-24">
          <div className="px-3 py-2 mb-1 border-b border-black/[0.06]">
            <p className="text-xs font-semibold text-[#757575]">Merchant Workspace</p>
            <p className="text-sm font-bold text-[#212121] mt-0.5">H.S Electronics Studio</p>
          </div>

          <nav aria-label="Seller Navigation" className="space-y-1 py-2">
            {navItems.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-lg flex items-center justify-between text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FFF3EC] text-[#F85606]'
                      : 'text-[#424242] hover:bg-[#F5F5F5] hover:text-[#212121]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs tabular-nums font-bold ${
                        active ? 'text-[#F85606]' : 'text-[#8C8C8C]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-2 pt-3 border-t border-black/[0.06] px-3 pb-1 text-xs text-[#757575] space-y-1 tabular-nums">
            <div className="flex justify-between">
              <span>Published Listings</span>
              <span className="font-semibold text-[#212121]">{publishedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Saved Drafts</span>
              <span className="font-semibold text-[#212121]">{draftCount}</span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <div className="lg:col-span-9 space-y-5">
          {/* ===================== DASHBOARD OVERVIEW ===================== */}
          {activeNav === 'dashboard' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {label: 'Gross Revenue', value: formatPKR(totalRevenue), sub: 'Last 30 days'},
                  {label: 'Active Products', value: String(publishedCount), sub: `${draftCount} drafts`},
                  {label: 'Orders to Fulfill', value: String(pendingOrders), sub: '24h dispatch SLA'},
                  {label: 'Store Rating', value: '4.9 / 5', sub: '98% positive feedback'},
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white rounded-xl border border-black/[0.07] p-5 space-y-1"
                  >
                    <p className="text-xs font-medium text-[#757575]">{kpi.label}</p>
                    <p className="font-display text-2xl font-bold text-[#212121] tabular-nums">
                      {kpi.value}
                    </p>
                    <p className="text-xs text-[#6E6E6E]">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-black/[0.07] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#212121]">
                    Ready to list new inventory?
                  </h2>
                  <p className="text-sm text-[#6E6E6E] mt-0.5">
                    Upload product photos, set promotional pricing, and publish straight to Just For You.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('products');
                    setProductsSubTab('add');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  Open Add New Product
                </button>
              </div>
            </div>
          )}

          {/* ===================== PRODUCTS (ADD NEW PRODUCT FORM + CATALOG LIST) ===================== */}
          {activeNav === 'products' && (
            <div className="space-y-5">
              {/* Sub-tab header */}
              <div className="bg-white rounded-xl border border-black/[0.07] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-[#F5F5F5] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setProductsSubTab('add')}
                    className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      productsSubTab === 'add'
                        ? 'bg-white text-[#212121] shadow-sm'
                        : 'text-[#6E6E6E] hover:text-[#212121]'
                    }`}
                  >
                    Add New Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductsSubTab('list')}
                    className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer tabular-nums ${
                      productsSubTab === 'list'
                        ? 'bg-white text-[#212121] shadow-sm'
                        : 'text-[#6E6E6E] hover:text-[#212121]'
                    }`}
                  >
                    Manage Catalog ({products.length})
                  </button>
                </div>

                {formNotice && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D] bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    <span>{formNotice}</span>
                  </div>
                )}
              </div>

              {productsSubTab === 'add' ? (
                <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-5 sm:p-7 space-y-8">
                  <div className="border-b border-black/[0.07] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#212121]">
                      Add New Product
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6E6E6E] mt-1">
                      Complete the media gallery, pricing, and specifications below to publish your product.
                    </p>
                  </div>

                  {/* 1. PRODUCT MEDIA UPLOAD */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#212121]">
                          1. Product Media Upload
                        </h3>
                        <p className="text-xs text-[#757575]">
                          Drag and drop multiple product pictures (PNG, JPG, WebP). First image acts as the cover.
                        </p>
                      </div>
                      <span className="text-xs text-[#757575] tabular-nums">
                        {mediaSlots.length} / 8 uploaded
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Primary Drag & Drop Box */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                        className={`md:col-span-5 rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[176px] ${
                          isDragging
                            ? 'border-[#F85606] bg-[#FFF3EC]'
                            : 'border-black/15 bg-[#FAFAFA] hover:border-[#F85606] hover:bg-[#FFF9F5]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFiles(e.target.files)}
                          className="hidden"
                        />
                        <div className="w-11 h-11 rounded-full bg-white border border-black/10 flex items-center justify-center mb-3 text-[#F85606] shadow-xs">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-[#212121]">
                          Drag & drop product images here
                        </p>
                        <p className="text-xs text-[#757575] mt-1">
                          or <span className="text-[#F85606] font-semibold">browse files</span> from your device
                        </p>
                      </div>

                      {/* Preview Thumbnail Boxes */}
                      <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {mediaSlots.map((slot, index) => (
                          <div
                            key={slot.id}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/10 bg-[#FAFAFA] group"
                          >
                            {slot.url ? (
                              <img
                                src={slot.url}
                                alt={slot.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ProductArtwork
                                artworkKey={slot.artworkKey ?? 'headphones'}
                              />
                            )}
                            {index === 0 && (
                              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#212121]/85 text-white text-[10px] font-semibold">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMediaSlot(slot.id);
                              }}
                              aria-label="Remove image"
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Empty secondary upload boxes */}
                        {Array.from({length: Math.max(1, 4 - mediaSlots.length)}).map((_, idx) => (
                          <button
                            key={`slot-${idx}`}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[4/3] rounded-xl border border-dashed border-black/15 bg-[#FAFAFA] hover:border-[#F85606] hover:bg-[#FFF9F5] flex flex-col items-center justify-center gap-1.5 text-[#757575] hover:text-[#F85606] transition-colors cursor-pointer"
                          >
                            <ImagePlus className="w-5 h-5" />
                            <span className="text-[11px] font-medium">Add Photo</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* 2. BASIC INFORMATION */}
                  <section className="space-y-4 pt-6 border-t border-black/[0.07]">
                    <h3 className="text-sm font-bold text-[#212121]">2. Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1.5">
                        <label
                          htmlFor="prod-title"
                          className="text-xs font-semibold text-[#212121] block"
                        >
                          Product Title <span className="text-[#F85606]">*</span>
                        </label>
                        <input
                          id="prod-title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Studio Wireless Noise-Cancelling Headphones Pro"
                          className="w-full h-11 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] focus:outline-none focus:border-[#F85606]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="prod-category"
                          className="text-xs font-semibold text-[#212121] block"
                        >
                          Category
                        </label>
                        <select
                          id="prod-category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value as CategoryName)}
                          className="w-full h-11 px-3.5 rounded-lg border border-black/15 bg-white text-sm text-[#212121] focus:outline-none focus:border-[#F85606] cursor-pointer"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="prod-stock"
                          className="text-xs font-semibold text-[#212121] block"
                        >
                          Stock Quantity
                        </label>
                        <input
                          id="prod-stock"
                          type="number"
                          min={0}
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                          placeholder="25"
                          className="w-full h-11 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] tabular-nums focus:outline-none focus:border-[#F85606]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="prod-price"
                          className="text-xs font-semibold text-[#212121] block"
                        >
                          Price (Rs.) <span className="text-[#F85606]">*</span>
                        </label>
                        <input
                          id="prod-price"
                          type="number"
                          min="1"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="18500"
                          className="w-full h-11 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] tabular-nums focus:outline-none focus:border-[#F85606]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="prod-discount"
                            className="text-xs font-semibold text-[#212121]"
                          >
                            Discounted Price (Rs.)
                          </label>
                          {computedDiscountPct && (
                            <span className="text-[11px] font-bold text-[#F85606] tabular-nums">
                              -{computedDiscountPct}% Off
                            </span>
                          )}
                        </div>
                        <input
                          id="prod-discount"
                          type="number"
                          min="0"
                          step="1"
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          placeholder="14900 (optional)"
                          className="w-full h-11 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] tabular-nums focus:outline-none focus:border-[#F85606]"
                        />
                      </div>
                    </div>
                  </section>

                  {/* 3. RICH TEXT DESCRIPTION EDITOR */}
                  <section className="space-y-3 pt-6 border-t border-black/[0.07]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#212121]">
                          3. Rich Text Description Editor
                        </h3>
                        <p className="text-xs text-[#757575]">
                          Write detailed product descriptions, feature highlights, and technical specifications.
                        </p>
                      </div>
                      <div className="inline-flex rounded-lg bg-[#F5F5F5] p-1">
                        <button
                          type="button"
                          onClick={() => setEditorMode('write')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                            editorMode === 'write'
                              ? 'bg-white text-[#212121] shadow-xs'
                              : 'text-[#6E6E6E]'
                          }`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode('preview')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                            editorMode === 'preview'
                              ? 'bg-white text-[#212121] shadow-xs'
                              : 'text-[#6E6E6E]'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/15 overflow-hidden bg-white">
                      {/* Formatting Toolbar */}
                      <div className="px-3 py-2 bg-[#FAFAFA] border-b border-black/[0.08] flex flex-wrap items-center gap-1">
                        {[
                          {id: 'bold' as const, label: 'Bold', icon: <Bold className="w-4 h-4" />},
                          {
                            id: 'italic' as const,
                            label: 'Italic',
                            icon: <Italic className="w-4 h-4" />,
                          },
                          {
                            id: 'heading' as const,
                            label: 'Heading',
                            icon: <Heading2 className="w-4 h-4" />,
                          },
                          {
                            id: 'ul' as const,
                            label: 'Bullet List',
                            icon: <List className="w-4 h-4" />,
                          },
                          {
                            id: 'ol' as const,
                            label: 'Numbered List',
                            icon: <ListOrdered className="w-4 h-4" />,
                          },
                          {
                            id: 'spec' as const,
                            label: 'Insert Spec Snippet',
                            icon: <Table className="w-4 h-4" />,
                          },
                        ].map((tool) => (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => {
                              setEditorMode('write');
                              applyFormatting(tool.id);
                            }}
                            title={tool.label}
                            aria-label={tool.label}
                            className="h-8 px-2.5 rounded-md text-[#424242] hover:bg-white hover:text-[#F85606] hover:shadow-xs flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
                          >
                            {tool.icon}
                            {tool.id === 'spec' && (
                              <span className="hidden sm:inline">Add Specs</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {editorMode === 'write' ? (
                        <textarea
                          ref={textareaRef}
                          rows={8}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write detailed product overview, key highlights, and specifications..."
                          className="w-full p-4 text-sm text-[#212121] leading-relaxed focus:outline-none resize-y"
                        />
                      ) : (
                        <div className="p-5 min-h-[210px] space-y-2 text-sm text-[#424242]">
                          {description.split('\n').map((line, i) => {
                            const trimmed = line.trim();
                            if (!trimmed) return <div key={i} className="h-2" />;
                            if (trimmed.startsWith('## ')) {
                              return (
                                <h4
                                  key={i}
                                  className="font-display text-base font-bold text-[#212121] pt-1"
                                >
                                  {trimmed.slice(3)}
                                </h4>
                              );
                            }
                            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                              return (
                                <p key={i} className="font-bold text-[#212121] pt-1">
                                  {trimmed.slice(2, -2)}
                                </p>
                              );
                            }
                            if (trimmed.startsWith('- ')) {
                              return (
                                <div key={i} className="flex items-start gap-2 pl-2">
                                  <span className="text-[#F85606] font-bold">•</span>
                                  <span>{trimmed.slice(2).replace(/\*\*/g, '')}</span>
                                </div>
                              );
                            }
                            return <p key={i}>{trimmed.replace(/\*\*/g, '')}</p>;
                          })}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 4. ACTION BUTTONS */}
                  <div className="pt-6 border-t border-black/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleSubmitProduct('draft')}
                      className="h-11 px-6 rounded-lg border border-black/15 bg-white hover:bg-[#F5F5F5] text-[#212121] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitProduct('published')}
                      className="h-11 px-7 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-bold transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      Publish Product
                    </button>
                  </div>
                </div>
              ) : (
                /* MANAGE CATALOG TABLE */
                <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#FAFAFA] border-b border-black/[0.07] text-xs font-semibold text-[#6E6E6E]">
                        <tr>
                          <th className="py-3.5 px-4">Product</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price</th>
                          <th className="py-3.5 px-4">Stock</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.06]">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#FAFAFA]">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-10 rounded overflow-hidden border border-black/[0.07] shrink-0">
                                  <ProductArtwork
                                    artworkKey={prod.artworkKey}
                                    customImageUrls={prod.customImageUrls}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onViewProductInStore(prod)}
                                  className="font-semibold text-[#212121] hover:text-[#F85606] text-left line-clamp-1 max-w-[260px] cursor-pointer"
                                >
                                  {prod.title}
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#6E6E6E] whitespace-nowrap">
                              {prod.category}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#F85606] tabular-nums whitespace-nowrap">
                              {formatPKR(prod.price)}
                            </td>
                            <td className="py-3 px-4 tabular-nums text-[#212121]">
                              {prod.stockLeft ?? 32}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`text-xs font-semibold ${
                                  prod.status === 'draft' ? 'text-[#757575]' : 'text-[#15803D]'
                                }`}
                              >
                                {prod.status === 'draft' ? 'Draft' : 'Published'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => onDeleteProduct(prod.id)}
                                aria-label={`Delete ${prod.title}`}
                                className="p-1.5 rounded-md text-[#8C8C8C] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== ORDERS MANAGEMENT ===================== */}
          {activeNav === 'orders' && (
            <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
              <div className="px-5 py-4 border-b border-black/[0.07] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#212121]">
                    Store Orders &amp; Courier Dispatch
                  </h2>
                  <p className="text-xs text-[#757575] mt-0.5">
                    Assign a Pakistani courier partner (TCS, Leopards, PostEx, Trax) and Tracking ID before marking orders as Shipped.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#F5F5F5] p-1 rounded-lg">
                  {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        orderFilter === st
                          ? 'bg-white text-[#212121] shadow-xs'
                          : 'text-[#6E6E6E] hover:text-[#212121]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {orderValidationError && (
                <div className="mx-5 mt-3 px-3.5 py-2.5 rounded-lg bg-[#FFF3EC] border border-[#F85606]/30 text-xs font-semibold text-[#C2410C] flex items-center justify-between gap-2">
                  <span>{orderValidationError}</span>
                  <button
                    type="button"
                    onClick={() => setOrderValidationError(null)}
                    className="text-[#C2410C] hover:text-[#212121] cursor-pointer"
                    aria-label="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-[#FAFAFA] border-b border-black/[0.07] text-xs font-semibold text-[#6E6E6E]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Courier Partner</th>
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06]">
                    {orders
                      .filter((o) => orderFilter === 'All' || o.status === orderFilter)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAFAFA] align-middle">
                          <td className="py-3.5 px-4 font-bold text-[#212121] tabular-nums whitespace-nowrap">
                            #{order.id}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <p className="font-medium text-[#212121]">{order.customer}</p>
                            {order.city && (
                              <p className="text-[11px] text-[#757575]">{order.city}</p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[#6E6E6E] max-w-[200px] truncate">
                            {order.itemsSummary}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#F85606] tabular-nums whitespace-nowrap">
                            {formatPKR(order.total)}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#6E6E6E] whitespace-nowrap">
                            {order.payment}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={order.courier ?? ''}
                              onChange={(e) => {
                                setOrderValidationError(null);
                                onUpdateOrderTracking(order.id, {
                                  courier: e.target.value as CourierPartner | '',
                                });
                              }}
                              aria-label={`Order ${order.id} courier partner`}
                              className="h-8 px-2.5 rounded-md border border-black/15 bg-white text-xs font-semibold text-[#212121] focus:outline-none focus:border-[#F85606] cursor-pointer"
                            >
                              <option value="">Select Courier</option>
                              {COURIER_PARTNERS.map((partner) => (
                                <option key={partner} value={partner}>
                                  {partner}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={order.trackingId ?? ''}
                              onChange={(e) => {
                                setOrderValidationError(null);
                                onUpdateOrderTracking(order.id, {
                                  trackingId: e.target.value,
                                });
                              }}
                              placeholder="Enter Tracking ID"
                              aria-label={`Order ${order.id} tracking ID`}
                              className="h-8 w-36 px-2.5 rounded-md border border-black/15 bg-white text-xs text-[#212121] placeholder:text-[#9E9E9E] tabular-nums focus:outline-none focus:border-[#F85606]"
                            />
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(
                                  order.id,
                                  e.target.value as SellerOrderRecord['status']
                                )
                              }
                              aria-label={`Order ${order.id} status`}
                              className={`h-8 px-2.5 rounded-md border text-xs font-semibold focus:outline-none focus:border-[#F85606] cursor-pointer ${
                                order.status === 'Shipped'
                                  ? 'border-[#F85606]/40 bg-[#FFF3EC] text-[#F85606]'
                                  : order.status === 'Delivered'
                                    ? 'border-emerald-200 bg-emerald-50 text-[#15803D]'
                                    : 'border-black/15 bg-white text-[#212121]'
                              }`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const chosenCourier = order.courier;
                                const trimmedTracking = (order.trackingId ?? '').trim();
                                if (!chosenCourier || !trimmedTracking) {
                                  setOrderValidationError(
                                    `Order #${order.id}: Please select a Courier Partner and enter a Tracking ID before marking as Shipped.`
                                  );
                                  return;
                                }
                                setOrderValidationError(null);
                                onUpdateOrderTracking(order.id, {
                                  courier: chosenCourier,
                                  trackingId: trimmedTracking,
                                  status: 'Shipped',
                                });
                              }}
                              className={`h-8 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                order.status === 'Shipped'
                                  ? 'bg-[#FFF3EC] text-[#F85606] border border-[#F85606]/30 hover:bg-[#FFE6D6]'
                                  : 'bg-[#F85606] hover:bg-[#E04A00] text-white'
                              }`}
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>
                                {order.status === 'Shipped' ? 'Update Dispatch' : 'Mark Shipped'}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== CUSTOMER REVIEWS MANAGEMENT ===================== */}
          {activeNav === 'reviews' && (
            <div className="bg-white rounded-xl border border-black/[0.07] p-5 sm:p-6 space-y-5">
              <div className="border-b border-black/[0.07] pb-3">
                <h2 className="font-display text-lg font-bold text-[#212121]">
                  Customer Reviews
                </h2>
                <p className="text-xs text-[#757575] mt-0.5">
                  Respond to verified buyer feedback across your catalog.
                </p>
              </div>

              <div className="divide-y divide-black/[0.07]">
                {allReviews.slice(0, 6).map((rev) => {
                  const key = `${rev.productId}-${rev.id}`;
                  const existingReply = reviewReplies[key];
                  return (
                    <div key={key} className="py-4 first:pt-1 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-[#F85606]">
                            {rev.productTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5 text-[#F59E0B]">
                              {Array.from({length: 5}).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                                      : 'text-[#D4D4D4]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-[#212121]">
                              {rev.author}
                            </span>
                            <span className="text-xs text-[#757575]">· {rev.date}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-[#424242]">{rev.comment}</p>

                      {existingReply ? (
                        <div className="p-3 rounded-lg bg-[#FAFAFA] border border-black/[0.06] text-xs text-[#424242]">
                          <span className="font-bold text-[#212121]">Seller Reply: </span>
                          {existingReply}
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const val = (replyDrafts[key] ?? '').trim();
                            if (!val) return;
                            setReviewReplies((prev) => ({...prev, [key]: val}));
                          }}
                          className="flex gap-2 pt-1"
                        >
                          <input
                            type="text"
                            value={replyDrafts[key] ?? ''}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({...prev, [key]: e.target.value}))
                            }
                            placeholder="Write a helpful seller reply..."
                            className="flex-1 h-9 px-3 rounded-lg border border-black/15 text-xs focus:outline-none focus:border-[#F85606]"
                          />
                          <button
                            type="submit"
                            className="h-9 px-4 rounded-lg bg-[#212121] hover:bg-[#383838] text-white text-xs font-semibold cursor-pointer"
                          >
                            Reply
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
