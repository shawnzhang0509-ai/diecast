import { Link } from 'react-router';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-[#0C0C0C]">
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '80px 40px 40px' }}>
        {/* Top Row */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-[20px] font-medium tracking-[0.1em] text-[#F0F0F0] uppercase">
              APEX DIECAST
            </Link>
            <p className="mt-4 text-[12px] font-normal leading-relaxed tracking-[0.05em] text-[#777777]">
              Precision. Passion. Performance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F0F0F0]">Shop</h4>
            <ul className="space-y-3">
              {['All Models', 'New Arrivals', 'Pre-Orders', 'Sale', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-[14px] font-normal leading-relaxed text-[#777777] transition-colors duration-200 hover:text-[#F0F0F0]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F0F0F0]">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Brands', 'Shipping & Returns', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-[14px] font-normal leading-relaxed text-[#777777] transition-colors duration-200 hover:text-[#F0F0F0]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F0F0F0]">Connect</h4>
            <div className="mb-6 flex gap-4">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[#777777] transition-colors duration-200 hover:text-[#F0F0F0]"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border border-[#222222] bg-transparent px-4 py-2.5 text-[13px] text-[#F0F0F0] placeholder:text-[#444444] focus:border-[#D24E35] focus:outline-none"
              />
              <button className="bg-[#D24E35] px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.05em] text-white transition-colors duration-200 hover:bg-[#B84028]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#222222] pt-8 sm:flex-row">
          <p className="text-[12px] text-[#777777]">
            2026 Apex Diecast. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[12px] text-[#777777] transition-colors duration-200 hover:text-[#F0F0F0]">
              Privacy Policy
            </a>
            <a href="#" className="text-[12px] text-[#777777] transition-colors duration-200 hover:text-[#F0F0F0]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
