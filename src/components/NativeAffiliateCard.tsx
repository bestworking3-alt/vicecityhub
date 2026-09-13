import React from 'react';
import { 
  Tv, 
  HardDrive, 
  Monitor, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShoppingBag,
  Star
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

export interface AffiliateProduct {
  id: string;
  category: 'console' | 'ssd' | 'monitor';
  title: string;
  badge: string;
  subtitle: string;
  specs: string[];
  price: string;
  oldPrice?: string;
  rating: string;
  asin: string;
  amazonUrl: string;
  neonColor: 'pink' | 'cyan' | 'emerald' | 'amber';
}

interface NativeAffiliateCardProps {
  productIndex?: number;
  affiliateTag?: string;
}

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'ps5_pro_console',
    category: 'console',
    title: 'PlayStation 5 Pro Console (2TB SSD)',
    badge: 'ULTIMATE GTA 6 LAUNCH PLATFORM',
    subtitle: 'Spectral Super Resolution (PSSR), 4K 60FPS Ray-Tracing, & 2TB High-Speed Internal SSD',
    specs: ['2TB Internal Gen4 NVMe', 'Tempest 3D Audio Engine', 'DualSense Haptic Feedback', '16.7 TFLOPS RDNA GPU'],
    price: '$699.99',
    oldPrice: '$749.99',
    rating: '4.9 ★ (14,200+ ratings)',
    asin: 'B0DF16BKP7',
    amazonUrl: 'https://amazon.com/dp/B0DF16BKP7',
    neonColor: 'pink',
  },
  {
    id: 'wd_black_2tb_ssd',
    category: 'ssd',
    title: 'WD_BLACK 2TB SN850X NVMe SSD with Heatsink',
    badge: 'BEST SSD FOR 180GB GTA 6 FOOTPRINT',
    subtitle: 'Officially tested for PS5 expansion bay with integrated aluminum thermal heat-spreader',
    specs: ['7,300 MB/s Read Speed', 'Direct PS5 Screw-in Fit', 'Eliminates Texture Pop-in', '5-Year Manufacturer Warranty'],
    price: '$159.99',
    oldPrice: '$189.99',
    rating: '4.9 ★ (28,500+ ratings)',
    asin: 'B0B7CMZ3QH',
    amazonUrl: 'https://amazon.com/dp/B0B7CMZ3QH',
    neonColor: 'cyan',
  },
  {
    id: 'lg_ultragear_4k_144hz',
    category: 'monitor',
    title: 'LG UltraGear 27GR93U-B 27" 4K 144Hz Gaming Monitor',
    badge: '4K 144HZ HDMI 2.1 DISPLAY',
    subtitle: 'True 4K UHD IPS panel with dual HDMI 2.1 ports for full 4K 120Hz HDR console gameplay',
    specs: ['UHD 3840x2160 Resolution', '1ms GtG Fast IPS', 'VESA DisplayHDR 400', 'HDMI 2.1 VRR & ALLM Support'],
    price: '$449.99',
    oldPrice: '$529.99',
    rating: '4.8 ★ (9,800+ ratings)',
    asin: 'B0C635B134',
    amazonUrl: 'https://amazon.com/dp/B0C635B134',
    neonColor: 'emerald',
  },
  {
    id: 'samsung_990_pro_2tb',
    category: 'ssd',
    title: 'Samsung 990 PRO 2TB PCIe 4.0 M.2 SSD',
    badge: 'PEAK READ/WRITE SPEED FOR LEONIDA',
    subtitle: 'Blazing fast 7,450 MB/s speed engineered for open-world gaming asset streaming and zero stutter',
    specs: ['7,450 MB/s Seq. Read', 'Custom Thermal Controller', 'Pre-Installed Heatsink', '1,200 TBW Endurance'],
    price: '$169.99',
    oldPrice: '$199.99',
    rating: '4.9 ★ (31,000+ ratings)',
    asin: 'B0BHJJ9Y77',
    amazonUrl: 'https://amazon.com/dp/B0BHJJ9Y77',
    neonColor: 'cyan',
  },
  {
    id: 'asus_rog_swift_oled',
    category: 'monitor',
    title: 'ASUS ROG Swift 32" 4K OLED 240Hz (PG32UCDM)',
    badge: 'ENTHUSIAST LEVEL VICE CITY VISUALS',
    subtitle: 'Third-generation QD-OLED panel offering infinite contrast and ultra-vibrant neon lighting',
    specs: ['4K QD-OLED Panel', '0.03ms Response Time', 'Dolby Vision & HDR10', 'Custom Graphene Heatsink'],
    price: '$1,299.00',
    rating: '4.9 ★ (3,400+ ratings)',
    asin: 'B0CWL43K4H',
    amazonUrl: 'https://amazon.com/dp/B0CWL43K4H',
    neonColor: 'amber',
  },
];

export const NativeAffiliateCard: React.FC<NativeAffiliateCardProps> = ({
  productIndex = 0,
  affiliateTag = 'yourtag-21',
}) => {
  const product = AFFILIATE_PRODUCTS[productIndex % AFFILIATE_PRODUCTS.length];
  const urlWithTag = `${product.amazonUrl}?tag=${affiliateTag}`;

  const iconMap = {
    console: Tv,
    ssd: HardDrive,
    monitor: Monitor,
  };

  const Icon = iconMap[product.category] || ShoppingBag;

  const handleAffiliateClick = () => {
    sound.playClick(950, 480);
    window.open(urlWithTag, '_blank', 'noopener,noreferrer sponsored');
  };

  return (
    <div className="col-span-full my-6 rounded-2xl bg-gradient-to-r from-[#170e24] via-[#0f111a] to-[#0a1520] border-2 border-pink-500/60 p-5 sm:p-6 shadow-[0_0_30px_rgba(236,72,153,0.25)] relative overflow-hidden group">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info & Specs */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-600/30 border border-pink-500 text-pink-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              {product.badge}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              COMMISSION EARNED · TAG: {affiliateTag}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-pink-400" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-['Chakra_Petch'] leading-snug group-hover:text-pink-300 transition-colors">
                {product.title}
              </h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {product.subtitle}
              </p>
            </div>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {product.specs.map((spec, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 truncate"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pricing & High-CTR CTA Button */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800 shrink-0">
          <div className="text-left lg:text-right">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="font-mono text-xs text-zinc-500 line-through">
                  {product.oldPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-300 justify-start lg:justify-end mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <button
            onClick={handleAffiliateClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm font-mono tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>BUY ON AMAZON</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
