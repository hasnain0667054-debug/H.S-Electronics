import React, {useState} from 'react';
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Tag,
  Trash2,
} from 'lucide-react';
import {formatPKR, type Product} from '../data/catalog';
import {ProductArtwork} from './ProductArtwork';

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
  selected: boolean;
}

export type CheckoutPaymentMethod = 'cod' | 'card' | 'wallet';

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Other',
] as const;

export type PakistanCity = (typeof PAKISTAN_CITIES)[number];

interface ConfirmedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  promoCode: string | null;
  total: number;
  shipping: {
    fullName: string;
    phone: string;
    city: PakistanCity;
    address: string;
  };
  paymentMethod: CheckoutPaymentMethod;
}

interface CartCheckoutPageProps {
  mode: 'cart' | 'checkout';
  items: CartItem[];
  onChangeMode: (mode: 'cart' | 'checkout') => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleSelect: (productId: string, variant: string) => void;
  onToggleSelectAll: (selected: boolean) => void;
  onUpdateQty: (productId: string, variant: string, delta: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onRemoveSelected: () => void;
  onOrderCompleted: (details: {
    orderNumber: string;
    purchasedItems: CartItem[];
    total: number;
    city: PakistanCity;
    paymentMethod: CheckoutPaymentMethod;
    customerName: string;
  }) => void;
  onTrackOrder?: (orderNumber: string) => void;
}

const VALID_PROMOS: Record<string, {type: 'percent' | 'fixed'; value: number; label: string}> = {
  SAVE10: {type: 'percent', value: 10, label: '10% Off Order'},
  HS500: {type: 'fixed', value: 500, label: 'Rs. 500 Off'},
  WELCOME20: {type: 'percent', value: 20, label: '20% Welcome Discount'},
};

export const CartCheckoutPage: React.FC<CartCheckoutPageProps> = ({
  mode,
  items,
  onChangeMode,
  onContinueShopping,
  onSelectProduct,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateQty,
  onRemoveItem,
  onRemoveSelected,
  onOrderCompleted,
  onTrackOrder,
}) => {
  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Checkout form state (Pakistan defaults)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<PakistanCity>('Karachi');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('cod');
  const [cardLast4, setCardLast4] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [walletHandle, setWalletHandle] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const selectedItems = items.filter((i) => i.selected);
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const selectedUnitCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Standard city-based delivery fee calculation for Pakistan:
  // Rs. 200 for Karachi and Rs. 300 for all other cities.
  const baseCityFee = city === 'Karachi' ? 200 : 300;
  const shippingFee = selectedItems.length === 0 ? 0 : baseCityFee;

  const promoRule = appliedPromo ? VALID_PROMOS[appliedPromo] : null;
  const discountAmount =
    promoRule && subtotal > 0
      ? promoRule.type === 'percent'
        ? Math.round((subtotal * promoRule.value) / 100)
        : Math.min(subtotal, promoRule.value)
      : 0;

  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code to apply.');
      return;
    }
    if (VALID_PROMOS[code]) {
      setAppliedPromo(code);
      setPromoError(null);
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try SAVE10 or HS500.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    const order: ConfirmedOrder = {
      orderNumber: `HS-${Math.floor(100000 + Math.random() * 899999)}`,
      items: selectedItems,
      subtotal,
      shippingFee,
      discountAmount,
      promoCode: appliedPromo,
      total: totalAmount,
      shipping: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
      },
      paymentMethod,
    };

