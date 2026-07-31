import { Link } from 'react-router';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[#1F1F1F] bg-[#0D0D0D]">
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '80px 40px 40px' }}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <Logo className="h-5 w-10" />
              <span className="font-display text-[20px] font-light tracking-[0.25em] text-[#F7F7F7] uppercase">
                DRIFTAE
              </span>
            </Link>
            <p className="font-serif mt-4 text-[13px] font-normal italic leading-relaxed text-[#C7A96B]">
              Passion for Classics. Built for Collectors.
            </p>
            <p className="mt-2 text-[12px] font-normal leading-relaxed tracking-[0.05em] text-[#777777]">
              经典老爷车 · 为收藏家而生
            </p>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F7F7F7]">收藏</h4>
            <ul className="space-y-3">
              {['全部车源', '最新上架', '预订车辆', '特价车源', '寄售服务'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-[14px] font-normal leading-relaxed text-[#777777] transition-colors duration-200 hover:text-[#F7F7F7]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F7F7F7]">公司</h4>
            <ul className="space-y-3">
              {['关于我们', '经典品牌', '运输与交付', '常见问题', '联系我们'].map((item) => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-[14px] font-normal leading-relaxed text-[#777777] transition-colors duration-200 hover:text-[#F7F7F7]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[16px] font-medium text-[#F7F7F7]">关注我们</h4>
            <div className="mb-6 flex gap-4">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[#777777] transition-colors duration-200 hover:text-[#C7A96B]"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="您的邮箱"
                className="flex-1 border border-[#1F1F1F] bg-transparent px-4 py-2.5 text-[13px] text-[#F7F7F7] placeholder:text-[#444444] focus:border-[#C7A96B] focus:outline-none"
              />
              <button className="bg-[#C7A96B] px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.05em] text-[#0D0D0D] transition-colors duration-200 hover:bg-[#A89258]">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#1F1F1F] pt-8 sm:flex-row">
          <p className="text-[12px] text-[#777777]">
            2026 DRIFTAE. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[12px] text-[#777777] transition-colors duration-200 hover:text-[#F7F7F7]">
              隐私政策
            </a>
            <a href="#" className="text-[12px] text-[#777777] transition-colors duration-200 hover:text-[#F7F7F7]">
              服务条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
