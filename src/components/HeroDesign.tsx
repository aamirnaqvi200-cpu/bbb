import { useLayoutEffect, useRef } from 'react';

interface HeroDesignProps {
  /** Raw HTML of the exported design (imported with `?raw`). */
  html: string;
  /** Canvas size the design was exported at. */
  width: number;
  height: number;
  /** 'cover' fills the hero and crops the overflow, 'contain' shows the whole canvas. */
  fit?: 'cover' | 'contain';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The exported designs are fixed-size canvases (e.g. 4591x2350) made of absolutely
 * positioned text/image layers. This wrapper centres that canvas and scales it with a
 * CSS transform so it lines up with the hero photo behind it, at any viewport size.
 */
export function HeroDesign({ html, width, height, fit = 'cover', className = '', style }: HeroDesignProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const resize = () => {
      const w = box.clientWidth || window.innerWidth;
      const h = box.clientHeight || window.innerHeight;
      const scale = fit === 'cover'
        ? Math.max(w / width, h / height)
        : Math.min(w / width, h / height);
      canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(box);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
    };
  }, [width, height, fit]);

  return (
    <div
      ref={boxRef}
      className={`hero-design ${className}`}
      style={{ overflow: 'hidden', pointerEvents: 'none', ...style }}
    >
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width,
          height,
          transformOrigin: 'center center',
          transform: `translate(-50%, -50%) scale(${typeof window !== 'undefined' ? Math.max(window.innerWidth / width, window.innerHeight / height) : 1})`,
          willChange: 'transform',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
