import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [coords, setCoords] = useState<{ top: number; left: number; transform: string } | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const show = () => {
    timeout.current = setTimeout(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let top = 0, left = 0, transform = '';

      if (position === 'bottom') {
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
      } else if (position === 'top') {
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%) translateY(-100%)';
      } else if (position === 'left') {
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        transform = 'translateX(-100%) translateY(-50%)';
      } else if (position === 'right') {
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        transform = 'translateY(-50%)';
      }

      setCoords({ top, left, transform });
    }, 500);
  };

  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setCoords(null);
  };

  const arrowStyle = (): React.CSSProperties => {
    if (position === 'bottom') return {
      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
      borderBottom: '5px solid rgba(163,122,65,0.4)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
    };
    if (position === 'top') return {
      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
      borderTop: '5px solid rgba(163,122,65,0.4)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
    };
    if (position === 'right') return {
      position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
      borderRight: '5px solid rgba(163,122,65,0.4)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
    };
    if (position === 'left') return {
      position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
      borderLeft: '5px solid rgba(163,122,65,0.4)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
    };
    return {};
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{ display: 'inline-block' }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>

      {coords && createPortal(
        <div style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: coords.transform,
          background: 'rgba(163,122,65,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(163,122,65,0.35)',
          color: '#a37a41',
          fontSize: '0.7rem',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          padding: '6px 12px',
          borderRadius: '8px',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 4px 16px rgba(163,122,65,0.15)',
        }}>
          {text}
          <div style={arrowStyle()} />
        </div>,
        document.body
      )}
    </>
  );
}