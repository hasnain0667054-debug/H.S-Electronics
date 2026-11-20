import React from 'react';
import {CreditCard, Globe, Instagram, Mail, ShieldCheck, Twitter, Youtube} from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onOpenSeller: () => void;
  onOpenOrderTracking: () => void;
  onSelectSupportTopic: (topic: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onOpenSeller,
  onOpenOrderTracking,
  onSelectSupportTopic,
}) => {
  return (
    <footer className="bg-white border-t border-black/[0.08] mt-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-[#212121]">Customer Care</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E6E6E]">
              <li>
                <button
                  type="button"
                  onClick={onOpenOrderTracking}
                  className="hover:text-[#F85606] font-semibold text-[#212121] transition-colors cursor-pointer"
                >
                  Order Tracking
                </button>
              </li>
              {[
                'Help Center',
                'How to Buy',
                'Returns & Refunds',
                'Contact Support',
              ].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    onClick={() => onSelectSupportTopic(link)}
                    className="hover:text-[#F85606] transition-colors cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-[#212121]">About Us</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E6E6E]">
              <li>
                <button
                  type="button"
                  onClick={onOpenSeller}
                  className="hover:text-[#F85606] font-semibold text-[#212121] transition-colors cursor-pointer"
                >
                  Seller Center (Admin)
                </button>
              </li>
              {[
                'About H.S Electronics',
                'Authorized Brand Stores',
                'Careers',
                'Privacy Policy',
                'Terms & Conditions',
              ].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    onClick={() => onSelectSupportTopic(link)}
                    className="hover:text-[#F85606] transition-colors cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-[#212121]">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Visa', 'Mastercard', 'Apple Pay', 'Cash on Delivery'].map((method) => (
                <div
                  key={method}
                  className="px-3 py-2 rounded-lg bg-[#F5F5F5] border border-black/[0.06] text-xs font-semibold text-[#212121] flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#F85606] shrink-0" />
                  <span className="truncate">{method}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#757575] flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>256-bit encrypted checkout protection</span>
            </p>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-[#212121]">Follow Us</h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              Get flash sale alerts, seasonal drops, and curated product guides.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                {label: 'Instagram', icon: <Instagram className="w-4 h-4" />},
                {label: 'Twitter', icon: <Twitter className="w-4 h-4" />},
                {label: 'YouTube', icon: <Youtube className="w-4 h-4" />},
                {label: 'Newsletter', icon: <Mail className="w-4 h-4" />},
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  onClick={() => onSelectSupportTopic(`Follow H.S Electronics on ${social.label}`)}
                  className="w-9 h-9 rounded-lg bg-[#F5F5F5] hover:bg-[#F85606] text-[#424242] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-8 pt-6 border-t border-black/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#757575]">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2.5 font-display font-bold text-sm text-[#212121] hover:text-[#F85606] transition-colors cursor-pointer"
          >
            <img
              src="/assets/aistudio/Sun_26_07_2026_23_56_47_1c88bbed.png"
              alt="H.S Electronics logo"
              referrerPolicy="no-referrer"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0 rounded-md"
            />
            <span>H.S Electronics</span>
          </button>
          <p>© {new Date().getFullYear()} H.S Electronics Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Pakistan · PKR (Rs.)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
