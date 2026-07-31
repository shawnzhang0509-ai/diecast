import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.to(image.querySelector('img'), {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '200+', label: '经典车源' },
    { value: '30+', label: '合作品牌' },
    { value: '48H', label: '全球物流' },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0D0D0D]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto grid grid-cols-1 items-center gap-0 lg:grid-cols-2" style={{ maxWidth: 1400 }}>
        <div ref={contentRef} style={{ padding: '0 40px' }}>
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-[#F7F7F7] sm:text-[48px]">
            匠心甄选
          </h2>

          <p className="mt-6 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            每一辆经典老爷车都经过我们专业团队的严格甄选。从发动机工况到车身漆面，从历史档案到产权证明，我们以博物馆级的标准审视每一个细节。
          </p>

          <p className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            我们提供完整的车辆鉴定报告、维修保养记录和全球运输保险服务。让您的每一次收藏，都成为值得传承的传世之作。
          </p>

          <div className="mt-10 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[32px] font-light leading-[1.0] tracking-[-1px] text-[#C7A96B]">
                  {stat.value}
                </p>
                <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="mt-10 inline-block border border-[#C7A96B] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#C7A96B] transition-all duration-300 hover:bg-[#C7A96B] hover:text-[#0D0D0D]"
          >
            了解我们
          </Link>
        </div>

        <div ref={imageRef} className="relative h-[400px] overflow-hidden lg:h-[600px]">
          <img
            src="/images/collection-lifestyle.png"
            alt="经典老爷车收藏展示"
            className="h-[120%] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
