import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StorySectionProps {
  title: string;
  paragraphs: string[];
  image: string;
  imageLeft?: boolean;
  stats?: { value: string; label: string }[];
}

function StorySection({ title, paragraphs, image, imageLeft, stats }: StorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const imageEl = (
    <div className="relative h-[350px] overflow-hidden lg:h-[450px]">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );

  const contentEl = (
    <div ref={contentRef} className="flex flex-col justify-center" style={{ padding: '0 40px' }}>
      <h3 className="font-display text-[28px] font-light leading-[1.3] tracking-[0.05em] text-[#F7F7F7] sm:text-[36px]">
        {title}
      </h3>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
          {p}
        </p>
      ))}
      {stats && (
        <div className="mt-8 grid grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-[28px] font-light leading-[1.0] tracking-[-1px] text-[#C7A96B]">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 items-center gap-0 lg:grid-cols-2"
      style={{ padding: '80px 0' }}
    >
      {imageLeft ? (
        <>
          {imageEl}
          {contentEl}
        </>
      ) : (
        <>
          {contentEl}
          {imageEl}
        </>
      )}
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const hero = heroRef.current;
    if (!hero) return;

    gsap.fromTo(
      hero.querySelectorAll('.animate-in'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="bg-[#0D0D0D]">
      <div
        ref={heroRef}
        className="flex flex-col items-center justify-center bg-[#141414] text-center"
        style={{ minHeight: '70vh', padding: '0 40px' }}
      >
        <p className="animate-in mb-4 font-body text-[12px] font-medium uppercase tracking-[0.2em] text-[#C7A96B]">
          About DRIFTAE
        </p>
        <h1 className="animate-in font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-[#F7F7F7] sm:text-[48px]">
          激情与经典的交汇
        </h1>
        <p className="animate-in font-serif mt-4 text-[16px] italic text-[#C7A96B]">
          Passion for Classics. Built for Collectors.
        </p>
        <p className="animate-in mt-6 max-w-[640px] font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
          DRIFTAE 由收藏家创立，为收藏家服务。我们致力于连接汽车爱好者与全球最优秀的经典老爷车，让每一辆传世之作找到它的归宿。
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: 1400 }}>
        <StorySection
          title="我们的起点"
          paragraphs={[
            '一切始于对经典汽车的纯粹热爱。创始人是一位终身汽车爱好者，他意识到市场缺乏一个专注于经典老爷车的精品平台——一个以博物馆级标准对待每一辆车的平台。',
            '2019 年，DRIFTAE 应运而生，使命简单而明确：为收藏家甄选全球最优秀的经典老爷车。每一辆车都经过严格筛选、专业鉴定，并以画廊展览般的标准呈现。',
          ]}
          image="/images/about-craft.png"
          imageLeft={false}
        />

        <StorySection
          title="匠心甄选"
          paragraphs={[
            '我们与全球顶级经典车经销商、拍卖行和私人收藏家保持紧密合作，确保每一辆车源真实可靠、手续齐全。我们的甄选标准毫不妥协：只有车况优良、历史清晰、具有收藏价值的经典车才能进入我们的展厅。',
            '每辆车都配有详细的鉴定报告、高清摄影和完整的历史档案。我们相信，在收藏经典老爷车时，透明度至关重要。',
          ]}
          image="/images/collection-lifestyle.png"
          imageLeft={true}
        />

        <StorySection
          title="全球收藏家社区"
          paragraphs={[
            '如今，DRIFTAE 已为全球超过 85 个国家的收藏家提供服务。我们的客户从首次购买经典车的入门者，到追寻数十年梦想的资深藏家。我们深知，每一次交易都代表着对汽车历史的情感连接。',
            '我们的专业顾问团队提供个性化服务——无论是帮您选择第一辆经典车、提供保养与存储建议，还是协助寻找稀有的传世之作。',
          ]}
          image="/images/hero-showroom.png"
          imageLeft={false}
          stats={[
            { value: '10,000+', label: '收藏家' },
            { value: '85', label: '国家' },
            { value: '98%', label: '满意度' },
          ]}
        />
      </div>
    </div>
  );
}
