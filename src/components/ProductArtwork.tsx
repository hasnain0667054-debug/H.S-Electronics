import React from 'react';
import type {ProductArtworkKey} from '../data/catalog';

interface ProductArtworkProps {
  artworkKey: ProductArtworkKey;
  customImageUrls?: string[];
  viewIndex?: number;
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  artworkKey,
  customImageUrls,
  viewIndex = 0,
  className = '',
}) => {
  const uploadedUrl =
    customImageUrls && customImageUrls.length > 0
      ? customImageUrls[viewIndex % customImageUrls.length]
      : null;

  if (uploadedUrl) {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center bg-[#FAFAFA] overflow-hidden select-none ${className}`}
      >
        <img
          src={uploadedUrl}
          alt="Product preview"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const backdropStyle =
    viewIndex === 1
      ? 'bg-gradient-to-br from-[#F7F5F2] to-[#E8E4DE]'
      : viewIndex === 2
        ? 'bg-gradient-to-tr from-[#F2F4F7] to-[#E4E8EE]'
        : viewIndex === 3
          ? 'bg-gradient-to-b from-[#FFF7F2] to-[#F3ECE7]'
          : 'bg-gradient-to-b from-[#FAFAFA] to-[#EFEFEF]';

  const svgTransform =
    viewIndex === 1
      ? 'scale-[1.06] -rotate-3 translate-x-1'
      : viewIndex === 2
        ? 'scale-[1.28] translate-y-2'
        : viewIndex === 3
          ? 'scale-[0.95] rotate-2 -translate-y-1'
          : '';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${backdropStyle} overflow-hidden select-none ${className}`}
    >
      <div
        className="absolute bottom-[12%] w-[58%] h-[10%] rounded-full bg-black/[0.08] blur-[6px] pointer-events-none"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 240 180"
        className={`w-[82%] h-[82%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ${svgTransform}`}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="metalDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B3E45" />
            <stop offset="50%" stopColor="#23252A" />
            <stop offset="100%" stopColor="#141518" />
          </linearGradient>
          <linearGradient id="metalLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2F3F5" />
            <stop offset="55%" stopColor="#D4D7DD" />
            <stop offset="100%" stopColor="#A9AEB8" />
          </linearGradient>
          <linearGradient id="accentOrange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A33" />
            <stop offset="100%" stopColor="#F85606" />
          </linearGradient>
          <linearGradient id="ceramicCream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F0EDE6" />
            <stop offset="100%" stopColor="#DBD5CA" />
          </linearGradient>
        </defs>

        {artworkKey === 'headphones' && (
          <g>
            <path
              d="M65 92 C65 40, 175 40, 175 92"
              fill="none"
              stroke="url(#metalDark)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M84 48 C104 37, 136 37, 156 48"
              fill="none"
              stroke="#4B4F58"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="60" y="88" width="7" height="26" rx="3" fill="url(#metalLight)" />
            <rect x="173" y="88" width="7" height="26" rx="3" fill="url(#metalLight)" />
            <rect x="46" y="96" width="32" height="52" rx="14" fill="url(#metalDark)" />
            <rect x="70" y="100" width="12" height="44" rx="6" fill="#17181B" />
            <circle cx="58" cy="122" r="9" fill="#2F3238" stroke="#4D525C" strokeWidth="1.5" />
            <rect x="162" y="96" width="32" height="52" rx="14" fill="url(#metalDark)" />
            <rect x="158" y="100" width="12" height="44" rx="6" fill="#17181B" />
            <circle cx="182" cy="122" r="9" fill="#2F3238" stroke="#4D525C" strokeWidth="1.5" />
            <circle cx="62" cy="140" r="2.2" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'smartwatch' && (
          <g>
            <path d="M98 18 L142 18 L146 50 L94 50 Z" fill="#2B2E34" />
            <path d="M94 130 L146 130 L142 162 L98 162 Z" fill="#2B2E34" />
            <rect x="82" y="44" width="76" height="92" rx="20" fill="url(#metalLight)" />
            <rect x="158" y="64" width="6" height="16" rx="2" fill="#9CA3AF" />
            <rect x="76" y="76" width="6" height="22" rx="2" fill="url(#accentOrange)" />
            <rect x="89" y="51" width="62" height="78" rx="14" fill="#121316" />
            <circle cx="120" cy="86" r="22" fill="none" stroke="#2D3139" strokeWidth="4" />
            <path
              d="M120 64 A22 22 0 1 1 100 96"
              fill="none"
              stroke="url(#accentOrange)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text
              x="120"
              y="91"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              10:09
            </text>
            <text x="120" y="116" textAnchor="middle" fill="#9CA3AF" fontSize="7" fontWeight="600">
              72 BPM
            </text>
          </g>
        )}

        {artworkKey === 'keyboard' && (
          <g transform="rotate(-12 120 90)">
            <rect x="26" y="48" width="188" height="84" rx="10" fill="url(#metalLight)" />
            <rect x="33" y="54" width="174" height="72" rx="6" fill="#23252A" />
            {[0, 1, 2, 3].map((row) =>
              Array.from({length: 11}).map((_, col) => {
                const isEsc = row === 0 && col === 0;
                const isSpace = row === 3 && col >= 3 && col <= 6;
                if (row === 3 && col > 3 && col <= 6) return null;
                const x = 38 + col * 15;
                const y = 59 + row * 16;
                const w = isSpace ? 57 : 12.5;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    width={w}
                    height="13"
                    rx="2.5"
                    fill={isEsc ? '#F85606' : row === 0 || col === 0 || col === 10 ? '#4B505B' : '#F4F4F5'}
                  />
                );
              })
            )}
          </g>
        )}

        {artworkKey === 'earbuds' && (
          <g>
            <rect x="74" y="62" width="92" height="82" rx="24" fill="url(#ceramicCream)" />
            <line x1="74" y1="90" x2="166" y2="90" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="120" cy="105" r="3" fill="#F85606" />
            <rect x="92" y="42" width="16" height="28" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="132" y="42" width="16" height="28" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
          </g>
        )}

        {artworkKey === 'gan-charger' && (
          <g>
            {/* Prongs */}
            <rect x="52" y="72" width="18" height="6" rx="2" fill="url(#metalLight)" />
            <rect x="52" y="96" width="18" height="6" rx="2" fill="url(#metalLight)" />
            {/* Main GaN Body */}
            <rect x="68" y="42" width="106" height="94" rx="14" fill="url(#metalDark)" />
            <rect x="150" y="42" width="24" height="94" rx="10" fill="#2E3138" />
            {/* USB-C & USB-A Ports */}
            <rect x="156" y="56" width="11" height="5" rx="2.5" fill="#F85606" />
            <rect x="156" y="72" width="11" height="5" rx="2.5" fill="#9CA3AF" />
            <rect x="156" y="88" width="11" height="5" rx="2.5" fill="#9CA3AF" />
            <rect x="155" y="106" width="13" height="14" rx="2" fill="#4B5563" />
            <rect x="158" y="109" width="7" height="8" rx="1" fill="#F85606" />
            <text x="108" y="94" textAnchor="middle" fill="#D1D5DB" fontSize="13" fontWeight="700" fontFamily="Outfit, sans-serif">
              140W
            </text>
          </g>
        )}

        {artworkKey === 'speaker' && (
          <g>
            <rect x="80" y="30" width="80" height="122" rx="34" fill="url(#metalDark)" />
            <rect x="86" y="40" width="68" height="102" rx="26" fill="#2A2D34" />
            {/* Acoustic weave dots */}
            {[0, 1, 2, 3, 4, 5].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={98 + col * 11}
                  cy={54 + row * 14}
                  r="2.2"
                  fill="#4B505B"
                />
              ))
            )}
            {/* Top control strip */}
            <rect x="112" y="34" width="16" height="4" rx="2" fill="#F85606" />
            <circle cx="120" cy="142" r="3" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'mouse' && (
          <g transform="rotate(14 120 90)">
            {/* Ergonomic ultralight mouse body */}
            <path
              d="M84 54 C84 30, 156 30, 156 54 L158 122 C158 150, 82 150, 82 122 Z"
              fill="url(#metalDark)"
            />
            {/* Click seam */}
            <path d="M84 74 Q120 78 156 74" fill="none" stroke="#111214" strokeWidth="2.2" />
            <line x1="120" y1="36" x2="120" y2="75" stroke="#111214" strokeWidth="2" />
            {/* Orange scroll wheel */}
            <rect x="115" y="46" width="10" height="20" rx="4" fill="url(#accentOrange)" />
            {/* Subtle DPI LED */}
            <circle cx="120" cy="116" r="3" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'webcam' && (
          <g>
            {/* Monitor clamp base */}
            <path d="M84 124 L156 124 L148 144 L92 144 Z" fill="#1F2227" />
            <rect x="112" y="106" width="16" height="20" fill="#4B505B" />
            {/* Camera cylinder housing */}
            <rect x="52" y="54" width="136" height="54" rx="16" fill="url(#metalDark)" />
            {/* Glass lens assembly */}
            <circle cx="120" cy="81" r="20" fill="#111215" stroke="#4B505B" strokeWidth="3" />
            <circle cx="120" cy="81" r="11" fill="#1E293B" />
            <circle cx="116" cy="77" r="3.5" fill="#FFFFFF" fillOpacity="0.35" />
            <circle cx="152" cy="81" r="3" fill="#10B981" />
          </g>
        )}

        {artworkKey === 'powerbank' && (
          <g>
            <rect x="64" y="34" width="112" height="114" rx="14" fill="url(#metalDark)" />
            {/* Textured grip lower band */}
            <rect x="64" y="92" width="112" height="56" rx="14" fill="#2A2D34" />
            {/* OLED telemetry display */}
            <rect x="82" y="48" width="76" height="34" rx="6" fill="#111214" stroke="#3F434D" strokeWidth="1.5" />
            <text
              x="120"
              y="69"
              textAnchor="middle"
              fill="#F85606"
              fontSize="14"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
            >
              100W · 98%
            </text>
            {/* Top ports */}
            <rect x="86" y="29" width="16" height="5" rx="2" fill="#9CA3AF" />
            <rect x="112" y="29" width="16" height="5" rx="2" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'camera' && (
          <g>
            {/* Camera body */}
            <rect x="48" y="52" width="144" height="88" rx="10" fill="url(#metalDark)" />
            {/* Top metallic plate & EVF hump */}
            <path d="M52 52 L84 52 L94 36 L138 36 L148 52 L188 52 L188 68 L52 68 Z" fill="url(#metalLight)" />
            {/* Shutter button & dials */}
            <rect x="62" y="45" width="14" height="7" rx="2" fill="#F85606" />
            <rect x="156" y="44" width="22" height="8" rx="2" fill="#4B505B" />
            {/* Lens barrel */}
            <circle cx="122" cy="98" r="36" fill="#1C1E22" stroke="#9CA3AF" strokeWidth="4" />
            <circle cx="122" cy="98" r="24" fill="#111317" stroke="#374151" strokeWidth="2" />
            <circle cx="122" cy="98" r="14" fill="#1E293B" />
            <circle cx="115" cy="91" r="4.5" fill="#FFFFFF" fillOpacity="0.28" />
          </g>
        )}

        {artworkKey === 'purifier' && (
          <g>
            <rect x="82" y="28" width="76" height="124" rx="14" fill="url(#ceramicCream)" />
            <ellipse cx="120" cy="28" rx="38" ry="9" fill="#E5E7EB" />
            <ellipse cx="120" cy="28" rx="26" ry="5" fill="#23252A" />
            <rect x="88" y="88" width="64" height="56" rx="6" fill="#E5E7EB" />
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2, 3, 4, 5, 6].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={96 + col * 8}
                  cy={96 + row * 10}
                  r="1.8"
                  fill="#6B7280"
                />
              ))
            )}
            <circle cx="120" cy="56" r="10" fill="#1F2937" />
            <circle cx="120" cy="56" r="4" fill="#10B981" />
          </g>
        )}

        {artworkKey === 'desk-lamp' && (
          <g>
            {/* Warm light cone */}
            <polygon points="82,56 200,56 220,152 62,152" fill="#FDE68A" fillOpacity="0.24" />
            {/* Weighted base */}
            <rect x="44" y="138" width="56" height="12" rx="4" fill="url(#metalDark)" />
            {/* Vertical arm */}
            <rect x="66" y="46" width="8" height="94" rx="3" fill="url(#metalDark)" />
            {/* Horizontal LED bar */}
            <rect x="66" y="44" width="138" height="12" rx="5" fill="url(#metalDark)" />
            <rect x="78" y="54" width="120" height="4" rx="2" fill="#FDE047" />
            {/* Wireless control dial */}
            <circle cx="144" cy="144" r="9" fill="#23252A" stroke="#F85606" strokeWidth="1.5" />
          </g>
        )}

        {artworkKey === 'ssd' && (
          <g transform="rotate(-14 120 90)">
            {/* Finned aluminum NVMe enclosure */}
            <rect x="54" y="56" width="132" height="68" rx="10" fill="url(#metalDark)" />
            {[68, 80, 92, 104, 116].map((x) => (
              <line key={x} x1={x} y1="64" x2={x} y2="116" stroke="#3F434D" strokeWidth="3" strokeLinecap="round" />
            ))}
            {/* Orange bumper trim & USB-C port */}
            <rect x="166" y="56" width="20" height="68" rx="8" fill="url(#accentOrange)" />
            <rect x="184" y="84" width="6" height="12" rx="2" fill="#111214" />
          </g>
        )}

        {artworkKey === 'router' && (
          <g>
            {/* Antennas */}
            <rect x="64" y="34" width="8" height="72" rx="4" fill="url(#metalDark)" />
            <rect x="116" y="28" width="8" height="78" rx="4" fill="url(#metalDark)" />
            <rect x="168" y="34" width="8" height="72" rx="4" fill="url(#metalDark)" />
            {/* Sleek router chassis */}
            <path d="M44 102 L196 102 L206 136 L34 136 Z" fill="url(#metalDark)" />
            <rect x="34" y="132" width="172" height="10" rx="4" fill="#141518" />
            {/* Front status bar */}
            <rect x="86" y="122" width="68" height="3" rx="1.5" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'controller' && (
          <g>
            {/* Left & Right grips */}
            <path
              d="M66 56 C46 56, 36 96, 44 130 C48 144, 66 144, 74 126 L86 104 L154 104 L166 126 C174 144, 192 144, 196 130 C204 96, 194 56, 174 56 Z"
              fill="url(#metalDark)"
            />
            {/* Thumbsticks */}
            <circle cx="84" cy="78" r="11" fill="#3B3E45" stroke="#141518" strokeWidth="2" />
            <circle cx="144" cy="96" r="11" fill="#3B3E45" stroke="#141518" strokeWidth="2" />
            {/* D-pad */}
            <rect x="92" y="92" width="16" height="5" rx="1.5" fill="#9CA3AF" />
            <rect x="97.5" y="86.5" width="5" height="16" rx="1.5" fill="#9CA3AF" />
            {/* ABXY buttons */}
            <circle cx="158" cy="70" r="3.5" fill="#F85606" />
            <circle cx="166" cy="78" r="3.5" fill="#E5E7EB" />
            <circle cx="150" cy="78" r="3.5" fill="#E5E7EB" />
            <circle cx="158" cy="86" r="3.5" fill="#E5E7EB" />
            <circle cx="120" cy="72" r="4.5" fill="#F85606" />
          </g>
        )}

        {artworkKey === 'usb-hub' && (
          <g>
            {/* Cable */}
            <path d="M56 90 C36 90, 32 62, 46 46" fill="none" stroke="#23252A" strokeWidth="6" strokeLinecap="round" />
            <rect x="42" y="34" width="14" height="16" rx="3" fill="url(#metalLight)" />
            {/* Aluminum Hub Body */}
            <rect x="56" y="66" width="136" height="48" rx="8" fill="url(#metalLight)" />
            {/* Port slots */}
            <rect x="72" y="84" width="18" height="12" rx="2" fill="#23252A" />
            <rect x="98" y="84" width="18" height="12" rx="2" fill="#23252A" />
            <rect x="124" y="86" width="14" height="8" rx="3" fill="#F85606" />
            <rect x="146" y="84" width="26" height="12" rx="2" fill="#23252A" />
          </g>
        )}

        {artworkKey === 'mic' && (
          <g>
            {/* Base */}
            <ellipse cx="120" cy="148" rx="34" ry="7" fill="url(#metalDark)" />
            <rect x="116" y="114" width="8" height="34" fill="#4B505B" />
            {/* Mic body */}
            <rect x="96" y="34" width="48" height="82" rx="24" fill="url(#metalDark)" />
            {/* Grille top */}
            <path d="M96 58 C96 34, 144 34, 144 58 L144 74 L96 74 Z" fill="#4B505B" />
            {/* Mute LED ring */}
            <rect x="96" y="72" width="48" height="4" fill="#F85606" />
            {/* Gain knob */}
            <circle cx="120" cy="96" r="7" fill="#9CA3AF" />
          </g>
        )}

        {artworkKey === 'stand' && (
          <g>
            {/* Weighted base with Qi pad */}
            <rect x="72" y="134" width="96" height="14" rx="5" fill="url(#metalLight)" />
            {/* Arm */}
            <path d="M120 134 L106 76" stroke="url(#metalLight)" strokeWidth="10" strokeLinecap="round" />
            {/* MagSafe magnetic ring puck */}
            <circle cx="106" cy="64" r="28" fill="url(#metalDark)" stroke="#D4D7DD" strokeWidth="3" />
            <circle cx="106" cy="64" r="14" fill="none" stroke="#F85606" strokeWidth="2.5" />
            {/* Watch side arm */}
            <path d="M114 96 L154 90" stroke="url(#metalLight)" strokeWidth="7" strokeLinecap="round" />
            <circle cx="158" cy="88" r="10" fill="url(#metalDark)" />
          </g>
        )}
      </svg>
    </div>
  );
};
