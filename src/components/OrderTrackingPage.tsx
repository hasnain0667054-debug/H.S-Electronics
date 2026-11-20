import React, {useEffect, useState} from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {formatPKR} from '../data/catalog';
import type {CourierPartner, SellerOrderRecord} from './SellerDashboardPage';
import {buildWhatsAppUrl, WhatsAppIcon} from './WhatsAppButton';

interface OrderTrackingPageProps {
  orders: SellerOrderRecord[];
  initialOrderId?: string;
  onBackToStore: () => void;
}

const COURIER_HOTLINES: Record<CourierPartner, {name: string; service: string; eta: string}> = {
  TCS: {
    name: 'TCS Express Logistics',
    service: 'TCS Overnight / Red Box Express',
    eta: '1–2 Business Days',
  },
  Leopards: {
    name: 'Leopards Courier Services',
    service: 'Leopards Overland & Overnight',
    eta: '1–3 Business Days',
  },
  PostEx: {
    name: 'PostEx Logistics',
    service: 'PostEx Priority COD Express',
    eta: '1–3 Business Days',
  },
  Trax: {
    name: 'Trax Logistics',
    service: 'Trax Nationwide Doorstep Express',
    eta: '2–3 Business Days',
  },
};

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orders,
  initialOrderId = '',
  onBackToStore,
}) => {
  const [query, setQuery] = useState(initialOrderId);
  const [searchedId, setSearchedId] = useState(initialOrderId);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setQuery(initialOrderId);
      setSearchedId(initialOrderId);
    }
  }, [initialOrderId]);

  const normalizeOrderId = (raw: string) => raw.trim().replace(/^#/, '').toUpperCase();

  const normalizedSearch = normalizeOrderId(searchedId);
  const matchedOrder = normalizedSearch
    ? orders.find((o) => o.id.toUpperCase() === normalizedSearch) ?? null
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(query);
    setCopiedTracking(false);
  };

  const handleSelectQuickOrder = (orderId: string) => {
    setQuery(orderId);
    setSearchedId(orderId);
    setCopiedTracking(false);
  };

  const handleCopyTracking = async (trackingId: string) => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopiedTracking(true);
      window.setTimeout(() => setCopiedTracking(false), 2000);
    } catch {
      setCopiedTracking(false);
    }
  };

  const getStepIndex = (status: SellerOrderRecord['status']) => {
    if (status === 'Delivered') return 3;
    if (status === 'Shipped') return 2;
    return 1;
  };

  const buildTimeline = (order: SellerOrderRecord) => {
    const cityLabel = order.city || 'Karachi';
    const courierLabel = order.courier || 'Partner Courier';
    const trackingSuffix = order.trackingId ? ` · Tracking ID: ${order.trackingId}` : '';

    const events: {
      title: string;
      detail: string;
      time: string;
      completed: boolean;
      current?: boolean;
    }[] = [];

    if (order.status === 'Delivered') {
      events.push({
        title: `Delivered in ${cityLabel}`,
        detail: `Parcel signed and handed over at destination (${order.payment}).`,
        time: 'Completed',
        completed: true,
        current: true,
      });
      events.push({
        title: `Out for Delivery via ${courierLabel}`,
        detail: `Assigned rider arrived at ${cityLabel} delivery hub${trackingSuffix}.`,
        time: 'In Transit Update',
        completed: true,
      });
    }

    if (order.status === 'Shipped') {
      events.push({
        title: `In Transit via ${courierLabel}`,
        detail: `Dispatched from H.S Electronics Karachi Hub to ${cityLabel}${trackingSuffix}.`,
        time: 'Live Carrier Scan',
        completed: true,
        current: true,
      });
    }

    events.push({
      title:
        order.status === 'Processing'
          ? 'Packing & Quality Check at Karachi Hub'
          : 'Packed & Handed Over to Carrier',
      detail:
        order.status === 'Processing'
          ? 'Your electronics parcel is undergoing seal inspection and courier label generation.'
          : `Parcel cleared QA seal check and transferred to ${courierLabel}.`,
      time: order.date,
      completed: true,
      current: order.status === 'Processing',
    });

    events.push({
      title: 'Order Confirmed',
      detail: `Order #${order.id} placed by ${order.customer} (${order.payment}).`,
      time: order.date,
      completed: true,
    });

    return events;
  };

  return (
    <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#212121] hover:text-[#F85606] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <span className="text-xs font-medium text-[#757575]">
          H.S Electronics · Nationwide Pakistan Parcel Tracking
        </span>
      </div>

      {/* Main Search Card */}
      <section className="bg-white rounded-2xl border border-black/[0.07] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-5">
        <div className="max-w-2xl space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F85606]">
            <Truck className="w-4 h-4" />
            <span>Real-Time Order Tracking</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#212121]">
            Track Your H.S Electronics Order
          </h1>
          <p className="text-sm text-[#6E6E6E]">
            Enter your Order ID (for example <span className="font-semibold text-[#212121]">HS-491744</span>) to check live shipping status, assigned Pakistani courier partner, and tracking ID.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. HS-491744)"
              aria-label="Order ID"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-black/15 bg-[#FAFAFA] focus:bg-white text-sm font-medium text-[#212121] placeholder:text-[#8C8C8C] tabular-nums focus:outline-none focus:border-[#F85606]"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-7 rounded-xl bg-[#F85606] hover:bg-[#E04A00] text-white font-bold text-sm transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0"
          >
            Track Order
          </button>
        </form>

        {/* Quick Order ID Shortcuts */}
        {orders.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#757575] font-medium">Recent Orders:</span>
            {orders.slice(0, 4).map((o) => {
              const active = normalizeOrderId(searchedId) === o.id.toUpperCase();
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleSelectQuickOrder(o.id)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                    active
                      ? 'border-[#F85606] bg-[#FFF3EC] text-[#F85606]'
                      : 'border-black/10 bg-[#FAFAFA] text-[#424242] hover:border-[#F85606] hover:text-[#F85606]'
                  }`}
                >
                  #{o.id} · {o.status}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Empty Prompt State (before searching) */}
      {!normalizedSearch && (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-8 sm:p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF3EC] text-[#F85606] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#212121]">
            Ready to locate your parcel
          </h2>
          <p className="text-sm text-[#6E6E6E] max-w-md mx-auto">
            Enter your Order ID above or select one of the recent sample orders to inspect live courier details across TCS, Leopards, PostEx, or Trax.
          </p>
        </div>
      )}

      {/* Not Found State */}
      {normalizedSearch && !matchedOrder && (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-8 sm:p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-[#212121]">
              No order found for &ldquo;{searchedId.trim()}&rdquo;
            </h2>
            <p className="text-sm text-[#6E6E6E] max-w-md mx-auto">
              Double-check the Order ID from your checkout confirmation (e.g. HS-491820, HS-491744, or HS-491612).
            </p>
          </div>
          <a
            href={buildWhatsAppUrl(
              `Hello H.S Electronics, I need help tracking my order (${searchedId.trim()}).`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1EB958] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Ask Support on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Live Matched Order Result */}
      {matchedOrder && (
        <div className="space-y-5">
          {/* Summary + 4-Step Progress Card */}
          <section className="bg-white rounded-2xl border border-black/[0.07] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-7">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-black/[0.07]">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#212121] tabular-nums">
                    Order #{matchedOrder.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      matchedOrder.status === 'Delivered'
                        ? 'bg-emerald-50 text-[#15803D] border border-emerald-200'
                        : matchedOrder.status === 'Shipped'
                          ? 'bg-[#FFF3EC] text-[#F85606] border border-[#F85606]/30'
                          : 'bg-[#F5F5F5] text-[#424242] border border-black/10'
                    }`}
                  >
                    {matchedOrder.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E6E6E]">
                  Placed on {matchedOrder.date} · {matchedOrder.customer}
                  {matchedOrder.city ? ` · ${matchedOrder.city}, Pakistan` : ''}
                </p>
              </div>

              <div className="text-left sm:text-right tabular-nums">
                <p className="text-xs text-[#757575]">Order Total ({matchedOrder.payment})</p>
                <p className="font-display text-2xl font-bold text-[#F85606]">
                  {formatPKR(matchedOrder.total)}
                </p>
              </div>
            </div>

            {/* 4-Step Real-Time Progress Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                {label: 'Order Confirmed', sub: matchedOrder.date},
                {label: 'Packed at Hub', sub: 'Karachi Warehouse'},
                {
                  label: 'In Transit',
                  sub: matchedOrder.courier ? `Via ${matchedOrder.courier}` : 'Awaiting Pickup',
                },
                {
                  label: 'Delivered',
                  sub: matchedOrder.city ? `${matchedOrder.city}, PK` : 'Destination',
                },
              ].map((step, idx) => {
                const currentIdx = getStepIndex(matchedOrder.status);
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div
                    key={step.label}
                    className={`rounded-xl border p-3.5 transition-colors ${
                      isCurrent
                        ? 'border-[#F85606] bg-[#FFF8F4]'
                        : isDone
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-black/[0.07] bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#F85606] text-white'
                            : isDone
                              ? 'bg-[#15803D] text-white'
                              : 'bg-black/10 text-[#757575]'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-[#757575]">
                        Step {idx + 1}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#212121]">{step.label}</p>
                    <p className="text-[11px] text-[#6E6E6E] mt-0.5 truncate">{step.sub}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Carrier Details + Live Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Carrier & Parcel Details */}
            <aside className="lg:col-span-5 bg-white rounded-2xl border border-black/[0.07] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-black/[0.07]">
                <Truck className="w-4 h-4 text-[#F85606]" />
                <h2 className="font-display text-base font-bold text-[#212121]">
                  Carrier &amp; Parcel Details
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1">
                  <p className="text-xs text-[#757575]">Courier Partner</p>
                  {matchedOrder.courier ? (
                    <>
                      <p className="font-bold text-[#212121]">
                        {COURIER_HOTLINES[matchedOrder.courier].name} ({matchedOrder.courier})
                      </p>
                      <p className="text-xs text-[#6E6E6E]">
                        {COURIER_HOTLINES[matchedOrder.courier].service}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-[#424242]">
                      Pending Courier Assignment (Preparing for dispatch)
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1.5">
                  <p className="text-xs text-[#757575]">Tracking ID / Airway Bill</p>
                  {matchedOrder.trackingId ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#F85606] tabular-nums">
                        {matchedOrder.trackingId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(matchedOrder.trackingId!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/10 bg-white hover:border-[#F85606] text-xs font-semibold text-[#212121] transition-colors cursor-pointer"
                      >
                        {copiedTracking ? (
                          <>
                            <Check className="w-3 h-3 text-[#15803D]" />
                            <span className="text-[#15803D]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-[#6E6E6E]">
                      Tracking number will appear once handed over to courier.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1">
                    <span className="text-[#757575] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F85606]" />
                      Destination
                    </span>
                    <p className="font-semibold text-[#212121]">
                      {matchedOrder.city || 'Karachi'}, PK
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAFA] border border-black/[0.06] space-y-1">
                    <span className="text-[#757575] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F85606]" />
                      Est. Delivery
                    </span>
                    <p className="font-semibold text-[#212121]">
                      {matchedOrder.courier
                        ? COURIER_HOTLINES[matchedOrder.courier].eta
                        : matchedOrder.city === 'Karachi'
                          ? '1–2 Business Days'
                          : '2–4 Business Days'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.07] space-y-1.5">
                  <p className="text-xs font-semibold text-[#757575]">Ordered Items</p>
                  <p className="text-xs sm:text-sm font-medium text-[#212121] leading-relaxed">
                    {matchedOrder.itemsSummary}
                  </p>
                </div>

                <a
                  href={buildWhatsAppUrl(
                    `Hello H.S Electronics, I would like an update on Order #${matchedOrder.id}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-lg bg-[#25D366] hover:bg-[#1EB958] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp about #{matchedOrder.id}</span>
                </a>
              </div>
            </aside>

            {/* Live Shipment Activity Log */}
            <section className="lg:col-span-7 bg-white rounded-2xl border border-black/[0.07] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.07]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F85606]" />
                  <h2 className="font-display text-base font-bold text-[#212121]">
                    Shipment Timeline
                  </h2>
                </div>
                <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Dispatch</span>
                </span>
              </div>

              <ol className="space-y-4">
                {buildTimeline(matchedOrder).map((ev, index) => (
                  <li key={ev.title} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                          ev.current ? 'bg-[#F85606] ring-4 ring-[#FFF3EC]' : 'bg-[#15803D]'
                        }`}
                      />
                      {index < buildTimeline(matchedOrder).length - 1 && (
                        <span className="w-px flex-1 bg-black/10 mt-1.5" aria-hidden="true" />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-[#212121]">{ev.title}</p>
                        <span className="text-[11px] font-medium text-[#757575]">· {ev.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#6E6E6E] mt-0.5 leading-relaxed">
                        {ev.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
