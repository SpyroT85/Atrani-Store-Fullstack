import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const show = () => {
    timeout.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 8,
        });
      }
    }, 100);
  };

  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setCoords(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{ display: "block", width: "100%" }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>

      {coords && createPortal(
        <div
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            transform: "translateY(-50%)",
            background: "rgba(200,135,74,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(200,135,74,0.3)",
            color: "#C8874A",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            whiteSpace: 'nowrap',
            padding: "6px 12px",
            borderRadius: "8px",
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 4px 16px rgba(200,135,74,0.15)",
          }}
        >
          {text}
          <div style={{
            position: "absolute",
            right: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            borderRight: "5px solid rgba(200,135,74,0.4)",
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
          }} />
        </div>,
        document.body
      )}
    </>
  );
}