    setConfirmedOrder(order);
    onOrderCompleted({
      orderNumber: order.orderNumber,
      purchasedItems: selectedItems,
      total: totalAmount,
      city,
      paymentMethod,
      customerName: fullName.trim() || 'Customer',
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    const paymentLabel =
      confirmedOrder.paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : confirmedOrder.paymentMethod === 'card'
          ? 'Credit / Debit Card'
          : 'Mobile Wallet';

    return (
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="bg-white rounded-2xl border border-black/[0.07] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F85606] tabular-nums">
                  Order #{confirmedOrder.orderNumber} Confirmed
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#212121] mt-0.5">
                  Thank you, {confirmedOrder.shipping.fullName}
                </h1>
                <p className="text-sm text-[#6E6E6E] mt-1">
                  Your parcel will be dispatched from our Karachi fulfillment hub within 24 hours.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {onTrackOrder && (
                <button
                  type="button"
                  onClick={() => {
                    const ordId = confirmedOrder.orderNumber;
                    setConfirmedOrder(null);
                    onTrackOrder(ordId);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-black/15 bg-white hover:border-[#F85606] hover:text-[#F85606] text-[#212121] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Track Order
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  onContinueShopping();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1.5">
              <p className="text-xs font-semibold text-[#757575]">Shipping Destination</p>
              <p className="font-semibold text-[#212121]">{confirmedOrder.shipping.fullName}</p>
              <p className="text-[#424242]">{confirmedOrder.shipping.address}</p>
              <p className="text-[#424242]">
                {confirmedOrder.shipping.city}, Pakistan · {confirmedOrder.shipping.phone}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1.5">
              <p className="text-xs font-semibold text-[#757575]">Payment & Fulfillment</p>
              <p className="font-semibold text-[#212121]">{paymentLabel}</p>
              <p className="text-[#424242]">
                Estimated Delivery:{' '}
                {confirmedOrder.shipping.city === 'Karachi'
                  ? '1–2 Business Days'
                  : '2–4 Business Days'}
              </p>
              <p className="text-xs text-[#15803D] font-medium">
                14-Day Free Return Protection Included
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-base font-bold text-[#212121]">Items Ordered</h2>
            <ul className="divide-y divide-black/[0.07] border border-black/[0.07] rounded-xl overflow-hidden">
              {confirmedOrder.items.map((item) => (
                <li
                  key={`${item.product.id}-${item.variant}`}
                  className="p-4 flex items-center gap-4 bg-white"
                >
                  <div className="w-16 h-14 rounded-lg overflow-hidden border border-black/[0.07] shrink-0">
                    <ProductArtwork
                      artworkKey={item.product.artworkKey}
                      customImageUrls={item.product.customImageUrls}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-[#757575] tabular-nums">
                      {item.variant} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#212121] tabular-nums shrink-0">
                    {formatPKR(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-black/[0.08] flex flex-col items-end space-y-1.5 text-sm tabular-nums">
            <div className="w-full max-w-xs flex justify-between text-[#6E6E6E]">
              <span>Subtotal</span>
              <span>{formatPKR(confirmedOrder.subtotal)}</span>
            </div>
            <div className="w-full max-w-xs flex justify-between text-[#6E6E6E]">
              <span>Shipping ({confirmedOrder.shipping.city})</span>
              <span>{formatPKR(confirmedOrder.shippingFee)}</span>
            </div>
            {confirmedOrder.discountAmount > 0 && (
              <div className="w-full max-w-xs flex justify-between text-[#15803D] font-medium">
                <span>Promo ({confirmedOrder.promoCode})</span>
                <span>-{formatPKR(confirmedOrder.discountAmount)}</span>
              </div>
            )}
            <div className="w-full max-w-xs flex justify-between text-lg font-bold text-[#212121] pt-2 border-t border-black/[0.07]">
              <span>Total Amount</span>
              <span className="text-[#F85606]">{formatPKR(confirmedOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">
      {/* Top Stepper & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (mode === 'checkout' ? onChangeMode('cart') : onContinueShopping())}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#212121] hover:text-[#F85606] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{mode === 'checkout' ? 'Back to Shopping Cart' : 'Continue Shopping'}</span>
        </button>

        {/* Clean 3-Step Indicator */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onChangeMode('cart')}
            className={`flex items-center gap-1.5 font-semibold cursor-pointer ${
              mode === 'cart' ? 'text-[#F85606]' : 'text-[#15803D]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                mode === 'cart' ? 'bg-[#F85606] text-white' : 'bg-[#15803D] text-white'
              }`}
            >
              {mode === 'checkout' ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>Shopping Cart</span>
          </button>
          <span className="w-6 h-px bg-black/15" aria-hidden="true" />
          <div
            className={`flex items-center gap-1.5 font-semibold ${
              mode === 'checkout' ? 'text-[#F85606]' : 'text-[#8C8C8C]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                mode === 'checkout' ? 'bg-[#F85606] text-white' : 'bg-black/10 text-[#616161]'
              }`}
            >
              2
            </span>
            <span>Shipping & Payment</span>
          </div>
          <span className="hidden sm:block w-6 h-px bg-black/15" aria-hidden="true" />
          <div className="hidden sm:flex items-center gap-1.5 font-medium text-[#8C8C8C]">
            <span className="w-5 h-5 rounded-full text-[11px] font-bold bg-black/10 text-[#616161] flex items-center justify-center">
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Empty Cart Fallback */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/[0.07] p-12 sm:p-16 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#D4D4D4] mx-auto" />
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-[#212121]">
              Your shopping cart is empty
            </h1>
            <p className="text-sm text-[#757575]">
              Add gadgets or accessories from Flash Sale or Just For You to start checking out.
            </p>
          </div>
          <button
            type="button"
            onClick={onContinueShopping}
            className="px-6 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Browse H.S Electronics
          </button>
        </div>
      ) : mode === 'cart' ? (
        /* ============================ SHOPPING CART VIEW ============================ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: List of Added Products with Checkboxes */}
          <div className="lg:col-span-8 space-y-3">
            {/* Select All Control Bar */}
            <div className="bg-white rounded-xl border border-black/[0.07] px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-black/30 accent-[#F85606] cursor-pointer"
                />
                <span className="text-sm font-semibold text-[#212121] tabular-nums">
                  Select All ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              </label>

              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={onRemoveSelected}
                  className="text-xs font-semibold text-[#6E6E6E] hover:text-[#DC2626] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              )}
            </div>

            {/* Added Product Rows */}
            <div className="bg-white rounded-xl border border-black/[0.07] divide-y divide-black/[0.07] overflow-hidden">
              {items.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.variant}`}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${
                      item.selected ? 'bg-white' : 'bg-[#FAFAFA] opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Item Checkbox */}
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => onToggleSelect(item.product.id, item.variant)}
                        aria-label={`Select ${item.product.title}`}
                        className="w-4 h-4 rounded border-black/30 accent-[#F85606] shrink-0 cursor-pointer"
                      />

                      {/* Product Thumbnail */}
                      <button
                        type="button"
                        onClick={() => onSelectProduct(item.product)}
                        className="w-24 h-20 rounded-lg overflow-hidden border border-black/[0.08] shrink-0 cursor-pointer"
                      >
                        <ProductArtwork
                          artworkKey={item.product.artworkKey}
                          customImageUrls={item.product.customImageUrls}
                        />
                      </button>

                      {/* Title & Variant Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[11px] font-medium text-[#757575] uppercase tracking-wider">
                          {item.product.brand}
                        </p>
                        <button
                          type="button"
                          onClick={() => onSelectProduct(item.product)}
                          className="text-left text-sm sm:text-[15px] font-semibold text-[#212121] hover:text-[#F85606] line-clamp-2 leading-snug transition-colors cursor-pointer"
                        >
                          {item.product.title}
                        </button>
                        <p className="text-xs text-[#6E6E6E]">
                          Option: <span className="font-medium text-[#212121]">{item.variant}</span>
                        </p>
                        <p className="text-[11px] text-[#15803D] font-medium">
                          {item.product.shippingNote}
                        </p>
                      </div>
                    </div>

                    {/* Price, Quantity Stepper (+ / -), Delete Trash Icon */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 pl-7 sm:pl-0 shrink-0">
                      <div className="text-left sm:text-right tabular-nums">
                        <p className="text-base font-bold text-[#F85606]">
                          {formatPKR(lineTotal)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-[#757575]">
                            {formatPKR(item.product.price)} each
                          </p>
                        )}
                        {item.product.originalPrice && (
                          <p className="text-[11px] text-[#9E9E9E] line-through">
                            {formatPKR(item.product.originalPrice * item.quantity)}
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center rounded-lg border border-black/15 bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.product.id, item.variant, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#424242] hover:bg-[#F5F5F5] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-[#212121] tabular-nums border-x border-black/10">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.product.id, item.variant, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#424242] hover:bg-[#F5F5F5] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete Trash Icon */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.variant)}
                        aria-label={`Delete ${item.product.title}`}
                        className="w-8 h-8 rounded-lg text-[#8C8C8C] hover:text-[#DC2626] hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Sticky Order Summary Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-xl border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 sm:p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-[#212121]">Order Summary</h2>

            {/* Line Breakdown */}
            <div className="space-y-2.5 text-sm tabular-nums">
              <div className="flex items-center justify-between text-[#6E6E6E]">
                <span>Subtotal ({selectedUnitCount} items)</span>
                <span className="font-semibold text-[#212121]">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#6E6E6E]">
                <span>Shipping Fee ({city})</span>
                <span className="font-semibold text-[#212121]">
                  {selectedItems.length === 0 ? 'Rs. 0' : formatPKR(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && appliedPromo && (
                <div className="flex items-center justify-between text-[#15803D] font-medium">
                  <span className="flex items-center gap-1.5">
                    Promo ({appliedPromo})
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-[11px] underline text-[#757575] hover:text-[#212121] cursor-pointer"
                    >
                      Remove
                    </button>
                  </span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Promo Code Input + Apply Button */}
            <div className="pt-3 border-t border-black/[0.07] space-y-2">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8C8C8C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder="Enter Promo Code"
                    aria-label="Promo code"
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-black/15 text-xs sm:text-sm text-[#212121] placeholder:text-[#8C8C8C] focus:outline-none focus:border-[#F85606]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#212121] hover:bg-[#383838] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>
              {promoError ? (
                <p className="text-[11px] text-[#DC2626] font-medium">{promoError}</p>
              ) : (
                <p className="text-[11px] text-[#757575]">
                  Available codes: <strong className="text-[#212121]">SAVE10</strong> (10% off) ·{' '}
                  <strong className="text-[#212121]">HS500</strong> (Rs. 500 off)
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div className="pt-3 border-t border-black/[0.08] flex items-baseline justify-between tabular-nums">
              <span className="text-base font-bold text-[#212121]">Total Amount</span>
              <span className="font-display text-2xl font-bold text-[#F85606]">
                {formatPKR(totalAmount)}
              </span>
            </div>

            {/* Full-Width Proceed to Checkout Button */}
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={() => {
                onChangeMode('checkout');
                window.scrollTo({top: 0, behavior: 'smooth'});
              }}
              className="w-full h-12 rounded-lg bg-[#F85606] hover:bg-[#E04A00] disabled:bg-black/15 disabled:text-black/40 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
            >
              Proceed to Checkout ({selectedUnitCount})
            </button>
            {selectedItems.length === 0 && (
              <p className="text-xs text-center text-[#757575]">
                Select at least one product to continue to checkout.
              </p>
            )}
          </aside>
        </div>
      ) : (
        /* ============================ CONNECTED CHECKOUT SCREEN ============================ */
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* LEFT SIDE: Shipping Address Form + Payment Method Radio Cards */}
          <div className="lg:col-span-8 space-y-5">
            {/* Shipping Address Card */}
            <section className="bg-white rounded-xl border border-black/[0.07] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-[#F85606]" />
                  <h2 className="font-display text-lg font-bold text-[#212121]">
                    Shipping Address (Pakistan)
                  </h2>
                </div>
                <span className="text-xs text-[#6E6E6E]">
                  Karachi Rs. 200 · Other cities Rs. 300
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="chk-name" className="text-xs font-semibold text-[#212121] block">
                    Full Name
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Hasnan Memon"
                    className="w-full h-10 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] focus:outline-none focus:border-[#F85606]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="chk-phone" className="text-xs font-semibold text-[#212121] block">
                    Phone
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full h-10 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] focus:outline-none focus:border-[#F85606]"
                  />
                </div>

                {/* City Dropdown with Automatic Delivery Fee Calculation */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="chk-city" className="text-xs font-semibold text-[#212121] block">
                      City
                    </label>
                    <span className="text-[11px] font-medium text-[#6E6E6E] tabular-nums">
                      {city === 'Karachi'
                        ? 'Karachi Standard Delivery: Rs. 200'
                        : `${city} Standard Delivery: Rs. 300`}
                    </span>
                  </div>
                  <select
                    id="chk-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value as PakistanCity)}
                    className="w-full h-10 px-3.5 rounded-lg border border-black/15 bg-white text-sm font-medium text-[#212121] focus:outline-none focus:border-[#F85606] cursor-pointer"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c} {c === 'Karachi' ? '(Rs. 200 delivery)' : '(Rs. 300 delivery)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="chk-address"
                    className="text-xs font-semibold text-[#212121] block"
                  >
                    Address
                  </label>
                  <input
                    id="chk-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 14, Block 6, PECHS, Near Shahrah-e-Faisal"
                    className="w-full h-10 px-3.5 rounded-lg border border-black/15 text-sm text-[#212121] focus:outline-none focus:border-[#F85606]"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method Radio Cards */}
            <section className="bg-white rounded-xl border border-black/[0.07] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#F85606]" />
                  <h2 className="font-display text-lg font-bold text-[#212121]">
                    Payment Method
                  </h2>
                </div>
                <span className="text-xs text-[#757575] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypted</span>
                </span>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Select payment method">
                {/* Radio Card 1: Cash on Delivery */}
                <label
                  className={`block rounded-xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#F85606] bg-[#FFF7F2] ring-1 ring-[#F85606]'
                      : 'border-black/12 bg-white hover:border-black/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 accent-[#F85606] cursor-pointer"
                    />
                    <Banknote className="w-5 h-5 text-[#F85606] shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#212121]">Cash on Delivery</p>
                      <p className="text-xs text-[#6E6E6E]">
                        Pay in cash when your parcel arrives at your doorstep across Pakistan.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Radio Card 2: Credit/Debit Card */}
                <label
                  className={`block rounded-xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#F85606] bg-[#FFF7F2] ring-1 ring-[#F85606]'
                      : 'border-black/12 bg-white hover:border-black/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 accent-[#F85606] cursor-pointer"
                    />
                    <CreditCard className="w-5 h-5 text-[#F85606] shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#212121]">Credit / Debit Card</p>
                      <p className="text-xs text-[#6E6E6E]">
                        Visa, Mastercard, or PayPak instant authorization.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-3.5 border-t border-black/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value)}
                        placeholder="Card Number (•••• 4242)"
                        className="sm:col-span-3 h-9 px-3 rounded-lg bg-white border border-black/15 text-xs focus:outline-none focus:border-[#F85606]"
                      />
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="sm:col-span-2 h-9 px-3 rounded-lg bg-white border border-black/15 text-xs focus:outline-none focus:border-[#F85606]"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="h-9 px-3 rounded-lg bg-white border border-black/15 text-xs focus:outline-none focus:border-[#F85606]"
                      />
                    </div>
                  )}
                </label>

                {/* Radio Card 3: Mobile Wallet */}
                <label
                  className={`block rounded-xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-[#F85606] bg-[#FFF7F2] ring-1 ring-[#F85606]'
                      : 'border-black/12 bg-white hover:border-black/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="w-4 h-4 accent-[#F85606] cursor-pointer"
                    />
                    <Smartphone className="w-5 h-5 text-[#F85606] shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#212121]">Mobile Wallet</p>
                      <p className="text-xs text-[#6E6E6E]">
                        JazzCash, Easypaisa, SadaPay, or NayaPay instant transfer.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'wallet' && (
                    <div className="mt-4 pt-3.5 border-t border-black/[0.08]">
                      <input
                        type="text"
                        required
                        value={walletHandle}
                        onChange={(e) => setWalletHandle(e.target.value)}
                        placeholder="JazzCash / Easypaisa Mobile Number (03XX-XXXXXXX)"
                        className="w-full h-9 px-3 rounded-lg bg-white border border-black/15 text-xs focus:outline-none focus:border-[#F85606]"
                      />
                    </div>
                  )}
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: Sticky Order Review & Place Order Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-xl border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#212121]">Order Summary</h2>
              <button
                type="button"
                onClick={() => onChangeMode('cart')}
                className="text-xs font-semibold text-[#F85606] hover:underline cursor-pointer"
              >
                Edit Cart
              </button>
            </div>

            {/* Compact Item List */}
            <ul className="divide-y divide-black/[0.06] max-h-60 overflow-y-auto pr-1">
              {selectedItems.map((item) => (
                <li
                  key={`${item.product.id}-${item.variant}`}
                  className="py-2.5 first:pt-0 flex items-center gap-3"
                >
                  <div className="w-12 h-10 rounded overflow-hidden border border-black/[0.07] shrink-0">
                    <ProductArtwork
                      artworkKey={item.product.artworkKey}
                      customImageUrls={item.product.customImageUrls}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#212121] truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-[#757575] tabular-nums">
                      {item.variant} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#212121] tabular-nums shrink-0">
                    {formatPKR(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-black/[0.07] space-y-2 text-sm tabular-nums">
              <div className="flex justify-between text-[#6E6E6E]">
                <span>Subtotal ({selectedUnitCount} items)</span>
                <span className="font-semibold text-[#212121]">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6E6E6E]">
                <span>Delivery ({city})</span>
                <span className="font-semibold text-[#212121]">{formatPKR(shippingFee)}</span>
              </div>
              {discountAmount > 0 && appliedPromo && (
                <div className="flex justify-between text-[#15803D] font-medium">
                  <span>Promo ({appliedPromo})</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#212121] pt-2.5 border-t border-black/[0.08]">
                <span>Total Amount</span>
                <span className="font-display text-2xl text-[#F85606]">
                  {formatPKR(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#F85606] hover:bg-[#E04A00] text-white font-bold text-sm sm:text-base transition-colors cursor-pointer shadow-sm"
            >
              Place Order
            </button>
          </aside>
        </form>
      )}
    </div>
  );
};
