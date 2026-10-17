import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [data-cursor-hover]';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkTouch = window.matchMedia('(hover: none)').matches;
    setIsTouch(checkTouch);
    if (checkTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let raf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // One delegated listener, so elements rendered later (product cards) get the hover state too.
    const handleMouseOver = (e: MouseEvent) => {
      const over = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
      if (over !== hoveringRef.current) {
        hoveringRef.current = over;
        setIsHovering(over);
      }
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      const offset = hoveringRef.current ? 30 : 6;
      cursor.style.transform = `translate(${cursorX - offset}px, ${cursorY - offset}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden mix-blend-difference lg:block"
      style={{
        width: isHovering ? 60 : 12,
        height: isHovering ? 60 : 12,
        borderRadius: '50%',
        backgroundColor: 'white',
        border: isHovering ? '1px solid rgba(240, 240, 240, 0.2)' : 'none',
        transition: 'width 0.4s cubic-bezier(0.65, 0, 0.35, 1), height 0.4s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.4s cubic-bezier(0.65, 0, 0.35, 1), border 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    />
  );
}
