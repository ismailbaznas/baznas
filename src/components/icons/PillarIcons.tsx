import React from "react";

export interface PillarIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * 1. Boven Digoel Sehat
 * Ikon Hati dengan Garis Detak Jantung (ECG Pulse)
 */
export function PillarSehatIcon({ className = "w-10 h-10", ...props }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Heart Contour */}
      <path d="M24 40.5L9.8 26.2C5.4 21.8 5.4 14.6 9.8 10.2C14.2 5.8 21.3 5.8 24 10.8C26.7 5.8 33.8 5.8 38.2 10.2C42.6 14.6 42.6 21.8 38.2 26.2L24 40.5Z" />
      {/* ECG Heartbeat Line */}
      <path d="M14.5 24H19L21.8 17.5L26.2 30.5L29 24H33.5" />
    </svg>
  );
}

/**
 * 2. Boven Digoel Cerdas
 * Ikon Topi Toga (Mortarboard) dengan Rumbai Tassel
 */
export function PillarCerdasIcon({ className = "w-10 h-10", ...props }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Mortarboard Diamond Top */}
      <polygon points="24,9 43,18.5 24,28 5,18.5" />
      {/* Cap Skullcap Base */}
      <path d="M12 22.5V31.5C12 35 17.4 37.5 24 37.5C30.6 37.5 36 35 36 31.5V22.5" />
      {/* Left Hanging Tassel */}
      <path d="M10 21V33.5" />
      <circle cx="10" cy="35.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * 3. Boven Digoel Mandiri
 * Ikon Grafik Pertumbuhan Ekonomi (3 Baris Naik + Garis Tren & Panah)
 */
export function PillarMandiriIcon({ className = "w-10 h-10", ...props }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Ground / Base Line */}
      <line x1="6" y1="41" x2="42" y2="41" />
      {/* 3 Ascending Bars */}
      <rect x="9" y="28" width="6" height="13" rx="1.5" />
      <rect x="21" y="21" width="6" height="20" rx="1.5" />
      <rect x="33" y="14" width="6" height="27" rx="1.5" />
      {/* Growth Trend Line with Arrow */}
      <path d="M8 20L19 11L28 16.5L39.5 6" />
      <polyline points="33,6 39.5,6 39.5,12.5" />
    </svg>
  );
}

/**
 * 4. Boven Digoel Peduli
 * Ikon Dua Tangan Merangkul Hati (Care & Kemanusiaan)
 */
export function PillarPeduliIcon({ className = "w-10 h-10", ...props }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Floating Heart in upper center */}
      <path d="M24 23L17.5 16.5C15.2 14.2 15.2 10.5 17.5 8.2C19.8 5.9 23.5 5.9 24 8.5C24.5 5.9 28.2 5.9 30.5 8.2C32.8 10.5 32.8 14.2 30.5 16.5L24 23Z" />
      {/* Left Cupping Hand */}
      <path d="M7 26.5C8.5 24 11 23 13.5 24L18 26.5C21 28 22.5 30.5 22.5 34C22.5 37 19.5 39 16 39C12 39 8.5 35 7 32L6 30" />
      {/* Right Cupping Hand */}
      <path d="M41 26.5C39.5 24 37 23 34.5 24L30 26.5C27 28 25.5 30.5 25.5 34C25.5 37 28.5 39 32 39C36 39 39.5 35 41 32L42 30" />
    </svg>
  );
}

/**
 * 5. Boven Digoel Taqwa
 * Ikon Masjid (Kubah Islami, Menara, Bulan Sabit & Pintu Lengkung)
 */
export function PillarTaqwaIcon({ className = "w-10 h-10", ...props }: PillarIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Ground Base Line */}
      <line x1="5" y1="41" x2="43" y2="41" />
      {/* Left Minaret Tower */}
      <path d="M9 41V17H15V41" />
      <path d="M7 17H17" />
      <path d="M9 17C9 13.5 12 9.5 12 9.5C12 9.5 15 13.5 15 17" />
      <line x1="12" y1="9.5" x2="12" y2="6.5" />
      {/* Mosque Main Structure & Dome */}
      <path d="M19 41V27H39V41" />
      <path d="M19 27C19 18 29 12.5 29 12.5C29 12.5 39 18 39 27" />
      <line x1="29" y1="12.5" x2="29" y2="8.5" />
      <circle cx="29" cy="7.5" r="1.25" fill="currentColor" />
      {/* Arch Entrance Door */}
      <path d="M25 41V33C25 30.8 26.8 29 29 29C31.2 29 33 30.8 33 33V41" />
    </svg>
  );
}
