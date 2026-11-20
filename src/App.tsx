import {useState} from 'react';
import {CheckCircle2, X} from 'lucide-react';
import {
  CATEGORIES,
  PRODUCTS,
  type CategoryItem,
  type CategoryName,
  type Product,
} from './data/catalog';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {FlashSaleSection} from './components/FlashSaleSection';
import {JustForYouSection} from './components/JustForYouSection';
import {ProductDetailPage} from './components/ProductDetailPage';
import {
  CartCheckoutPage,
  type CartItem,
  type CheckoutPaymentMethod,
  type PakistanCity,
} from './components/CartCheckoutPage';
import {
  SellerDashboardPage,
  type CourierPartner,
  type SellerOrderRecord,
} from './components/SellerDashboardPage';
import {WishlistDrawer} from './components/WishlistDrawer';
import {AuthModal} from './components/AuthModal';
import {Footer} from './components/Footer';
import {FloatingWhatsAppButton} from './components/WhatsAppButton';
import {OrderTrackingPage} from './components/OrderTrackingPage';

type ActiveView = 'home' | 'pdp' | 'cart' | 'checkout' | 'seller' | 'tracking';

const INITIAL_ORDERS: SellerOrderRecord[] = [
  {
    id: 'HS-491820',
    customer: 'Hamza Siddiqui',
    city: 'Karachi',
    itemsSummary: 'Acoustic Studio ANC Wireless Headphones × 1',
    total: 18900,
    date: 'Nov 20, 2026',
    payment: 'Cash on Delivery',
    status: 'Processing',
    courier: '',
    trackingId: '',
  },
  {
    id: 'HS-491744',
    customer: 'Ayesha Khan',
    city: 'Lahore',
    itemsSummary: 'Apex Series 4 Titanium GPS Smartwatch × 1',
    total: 28500,
    date: 'Nov 19, 2026',
    payment: 'Credit / Debit Card',
    status: 'Shipped',
    courier: 'TCS',
    trackingId: 'TCS-PK-8841209',
  },
  {
    id: 'HS-491612',
    customer: 'Bilal Ahmed',
    city: 'Islamabad',
    itemsSummary: 'VoltMax 140W GaN Fast Wall Charger × 1',
    total: 7700,
    date: 'Nov 18, 2026',
    payment: 'Mobile Wallet',
    status: 'Delivered',
    courier: 'Leopards',
    trackingId: 'LEO-7731904',
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryName | 'All'>('All');

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      quantity: 1,
      selected: true,
    },
    {
      product: PRODUCTS[4],
      variant: PRODUCTS[4].variants[0],
      quantity: 1,
      selected: true,
    },
  ]);

  const [sellerOrders, setSellerOrders] = useState<SellerOrderRecord[]>(INITIAL_ORDERS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([PRODUCTS[2].id]);
  const [userName, setUserName] = useState<string | null>(null);

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [toast, setToast] = useState<{message: string; showCartLink?: boolean} | null>(null);

  const showToast = (message: string, showCartLink = false) => {
    setToast({message, showCartLink});
    window.setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  const publishedProducts = catalogProducts.filter((p) => p.status !== 'draft');

  const handleAddToCart = (product: Product, quantity = 1, variant?: string, silent = false) => {
    const chosenVariant = variant ?? product.variants[0] ?? 'Standard';
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === chosenVariant
      );
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? {...item, quantity: item.quantity + quantity, selected: true}
            : item
        );
      }
      return [...prev, {product, variant: chosenVariant, quantity, selected: true}];
    });
    if (!silent) {
      showToast(`Added "${product.title}" to cart`, true);
    }
  };

  const handleBuyNow = (product: Product, quantity = 1, variant?: string) => {
    handleAddToCart(product, quantity, variant, true);
    setActiveView('checkout');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleToggleCartSelect = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant
          ? {...item, selected: !item.selected}
          : item
      )
    );
  };

  const handleToggleSelectAllCart = (selected: boolean) => {
    setCartItems((prev) => prev.map((item) => ({...item, selected})));
  };

  const handleUpdateCartQty = (productId: string, variant: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.variant === variant
            ? {...item, quantity: item.quantity + delta}
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
  };

  const handleRemoveSelectedCartItems = () => {
    setCartItems((prev) => prev.filter((item) => !item.selected));
  };

  const handleOrderCompleted = ({
    orderNumber,
    purchasedItems,
    total,
    city,
    paymentMethod,
    customerName,
  }: {
    orderNumber: string;
    purchasedItems: CartItem[];
    total: number;
    city: PakistanCity;
    paymentMethod: CheckoutPaymentMethod;
    customerName: string;
  }) => {
    const purchasedKeys = new Set(
      purchasedItems.map((i) => `${i.product.id}::${i.variant}`)
    );
    setCartItems((prev) =>
      prev.filter((item) => !purchasedKeys.has(`${item.product.id}::${item.variant}`))
    );

    const paymentLabel =
      paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : paymentMethod === 'card'
          ? 'Credit / Debit Card'
          : 'Mobile Wallet';

    setSellerOrders((prev) => [
      {
        id: orderNumber,
        customer: customerName.trim() || userName || 'Guest Shopper',
        city,
        itemsSummary: purchasedItems
          .map((i) => `${i.product.title} × ${i.quantity}`)
          .join(', '),
        total,
        date: 'Nov 20, 2026',
        payment: paymentLabel,
        status: 'Processing',
        courier: '',
        trackingId: '',
      },
      ...prev,
    ]);
  };

  const handleOpenOrderTracking = (orderId = '') => {
    setTrackingOrderId(orderId);
    setActiveView('tracking');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      showToast(exists ? 'Removed from wishlist' : `Saved "${product.title}" to wishlist`);
      return exists ? prev.filter((id) => id !== product.id) : [...prev, product.id];
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('pdp');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    setSelectedProduct(null);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSelectCategory = (cat: CategoryName | 'All') => {
    setActiveCategory(cat);
    if (activeView !== 'home') {
      setActiveView('home');
      setSelectedProduct(null);
      window.setTimeout(() => {
        const el = document.getElementById('just-for-you');
        el?.scrollIntoView({behavior: 'smooth'});
      }, 60);
    }
  };

  const handleSearchSubmit = (q: string) => {
    setSearchQuery(q);
    if (activeView !== 'home') {
      setActiveView('home');
      setSelectedProduct(null);
    }
    window.setTimeout(() => {
      const el = document.getElementById('just-for-you');
      el?.scrollIntoView({behavior: 'smooth'});
    }, 60);
  };

  const handleCreateCategory = (rawName: string): CategoryItem | null => {
    const trimmed = rawName.trim();
    if (!trimmed) return null;

    const existing = categories.find(
      (c) => c.id.toLowerCase() === trimmed.toLowerCase() || c.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      showToast(`Category "${existing.label}" is already available`);
      return existing;
    }

    const newCategory: CategoryItem = {
      id: trimmed,
      label: trimmed,
      tagline: 'Custom store department',
      subcategories: ['All Products'],
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Added custom category "${trimmed}"`);
    return newCategory;
  };

  const handleSaveSellerProduct = (newProduct: Product, status: 'draft' | 'published') => {
    setCatalogProducts((prev) => [newProduct, ...prev]);
    showToast(
      status === 'published'
        ? `Published "${newProduct.title}" to storefront`
        : `Saved "${newProduct.title}" as Draft`
    );
  };

  const handleDeleteSellerProduct = (productId: string) => {
    setCatalogProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog');
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: SellerOrderRecord['status']
  ) => {
    setSellerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? {...o, status} : o))
    );
    showToast(`Order #${orderId} updated to ${status}`);
  };

  const handleUpdateOrderTracking = (
    orderId: string,
    updates: {
      courier?: CourierPartner | '';
      trackingId?: string;
      status?: SellerOrderRecord['status'];
    }
  ) => {
    setSellerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? {...o, ...updates} : o))
    );
    if (updates.status === 'Shipped') {
      showToast(
        `Order #${orderId} marked Shipped via ${updates.courier || 'Courier'} (${updates.trackingId || ''})`
      );
    }
  };

  const flashSaleProducts = publishedProducts.filter((p) => p.isFlashSale);
  const wishlistProducts = publishedProducts.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#212121]">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        userName={userName}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenCart={() => {
          setActiveView('cart');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenSeller={() => {
          setActiveView('seller');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onLogoClick={handleNavigateHome}
        allProducts={publishedProducts}
        onSelectProduct={handleSelectProduct}
      />

      <main className="flex-1">
        {activeView === 'tracking' ? (
          <OrderTrackingPage
            orders={sellerOrders}
            initialOrderId={trackingOrderId}
            onBackToStore={handleNavigateHome}
          />
        ) : activeView === 'seller' ? (
          <SellerDashboardPage
            products={catalogProducts}
            categories={categories}
            orders={sellerOrders}
            onSaveProduct={handleSaveSellerProduct}
            onCreateCategory={handleCreateCategory}
            onDeleteProduct={handleDeleteSellerProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrderTracking={handleUpdateOrderTracking}
            onViewProductInStore={handleSelectProduct}
            onBackToStore={handleNavigateHome}
          />
        ) : activeView === 'cart' || activeView === 'checkout' ? (
          <CartCheckoutPage
            mode={activeView}
            items={cartItems}
            onChangeMode={(mode) => setActiveView(mode)}
            onContinueShopping={handleNavigateHome}
            onSelectProduct={handleSelectProduct}
            onToggleSelect={handleToggleCartSelect}
            onToggleSelectAll={handleToggleSelectAllCart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onRemoveSelected={handleRemoveSelectedCartItems}
            onOrderCompleted={handleOrderCompleted}
            onTrackOrder={(orderNum) => handleOpenOrderTracking(orderNum)}
          />
        ) : activeView === 'pdp' && selectedProduct ? (
          <ProductDetailPage
            key={selectedProduct.id}
            product={selectedProduct}
            relatedProducts={publishedProducts.filter(
              (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
            )}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onBack={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p, qty, variant) => handleAddToCart(p, qty, variant)}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <>
            <HeroSection
              categories={categories}
              totalProductsCount={publishedProducts.length}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
            <FlashSaleSection
              products={flashSaleProducts}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(product) => handleAddToCart(product, 1)}
            />
            <JustForYouSection
              products={publishedProducts}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onClearFilters={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onBuyNow={(product) => handleBuyNow(product, 1)}
              onSelectProduct={handleSelectProduct}
            />
          </>
        )}
      </main>

      <Footer
        onNavigateHome={handleNavigateHome}
        onOpenSeller={() => {
          setActiveView('seller');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onOpenOrderTracking={() => handleOpenOrderTracking()}
        onSelectSupportTopic={(topic) =>
          showToast(`${topic} — 24/7 support available via Help Center`)
        }
      />

      <WishlistDrawer
        open={wishlistOpen}
        items={wishlistProducts}
        onClose={() => setWishlistOpen(false)}
        onMoveToCart={(product) => {
          handleAddToCart(product, 1);
          setWishlistIds((prev) => prev.filter((id) => id !== product.id));
        }}
        onRemove={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
      />

      <AuthModal
        open={authOpen}
        userName={userName}
        onClose={() => setAuthOpen(false)}
        onSignIn={(name) => {
          setUserName(name);
          showToast(`Signed in as ${name}`);
        }}
        onSignOut={() => {
          setUserName(null);
          showToast('Signed out');
        }}
      />

      {/* Non-intrusive Action Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-50 bg-[#212121] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium max-w-md"
        >
          <CheckCircle2 className="w-4 h-4 text-[#F85606] shrink-0" />
          <span className="truncate">{toast.message}</span>
          {toast.showCartLink && (
            <button
              type="button"
              onClick={() => {
                setToast(null);
                setActiveView('cart');
                window.scrollTo({top: 0, behavior: 'smooth'});
              }}
              className="ml-1 text-[#FF8A4C] hover:text-white font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              View Cart
            </button>
          )}
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="text-white/60 hover:text-white ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <FloatingWhatsAppButton />
    </div>
  );
}
