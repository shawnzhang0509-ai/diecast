import { Link } from 'react-router';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-driftae-gold/20 bg-driftae-black">
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '80px 40px 40px' }}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo variant="full" showTagline />
            </Link>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">收藏</h4>
            <ul className="space-y-3">
              {['全部车源', '最新上架', '预订车辆', '特价车源', '寄售服务'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-[14px] font-normal leading-relaxed text-driftae-muted transition-colors duration-200 hover:text-driftae-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">公司</h4>
            <ul className="space-y-3">
              {['关于我们', '经典品牌', '运输与交付', '常见问题', '联系我们'].map((item) => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-[14px] font-normal leading-relaxed text-driftae-muted transition-colors duration-200 hover:text-driftae-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">关注我们</h4>
            <div className="mb-6 flex gap-4">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="您的邮箱"
                className="flex-1 border border-driftae-border bg-transparent px-4 py-2.5 text-[13px] text-driftae-white placeholder:text-driftae-muted/50 focus:border-driftae-gold focus:outline-none"
              />
              <button className="btn-gold px-4 py-2.5 text-[12px]">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-driftae-gold/20 pt-8 sm:flex-row">
          <p className="text-[12px] text-driftae-muted">
            © 2026 DRIFTAE. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[12px] text-driftae-muted transition-colors duration-200 hover:text-driftae-gold">
              隐私政策
            </a>
            <a href="#" className="text-[12px] text-driftae-muted transition-colors duration-200 hover:text-driftae-gold">
              服务条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
